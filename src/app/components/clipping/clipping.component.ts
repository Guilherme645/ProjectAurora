import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import transcriptData from 'src/assets/transcricao_completa.json';

// --- Interfaces ---
interface TranscriptEntry {
  timestamp: number;
  end: number;
  text: string | SafeHtml;
  originalText: string;
}

interface TimeMark {
  left: string;
  label: string;
  timeMs: number;
  className?: string;
}

interface TimelineSegment {
  id: number;
  startTimeMs: number;
  endTimeMs: number;
}

interface ClippingData {
  titulo: string;
  descricao: string;
  sentimento: 'Automático' | 'Positivo' | 'Neutro' | 'Negativo';
}

@Component({
  selector: 'app-clipping',
  templateUrl: './clipping.component.html',
  styleUrls: ['./clipping.component.css'],
  standalone: false
})
export class ClippingComponent implements OnInit, AfterViewInit {
  // --- Referências de Elementos ---
  @ViewChild('playerVideo') videoPlayerRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('containerTimeline') timelineContainerRef!: ElementRef<HTMLElement>;
  @ViewChild('listaTranscricao') transcriptionListContainer!: ElementRef<HTMLElement>;
  @ViewChild('searchInput') searchInputRef!: ElementRef<HTMLInputElement>;

  // --- Estado Geral ---
  clippingData: ClippingData = {
    titulo: 'Insira o título da menção',
    descricao: 'Adicione uma descrição ao clipping',
    sentimento: 'Automático',
  };
  isSaveModalVisible = false;

headerVisivel: boolean = true;
ultimaPosicaoScroll: number = 0;


  // --- Estado da Transcrição e Busca ---
  fullTranscript: TranscriptEntry[] = [];
  transcricaoExibida: TranscriptEntry[] = [];
  buscaAtiva = false;
  termoBusca = '';
  totalResultados = 0;
  indiceResultadoAtual = -1;

  // --- Estado da Timeline ---
  readonly timelineScreenWidth = 554;
  segmentWidth = 554;
  timelineContainers: number[] = [0];
  selectedIndex: number | null = null;
  private timelineWidthPx = 554;
  videoDurationMs = 0;
  tempoAtualMs = 0;
  tempoInicialMs = 0;
  tempoFinalMs = 0;

  // MODIFICAÇÃO AQUI: Nova propriedade para rastrear se o vídeo está tocando
  isVideoPlaying: boolean = false;

  structuralMarkers: TimeMark[] = [];
  selectionStartLabel: TimeMark | null = null;
  selectionEndLabel: TimeMark | null = null;

  dragging: 'inicio' | 'fim' | null = null;
  draggingMarkerIndex: number | null = null;
  posicaoPlayerPx = 0;
  posicaoInicioPx = 0;
  posicaoFimPx = 0;
  private splitPointsMs: number[] = [];
 isWarningModalVisible = false;
  modalTitle = '';
  modalMessage = '';

  // --- Estado para Entidades Marcadas ---
  markedTextSegments: string[] = [];
  markedText: string = '';

@HostListener('window:keydown', ['$event'])
handleKeyboardEvent(event: KeyboardEvent) {
  // CORREÇÃO:
  // 1. Verifica por 'Delete' (maiúsculo) E 'Backspace'.
  // 2. Mantém a verificação se um segmento está selecionado (selectedIndex !== null).
  if ((event.key === 'Delete' || event.key === 'Backspace') && this.selectedIndex !== null) {
    
    // IMPORTANTE: Previne o comportamento padrão do navegador.
    // Impede que a tecla Backspace volte para a página anterior.
    event.preventDefault();
    
    // Chama a função para preparar e mostrar o modal.
    this.prepareDeleteModal();
  }
}

  constructor(
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.fullTranscript = transcriptData.map(item => ({ ...item, originalText: item.text }));
    this.updateDisplayedTranscript();
  }

  ngAfterViewInit(): void {
    this.recalculateLayout();
    this.cdr.detectChanges();
  }

onTranscriptionScroll(event: Event): void {
  const scrollTop = (event.target as HTMLElement).scrollTop;

  if (scrollTop > this.ultimaPosicaoScroll) {
    // Scroll para baixo → recolher
    this.headerVisivel = false;
  } else {
    // Scroll para cima → mostrar
    this.headerVisivel = true;
  }

  this.ultimaPosicaoScroll = scrollTop;
}


