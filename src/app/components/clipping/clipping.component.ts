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

  // --- Estado da Transcrição e Busca ---
  fullTranscript: TranscriptEntry[] = [];
  transcricaoExibida: TranscriptEntry[] = [];
  buscaAtiva = false;
  termoBusca = '';
  totalResultados = 0;
  indiceResultadoAtual = -1;

  // --- Estado da Timeline ---
  private timelineWidthPx = 0;
  videoDurationMs = 0;
  tempoAtualMs = 0;
  tempoInicialMs = 0;
  tempoFinalMs = 0;
  marcadoresTempo: TimeMark[] = [];
  dragging: 'inicio' | 'fim' | null = null;
  draggingMarkerIndex: number | null = null;
  posicaoPlayerPx = 0;
  posicaoInicioPx = 0;
  posicaoFimPx = 0;
  private splitPointsMs: number[] = []; // Armazena os pontos de corte para criar segmentos

  // --- Estado para Entidades Marcadas ---
  markedTextSegments: string[] = [];
  markedText: string = '';

  constructor(
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fullTranscript = transcriptData.map(item => ({ ...item, originalText: item.text }));
    this.updateDisplayedTranscript();
  }

  ngAfterViewInit(): void {
    this.updateTimelineWidth();
    this.cdr.detectChanges();
  }

  // --- Listeners de Eventos Globais ---
  @HostListener('window:resize') onWindowResize(): void {
    this.updateTimelineWidth();
    this.updateAllPositions();
  }

  @HostListener('window:mousemove', ['$event']) 
  onMouseMove(event: MouseEvent): void {
    if (!this.dragging && this.draggingMarkerIndex === null) return;
    event.preventDefault();

    const rect = this.timelineContainerRef.nativeElement.getBoundingClientRect();
    const mouseX = Math.max(0, Math.min(event.clientX - rect.left, this.timelineWidthPx));
    const tempoMs = this.calculateTimeFromPosition(mouseX);

    if (this.dragging === 'inicio' && tempoMs < this.tempoFinalMs) {
      this.tempoInicialMs = tempoMs;
    } else if (this.dragging === 'fim' && tempoMs > this.tempoInicialMs) {
      this.tempoFinalMs = tempoMs;
    } else if (this.draggingMarkerIndex !== null) {
      const marker = this.marcadoresTempo[this.draggingMarkerIndex];
      marker.timeMs = tempoMs;
      marker.left = `${mouseX}px`;
      marker.label = this.formatTimestamp(tempoMs);
    }

    this.updateAllPositions();
    this.updateDisplayedTranscript();
    this.adjustVideoPlayback();
  }

  @HostListener('window:mouseup') 
  onMouseUp(): void {
    this.dragging = null;
    this.draggingMarkerIndex = null;
    this.adjustVideoPlayback();
  }

  // --- Eventos do Player e Timeline ---
  onMetadadosCarregados(event: Event): void {
    const video = event.target as HTMLVideoElement;
    this.videoDurationMs = video.duration * 1000;
    this.tempoFinalMs = this.videoDurationMs;
    this.tempoInicialMs = 0;
    this.updateTimelineWidth();
    this.updateAllPositions();
    this.generateTimeMarks();
    this.updateDisplayedTranscript();
  }

  onTempoAtualizado(event: Event): void {
    if (this.dragging || this.draggingMarkerIndex !== null) return;
    this.tempoAtualMs = (event.target as HTMLVideoElement).currentTime * 1000;
    console.log('tempoAtualMs atualizado para:', this.formatTimestamp(this.tempoAtualMs));
    this.updateAllPositions();
    this.checkPlaybackBounds();
  }

  iniciarArrasto(handle: 'inicio' | 'fim'): void {
    this.dragging = handle;
    this.draggingMarkerIndex = null;
  }

  iniciarArrastoMarcador(event: MouseEvent, index: number): void {
    event.stopPropagation();
    this.draggingMarkerIndex = index;
    this.dragging = null;
  }

  definirMarcadorComoInicioOuFim(index: number): void {
    const markerTime = this.marcadoresTempo[index].timeMs;

    const diffInicio = Math.abs(markerTime - this.tempoInicialMs);
    const diffFim = Math.abs(markerTime - this.tempoFinalMs);

    if (diffInicio <= diffFim && markerTime < this.tempoFinalMs) {
      this.tempoInicialMs = markerTime;
    } else if (markerTime > this.tempoInicialMs) {
      this.tempoFinalMs = markerTime;
    }

    this.updateAllPositions();
    this.updateDisplayedTranscript();
    this.adjustVideoPlayback();
  }

  // --- Nova Lógica para Segmentos ---
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

addTimelineSegment(): void {
  console.log('Botão +5min clicado');
  if (this.videoPlayerRef) {
    this.tempoAtualMs = this.videoPlayerRef.nativeElement.currentTime * 1000;
    console.log('tempoAtualMs forçado para:', this.formatTimestamp(this.tempoAtualMs));
  }
  console.log('tempoInicialMs:', this.tempoInicialMs);
  console.log('tempoFinalMs:', this.tempoFinalMs);
  console.log('splitPointsMs antes:', [...this.splitPointsMs]);

  const cutTimeMs = this.tempoAtualMs;
  const minDistanceMs = 1000; // Tolerância mínima de 1 segundo entre cortes

  // Verifica se o corte está dentro do intervalo total e não é excessivamente próximo de um ponto existente
  const isTooClose = this.splitPointsMs.some(point => Math.abs(point - cutTimeMs) < minDistanceMs);
  if (cutTimeMs >= 0 && cutTimeMs < this.tempoFinalMs && !isTooClose) {
    this.splitPointsMs.push(cutTimeMs);
    this.splitPointsMs.sort((a, b) => a - b); // Mantém a ordem crescente
    this.cdr.detectChanges(); // Força a detecção de mudanças
    console.log('Novo corte adicionado em:', this.formatTimestamp(cutTimeMs));
    console.log('splitPointsMs depois:', [...this.splitPointsMs]);
  } else {
    console.log('Condição de corte não atendida. Razões possíveis:');
    if (cutTimeMs < 0) console.log('- cutTimeMs < 0 (inválido)');
    if (cutTimeMs >= this.tempoFinalMs) console.log('- cutTimeMs >= tempoFinalMs');
    if (isTooClose) console.log('- Ponto muito próximo de um corte existente (menos de 1 segundo)');
    if (cutTimeMs === this.tempoAtualMs && this.tempoAtualMs === 0) console.log('- tempoAtualMs não atualizado (provavelmente vídeo pausado ou não carregado)');
  }
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

  private updateTimelineWidth(): void {
    if (this.timelineContainerRef) {
      this.timelineWidthPx = this.timelineContainerRef.nativeElement.offsetWidth;
    }
  }

  private updateAllPositions(): void {
    this.posicaoInicioPx = this.calculatePositionFromTime(this.tempoInicialMs);
    this.posicaoFimPx = this.calculatePositionFromTime(this.tempoFinalMs);
    this.posicaoPlayerPx = this.calculatePositionFromTime(this.tempoAtualMs);
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
    this.marcadoresTempo = [];
    if (this.videoDurationMs <= 0) return;
    const intervalMs = 60000;
    const numMarks = Math.floor(this.videoDurationMs / intervalMs);
    for (let i = 0; i <= numMarks; i++) {
      const timeMs = i * intervalMs;
      this.marcadoresTempo.push({
        label: this.formatTimestamp(timeMs),
        left: `${this.calculatePositionFromTime(timeMs)}px`,
        timeMs: timeMs
      });
    }
  }

  formatTimestamp(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
}