  // --- Listeners de Eventos Globais ---
  @HostListener('window:resize') onWindowResize(): void {
    this.recalculateLayout();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.dragging && this.draggingMarkerIndex === null) return;
    event.preventDefault();

    const rect = this.timelineContainerRef.nativeElement.getBoundingClientRect();
    const mouseX = Math.max(0, Math.min(event.clientX - rect.left, this.timelineWidthPx));
    
    // Lógica para arrastar as alças de seleção (handles)
    if (this.dragging) {
        const tempoMs = this.calculateTimeFromPosition(mouseX);
        if (this.dragging === 'inicio' && tempoMs < this.tempoFinalMs) {
            this.tempoInicialMs = tempoMs;
        } else if (this.dragging === 'fim' && tempoMs > this.tempoInicialMs) {
            this.tempoFinalMs = tempoMs;
        }
        this.updateAllPositions();
        this.updateDisplayedTranscript();
        this.adjustVideoPlayback();
    } 
    // MUDANÇA AQUI: Lógica para arrastar os marcadores de tempo
    else if (this.draggingMarkerIndex !== null) {
        const marker = this.structuralMarkers[this.draggingMarkerIndex];
        if (marker) {
            // Apenas atualiza a posição VISUAL (left) do marcador para dar o feedback.
            // Não altera o 'timeMs' ou o 'label' para que a mudança não seja permanente.
            marker.left = `${mouseX}px`;
        }
    }
  }

  prepareDeleteModal(): void {
    if (this.selectedIndex === null) {
      return;
    }

    const segmentDuration = 300000; // 5 minutos em ms
    const startTimeMs = this.selectedIndex * segmentDuration;
    const endTimeMs = startTimeMs + segmentDuration;

    const durationInMinutes = segmentDuration / 60000;
    const startTimeStr = this.formatTimestamp(startTimeMs);
    const endTimeStr = this.formatTimestamp(endTimeMs);

    this.modalTitle = `Remover ${durationInMinutes} minutos`;
    this.modalMessage = `Você deseja remover do clipping o seguinte trecho: <b>Globo News ${startTimeStr} até ${endTimeStr}?</b>`;
    
    this.isWarningModalVisible = true;
  }

   // As funções de confirmação e fechamento do modal permanecem as mesmas
// As funções de confirmação e fechamento do modal permanecem as mesmas
// As funções de confirmação e fechamento do modal permanecem as mesmas
handleDeleteConfirm(): void {
  if (this.selectedIndex === null) {
    return;
  }

  // Remove o container visual do segmento
  this.timelineContainers.splice(this.selectedIndex, 1);
  
  // Diminui a duração total da timeline em 5 minutos
  this.videoDurationMs -= 300000; // 300.000 ms = 5 minutos

  // ====================================================================
  // CORREÇÃO: Reseta os marcadores de início e fim para os novos
  // limites da timeline após a remoção de um trecho.
  // ====================================================================
  this.tempoInicialMs = 0;
  this.tempoFinalMs = this.videoDurationMs;

  // Limpa a seleção e fecha o modal
  this.selectedIndex = null;
  this.isWarningModalVisible = false;
  
  // Agora, ao recalcular, o layout usará a nova duração e os novos
  // tempos dos marcadores, corrigindo a posição de tudo.
  this.recalculateLayout(); 
  
  console.log('Trecho removido!');
}

  handleModalClose(): void {
    this.isWarningModalVisible = false;
  }

  @HostListener('window:mouseup')
  onMouseUp(): void {
    // MUDANÇA AQUI: Verifica se estávamos arrastando um marcador de tempo
    if (this.draggingMarkerIndex !== null) {
        // Se sim, redesenha TODOS os marcadores em seus lugares originais.
        // Isso faz com que o marcador arrastado "volte" para o lugar certo.
        this.generateTimeMarks();
    }

    this.dragging = null;
    this.draggingMarkerIndex = null;
    this.adjustVideoPlayback();
  }

  // --- Eventos do Player e Timeline ---
  onMetadadosCarregados(event: Event): void {
    const video = event.target as HTMLVideoElement;
    this.videoDurationMs = video.duration * 1000;
    this.tempoInicialMs = 0;
    this.tempoFinalMs = this.videoDurationMs;
    this.recalculateLayout();
    this.updateDisplayedTranscript();
  }

  onTempoAtualizado(event: Event): void {
    if (this.dragging || this.draggingMarkerIndex !== null) return;
    this.tempoAtualMs = (event.target as HTMLVideoElement).currentTime * 1000;
    this.updateAllPositions();
    this.checkPlaybackBounds();
  }

  iniciarArrasto(handle: 'inicio' | 'fim', event: MouseEvent): void {
    event.stopPropagation();
    this.dragging = handle;
    this.draggingMarkerIndex = null;
    this.selectedIndex = null;
  }

  iniciarArrastoMarcador(event: MouseEvent, index: number): void {
    event.stopPropagation();
    this.draggingMarkerIndex = index;
    this.dragging = null;
  }
  

  // Adicione esta função dentro da classe ClippingComponent

/**
  * Verifica se um marcador de tempo específico está dentro do segmento da timeline
  * que está atualmente selecionado.
  * @param marker O objeto do marcador de tempo a ser verificado.
  * @returns {boolean} True se o marcador estiver no segmento selecionado, senão false.
  */
public isMarkerInSelectedSegment(marker: TimeMark): boolean {
  // Se nenhum segmento estiver selecionado, não há o que fazer.
  if (this.selectedIndex === null) {
    return false;
  }

  // Calcula o tempo de início e fim do segmento selecionado.
  // Cada segmento tem 300.000 ms (5 minutos).
  const segmentStartTimeMs = this.selectedIndex * 300000;
  const segmentEndTimeMs = segmentStartTimeMs + 360000; // 6 minutos * 60.000 ms

  // Retorna true se o tempo do marcador estiver dentro do intervalo do segmento.
  return marker.timeMs >= segmentStartTimeMs && marker.timeMs <= segmentEndTimeMs;
}
  
  // (Opcional) Você pode manter ou remover esta função se não quiser o clique duplo.
  definirMarcadorComoInicioOuFim(index: number): void {
    const markerTime = this.structuralMarkers[index].timeMs;

    const diffInicio = Math.abs(markerTime - this.tempoInicialMs);
    const diffFim = Math.abs(markerTime - this.tempoFinalMs);

    if (diffInicio <= diffFim && markerTime < this.tempoFinalMs) {
      this.tempoInicialMs = markerTime;
    } else if (markerTime > this.tempoInicialMs) {
      this.tempoFinalMs = markerTime;
    }

    this.selectedIndex = null;
    this.updateAllPositions();
    this.updateDisplayedTranscript();
    this.adjustVideoPlayback();
  }

  // --- Lógica de Blocos da Timeline ---
  addTimelineContainer(): void {
    this.timelineContainers.push(this.timelineContainers.length);
    this.videoDurationMs += 300000;
    this.recalculateLayout();
    this.updateDisplayedTranscript();
  }

  selectContainer(index: number | null, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    if (this.selectedIndex === index) {
      this.selectedIndex = null;
    } else {
      this.selectedIndex = index;
      if (index !== null) {
        const segmentStart = index * 300000;
        const segmentEnd = Math.min((index + 1) * 300000, this.videoDurationMs);
        this.tempoInicialMs = segmentStart;
        this.tempoFinalMs = segmentEnd;
        this.updateAllPositions();
        this.updateDisplayedTranscript();
        this.adjustVideoPlayback();
      }
    }
    this.updateSelectionLabels();
  }

  recalculateLayout(): void {
    const numSegments = this.timelineContainers.length;
    if (numSegments > 0) {
      this.segmentWidth = this.timelineWidthPx / numSegments;
    }
    this.generateTimeMarks();
    this.updateAllPositions();
  }

  // --- Lógica de Segmentação ---
  public get selectionSegments(): TimelineSegment[] {
    if (this.tempoFinalMs <= this.tempoInicialMs) {
      return [];
    }
    const relevantSplits = this.splitPointsMs
      .filter(split => split > this.tempoInicialMs && split < this.tempoFinalMs)
      .sort((a, b) => a - b);
    const segmentBoundaries = [this.tempoInicialMs, ...relevantSplits, this.tempoFinalMs];
    const segments: TimelineSegment[] = [];
    for (let i = 0; i < segmentBoundaries.length - 1; i++) {
      segments.push({
        id: i,
        startTimeMs: segmentBoundaries[i],
        endTimeMs: segmentBoundaries[i + 1]
      });
    }
    return segments;
  }

  // --- Lógica de Controle de Reprodução do Vídeo ---
  adjustVideoPlayback(): void {
    if (this.videoPlayerRef && this.tempoInicialMs !== null && this.tempoFinalMs !== null) {
      const video = this.videoPlayerRef.nativeElement;
      if (video.currentTime * 1000 < this.tempoInicialMs) {
        video.currentTime = this.tempoInicialMs / 1000;
      } else if (video.currentTime * 1000 > this.tempoFinalMs) {
        video.currentTime = this.tempoInicialMs / 1000;
        video.play();
      }
    }
  }

  checkPlaybackBounds(): void {
    if (this.videoPlayerRef && this.tempoFinalMs > this.tempoInicialMs) {
      const video = this.videoPlayerRef.nativeElement;
      if (this.tempoAtualMs >= this.tempoFinalMs) {
        video.currentTime = this.tempoInicialMs / 1000;
        video.play();
      }
    }
  }

  // --- Lógica da Transcrição e Busca ---
  updateDisplayedTranscript(): void {
    let items = [...this.fullTranscript];
    if (this.tempoFinalMs > this.tempoInicialMs) {
      items = items.filter(t => t.end >= this.tempoInicialMs && t.timestamp <= this.tempoFinalMs);
    }
    items = items.map((item, index) => {
      let textToDisplay: string | SafeHtml = item.originalText;
      if (this.markedTextSegments.length === this.fullTranscript.length && this.markedTextSegments[index]) {
        textToDisplay = this.markedTextSegments[index];
      }
      if (this.buscaAtiva && this.termoBusca.trim()) {
        const searchTermLower = this.termoBusca.toLowerCase();
        const regex = new RegExp(this.termoBusca.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        const textToHighlight = typeof textToDisplay === 'string' ? textToDisplay : item.originalText;
        if (textToHighlight.toLowerCase().includes(searchTermLower)) {
          const highlightedText = textToHighlight.replace(regex, match => `<mark class="bg-yellow-200 rounded px-0.5 py-0">${match}</mark>`);
          textToDisplay = this.sanitizer.bypassSecurityTrustHtml(highlightedText);
        }
      } else {
        if (typeof textToDisplay === 'string') {
          textToDisplay = this.sanitizer.bypassSecurityTrustHtml(textToDisplay);
        }
      }
      return { ...item, text: textToDisplay };
    });
    this.transcricaoExibida = items;
    if (this.buscaAtiva && this.termoBusca.trim()) {
      this.totalResultados = this.transcricaoExibida.reduce((count, item) => {
        const textContent = typeof item.text === 'string' ? item.text : (item.text as any).changingThisBreaksApplicationSecurity || item.text.toString();
        return count + (textContent.match(/<mark/g) || []).length;
      }, 0);
      if (this.indiceResultadoAtual >= this.totalResultados || this.indiceResultadoAtual < 0) {
        this.indiceResultadoAtual = this.totalResultados > 0 ? 0 : -1;
      }
    } else {
      this.totalResultados = 0;
      this.indiceResultadoAtual = -1;
    }
    if (this.buscaAtiva && this.totalResultados > 0 && this.indiceResultadoAtual === 0) {
      this.scrollToCurrentMatch(false);
    } else if (!this.buscaAtiva) {
      this.clearSearchHighlight();
    }
  }

  // --- Manipulação de Eventos de Entidades ---
  updateMarkedText(event: string): void {
    this.markedText = event;
    this.updateDisplayedTranscript();
  }

  updateMarkedTextSegments(event: string[]): void {
    this.markedTextSegments = event;
    this.updateDisplayedTranscript();
  }

  onBuscaChange(): void {
    this.indiceResultadoAtual = 0;
    this.updateDisplayedTranscript();
    this.scrollToCurrentMatch(false);
  }
  
  ativarBusca(): void {
    this.buscaAtiva = true;
    setTimeout(() => this.searchInputRef?.nativeElement.focus(), 0);
  }

  desativarBusca(): void {
    this.buscaAtiva = false;
    this.termoBusca = '';
    this.indiceResultadoAtual = -1;
    this.totalResultados = 0;
    this.updateDisplayedTranscript();
    this.clearSearchHighlight();
  }

  limparTermoBusca(): void {
    this.termoBusca = '';
    this.onBuscaChange();
    this.searchInputRef?.nativeElement.focus();
  }

  navigateToPreviousMatch(): void {
    if (this.totalResultados === 0 || this.indiceResultadoAtual <= 0) return;
    this.indiceResultadoAtual--;
    this.scrollToCurrentMatch();
  }

  navigateToNextMatch(): void {
    if (this.totalResultados === 0 || this.indiceResultadoAtual >= this.totalResultados - 1) return;
    this.indiceResultadoAtual++;
    this.scrollToCurrentMatch();
  }

  private scrollToCurrentMatch(smooth: boolean = true): void {
    if (this.indiceResultadoAtual < 0 || this.indiceResultadoAtual >= this.totalResultados || !this.transcriptionListContainer) {
      this.clearSearchHighlight();
      return;
    }
    setTimeout(() => {
      const allMarkedElements = Array.from(this.transcriptionListContainer.nativeElement.querySelectorAll('.transcription-item mark')) as HTMLElement[];
      this.clearSearchHighlight();
      if (allMarkedElements.length > 0 && this.indiceResultadoAtual < allMarkedElements.length) {
        const currentMarkElement = allMarkedElements[this.indiceResultadoAtual];
        const parentItem = currentMarkElement.closest('.transcription-item') as HTMLElement;
        if (parentItem) {
          parentItem.classList.add('current-search-match');
          parentItem.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'nearest' });
        }
      }
    }, 0);
  }

  private clearSearchHighlight(): void {
    if (!this.transcriptionListContainer) return;
    const highlightedItems = this.transcriptionListContainer.nativeElement.querySelectorAll('.current-search-match');
    highlightedItems.forEach(item => item.classList.remove('current-search-match'));
  }
  
  irParaTimestamp(tempoMs: number): void {
    if (this.videoPlayerRef && this.tempoInicialMs !== null && this.tempoFinalMs !== null) {
      const video = this.videoPlayerRef.nativeElement;
      if (tempoMs >= this.tempoInicialMs && tempoMs <= this.tempoFinalMs) {
        video.currentTime = tempoMs / 1000;
        video.play();
      } else {
        video.currentTime = this.tempoInicialMs / 1000;
        video.play();
      }
    }
  }
  
  // --- Métodos Utilitários e de Interação ---
  openSaveModal(): void { this.isSaveModalVisible = true; }
  closeSaveModal(): void { this.isSaveModalVisible = false; }
  onCloseDrawer(): void {}
  onOpenEntityOptions(event: any): void {}

  private updateAllPositions(): void {
    this.posicaoInicioPx = this.calculatePositionFromTime(this.tempoInicialMs);
    this.posicaoFimPx = this.calculatePositionFromTime(this.tempoFinalMs);
    this.posicaoPlayerPx = this.calculatePositionFromTime(this.tempoAtualMs);
    this.updateSelectionLabels();
  }

  public calculatePositionFromTime(timeMs: number): number {
    if (!this.videoDurationMs || !this.timelineWidthPx) return 0;
    return (timeMs / this.videoDurationMs) * this.timelineWidthPx;
  }

  private calculateTimeFromPosition(positionPx: number): number {
    if (!this.timelineWidthPx || !this.videoDurationMs) return 0;
    return (positionPx / this.timelineWidthPx) * this.videoDurationMs;
  }

  private generateTimeMarks(): void {
    this.structuralMarkers = [];
    if (this.videoDurationMs <= 0) return;

    const intervalMs = 60000;
    const numMarks = Math.floor(this.videoDurationMs / intervalMs);

    for (let i = 0; i <= numMarks; i++) {
      const timeMs = i * intervalMs;
      if (timeMs > this.videoDurationMs) continue;

      this.structuralMarkers.push({
        label: this.formatTimestamp(timeMs),
        left: `${this.calculatePositionFromTime(timeMs)}px`,
        timeMs: timeMs
      });
    }
  }

  private updateSelectionLabels(): void {
    if (this.selectedIndex !== null) {
      this.selectionStartLabel = null;
      this.selectionEndLabel = null;
      return;
    }

    this.selectionStartLabel = {
      label: this.formatTimestamp(this.tempoInicialMs),
      left: `${this.posicaoInicioPx}px`,
      timeMs: this.tempoInicialMs,
      className: 'selection-marker start-marker'
    };

    this.selectionEndLabel = {
      label: this.formatTimestamp(this.tempoFinalMs),
      left: `${this.posicaoFimPx}px`,
      timeMs: this.tempoFinalMs,
      className: 'selection-marker end-marker'
    };
  }

  updateSentimento(sentimento: string): void {
    const validSentimentos: ClippingData['sentimento'][] = ['Automático', 'Positivo', 'Neutro', 'Negativo'];
    if (validSentimentos.includes(sentimento as ClippingData['sentimento'])) {
      this.clippingData.sentimento = sentimento as ClippingData['sentimento'];
    } else {
      console.warn(`Invalid sentimento value: ${sentimento}. Defaulting to 'Automático'.`);
      this.clippingData.sentimento = 'Automático';
    }
  }

  formatTimestamp(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
}