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

  isSelectionActive = false;
  // --- Propriedades auxiliares ---
  startMoved = false; // alça esquerda já foi movimentada
  endMoved = false;   // alça direita já foi movimentada

  edgeThreshold = 1;  // tolerância para considerar "na ponta" (px)
  timelineWidth = 0;  // largura do container da timeline (definida no AfterViewInit)
  handleWidth = 0;    // se quiser mais precisão, pode medir a largura da alça

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
  public timelineWidthPx = 554;
  videoDurationMs = 0;
  tempoAtualMs = 0;
  tempoInicialMs = 0;
  tempoFinalMs = 0;

  // MODIFICAÇÃO AQUI: Nova propriedade para rastrear se o vídeo está tocando
  isVideoPlaying: boolean = false;

  structuralMarkers: TimeMark[] = [];
  selectionStartLabel: TimeMark | null = null;
  selectionEndLabel: TimeMark | null = null;
realVideoDurationMs = 0;         // <-- ADICIONE ESTA LINHA: Duração REAL do vídeo
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
    // largura real da timeline baseada no elemento
    this.timelineWidthPx = this.timelineContainerRef?.nativeElement?.clientWidth || this.timelineWidthPx;
    this.cdr.detectChanges();
  }

  @HostListener('window:resize') onWindowResize(): void {
    this.timelineWidthPx = this.timelineContainerRef?.nativeElement?.clientWidth || this.timelineWidthPx;
    this.recalculateLayout();
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

  isFullSelectionPlayed(): boolean {
    return false;
  }

  get selectionPlayedWidthPx(): number {
    const progress = Math.min(this.selectionProgressPx, this.selectionEndPx);
    return Math.max(0, progress - this.selectionStartPx);
  }

  get selectionUnplayedWidthPx(): number {
    const total = Math.max(0, this.selectionEndPx - this.selectionStartPx);
    const played = Math.max(0, Math.min(this.selectionPlayedWidthPx, total));
    return Math.max(0, total - played);
  }

  isTimestampInSelection(itemOrMs: number | { timestamp: number; end?: number }): boolean {
    if (!this.isEffectiveSelection) return false;

    const selStart = this.tempoInicialMs;
    const selEnd   = this.tempoFinalMs;

    let itemStart: number;
    let itemEnd: number;

    if (typeof itemOrMs === 'number') {
      itemStart = itemOrMs;
      itemEnd   = itemOrMs;
    } else {
      itemStart = itemOrMs.timestamp ?? 0;
      itemEnd   = itemOrMs.end ?? itemStart;
    }

    // Interseção de [itemStart, itemEnd) com [selStart, selEnd)
    return (itemEnd > selStart) && (itemStart < selEnd);
  }

  get hasSelection(): boolean {
    return Number.isFinite(this.tempoInicialMs) &&
           Number.isFinite(this.tempoFinalMs) &&
           this.tempoFinalMs > this.tempoInicialMs;
  }

  get isFullSelection(): boolean {
    const dur = this.videoDurationMs ?? 0;
    // tolerância pequena para arredondamentos
    const EPS = 2; // ms
    return this.hasSelection &&
           this.tempoInicialMs <= EPS &&
           this.tempoFinalMs >= (dur - EPS);
  }

  get isEffectiveSelection(): boolean {
    return this.hasSelection && !this.isFullSelection;
  }

  isAtLeftEdge(): boolean {
    return this.posicaoInicioPx <= this.edgeThreshold;
  }

  // Detecta se a alça direita está na ponta direita (em px, com tolerância)
  isAtRightEdge(): boolean {
    return (this.timelineWidthPx - this.posicaoFimPx) <= this.edgeThreshold;
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
        // A chamada problemática foi removida.
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

  finalizarArrasto(event: MouseEvent) {
    if (this.dragging) {
      // ... (seu código atual de atualização de tempo) ...

      // O estado de arrasto é desativado
      this.dragging = null;
      
      // O estado de seleção ativa é ligado, pois o usuário terminou de arrastar
      this.isSelectionActive = true;
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

 handleDeleteConfirm(): void {
    if (this.selectedIndex === null) {
      return;
    }

    // Remove o container visual do segmento
    this.timelineContainers.splice(this.selectedIndex, 1);
    
    // --- REMOVA ESTA LINHA ---
    // this.videoDurationMs -= 300000; 

    // --- REMOVA ESTAS LINHAS ---
    // this.tempoInicialMs = 0;
    // this.tempoFinalMs = this.videoDurationMs;

    // --- ADICIONE ESTA LINHA ---
    // Recalcula a duração com base nos containers restantes e reseta os tempos
    this.updateVirtualDuration();

    // Limpa a seleção e fecha o modal
    this.selectedIndex = null;
    this.isWarningModalVisible = false;
    
    this.recalculateLayout(); 
    
    console.log('Trecho removido!');
  }
  handleModalClose(): void {
    this.isWarningModalVisible = false;
  }

  @HostListener('window:mouseup')
  onMouseUp(): void {
    const wasDraggingSelection = !!this.dragging;

    if (this.draggingMarkerIndex !== null) {
      this.generateTimeMarks();
    }

    this.dragging = null;
    this.draggingMarkerIndex = null;

    // NOVA LÓGICA PRINCIPAL
    if (wasDraggingSelection) {
      // Se o usuário estava arrastando um marcador, reseta o progresso para 0
      if (this.videoPlayerRef) {
        this.videoPlayerRef.nativeElement.currentTime = 0;
        this.videoPlayerRef.nativeElement.pause(); // Garante que o vídeo fique pausado em 00:00
      }
      this.tempoAtualMs = 0;
      this.updateAllPositions(); // Atualiza a UI para refletir o tempo 0
    } else {
      // Mantém o comportamento antigo para outras ações (ex: clique simples fora dos marcadores)
      this.adjustVideoPlayback();
    }
  }

// Assumindo que você tem estas propriedades no seu componente:
// tempoInicialMs: number;
// tempoFinalMs: number;
// videoDurationMs: number; // <--- Duração total do vídeo em milissegundos

/**
 * Retorna a classe de cor para o handle (marcador) com base em sua posição.
 * Retorna 'handle--black' se estiver na extremidade (início ou fim).
 * Retorna 'handle--yellow800' se estiver em qualquer outra posição.
 */
computeHandleBgClass(handleType: 'inicio' | 'fim'): string {

  if (handleType === 'inicio') {
    // 1. Verifica se o marcador INICIAL está na extremidade (0)
    if (this.tempoInicialMs === 0) {
      return 'handle--black';
    }
  } 
  
  if (handleType === 'fim') {
    // 2. Verifica se o marcador FINAL está na extremidade (duração total)
    //    Certifique-se que 'this.videoDurationMs' contém a duração total do vídeo em milissegundos.
    if (this.tempoFinalMs === this.videoDurationMs) {
      return 'handle--black';
    }
  }

  // 3. Se não estiver em nenhuma extremidade, volta para o amarelo
  return 'handle--yellow800';
}

  // --- Eventos do Player e Timeline ---
 // --- Eventos do Player e Timeline ---
 // --- Eventos do Player e Timeline ---
  onMetadadosCarregados(event: Event): void {
    const video = event.target as HTMLVideoElement;
    
    // 1. Armazena a duração REAL do arquivo de vídeo
    this.realVideoDurationMs = video.duration * 1000;

    // 2. FORÇA a timeline a começar com exatamente 1 bloco de 5 minutos
    this.timelineContainers = [0]; 

    // 3. Define a duração VIRTUAL da timeline (videoDurationMs) para 5 minutos
    //    e reseta os tempos de início/fim para 0 e 5 minutos.
    this.updateVirtualDuration(); 

    // 4. Recalcula o layout (segmentWidth, marcadores de tempo)
    this.recalculateLayout();
    
    // 5. Atualiza a transcrição para mostrar apenas os primeiros 5 minutos
    this.updateDisplayedTranscript();
  }

  onPlay(): void {
    this.isVideoPlaying = true;
    if (this.videoPlayerRef) {
      const video = this.videoPlayerRef.nativeElement;
      const currentTimeMs = video.currentTime * 1000;
      
      // Verifica se o tempo atual está fora do intervalo selecionado
      // (antes do início ou depois do fim)
      if (currentTimeMs < this.tempoInicialMs || currentTimeMs >= this.tempoFinalMs) {
        // Se estiver, move a agulha para o início da seleção antes de tocar
        video.currentTime = this.tempoInicialMs / 1000;
      }
    }
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

    // >>> ADIÇÃO: marcar como “movida”
    if (handle === 'inicio') this.startMoved = true;
    if (handle === 'fim') this.endMoved = true;
  }

  iniciarArrastoMarcador(event: MouseEvent, index: number): void {
    event.stopPropagation();
    this.draggingMarkerIndex = index;
    this.dragging = null;
  }

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
    const segmentEndTimeMs = segmentStartTimeMs + 300000; // 5 minutos * 60.000 ms (corrigido para 5 min)

    // Retorna true se o tempo do marcador estiver dentro do intervalo do segmento.
    return marker.timeMs >= segmentStartTimeMs && marker.timeMs < segmentEndTimeMs;
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

addTimelineContainer(): void {
    this.timelineContainers.push(this.timelineContainers.length);

    // --- REMOVA ESTAS LINHAS ---
    // this.videoDurationMs += 300000; 
    // this.tempoFinalMs = this.videoDurationMs; 
    
    // --- ADICIONE ESTA LINHA ---
    this.updateVirtualDuration(); 

    this.recalculateLayout();
    this.updateDisplayedTranscript();
  }
removeTimelineContainer(): void {
    if (this.timelineContainers.length > 1) {
      this.timelineContainers.pop();

      // --- REMOVA ESTAS LINHAS ---
      // this.videoDurationMs = Math.max(300000, this.videoDurationMs - 300000); 
      // this.tempoFinalMs = this.videoDurationMs; 
      
      // --- ADICIONE ESTA LINHA ---
      this.updateVirtualDuration(); 

      this.recalculateLayout();
      this.updateDisplayedTranscript();
    }
  }

  selectContainer(index: number | null, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    if (this.selectedIndex === index) {
      this.selectedIndex = null;
      this.isSelectionActive = false; // Adicione esta linha
    } else {
      this.selectedIndex = index;
      this.isSelectionActive = true; // Adicione esta linha

      if (index !== null) {
        const segmentDuration = 300000; // 5 minutos
        const segmentStart = index * segmentDuration;
        const segmentEnd = Math.min(segmentStart + segmentDuration, this.videoDurationMs);
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
      // Pega o fim real do ARQUIVO de vídeo
      const realEndTimeMs = video.duration * 1000; 

      let effectiveEndTimeMs: number;

      if (this.isEffectiveSelection) {
        // 1. Se for uma seleção customizada (ex: 1:00 a 1:30), 
        //    o fim é o fim da SELEÇÃO.
        effectiveEndTimeMs = this.tempoFinalMs;
      } else {
        // 2. Se a seleção for a timeline "cheia", 
        //    o fim é o fim REAL do vídeo.
        effectiveEndTimeMs = realEndTimeMs;
      }

      // Se o tempo atual for maior ou igual ao fim (e o fim é válido)
      // Adicionamos uma pequena tolerância (500ms) para evitar loops estranhos
      if (effectiveEndTimeMs > 0 && (this.tempoAtualMs >= effectiveEndTimeMs - 500)) {
        
        // Verifica se o tempo atual está "próximo" do fim, para evitar
        // pular se o usuário clicar manualmente depois do fim.
        if (Math.abs(this.tempoAtualMs - effectiveEndTimeMs) < 500) { 
          video.currentTime = this.tempoInicialMs / 1000;
          video.play();
        }
      }
    }
  }

  // --- Lógica da Transcrição e Busca ---
  updateDisplayedTranscript(): void {
    let items = [...this.fullTranscript];
    // Filtra a transcrição com base na seleção atual, mas respeita a duração virtual
    if (this.hasSelection) {
      items = items.filter(t => t.end > this.tempoInicialMs && t.timestamp < this.tempoFinalMs);
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
      // Clamp o timestamp à seleção atual
      const clampedTime = Math.max(this.tempoInicialMs, Math.min(tempoMs, this.tempoFinalMs));
      video.currentTime = clampedTime / 1000;
      video.play();
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

  const intervalMs = 60000; // seu step atual (30s)
  const numMarks = Math.floor(this.videoDurationMs / intervalMs);

  for (let i = 0; i < numMarks; i++) { // <<< troquei <= por <
    const timeMs = i * intervalMs;
    this.structuralMarkers.push({
      label: this.formatTimestamp(timeMs),
      left: `${this.calculatePositionFromTime(timeMs)}px`,
      timeMs
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

  get selectionStartPx(): number {
    return this.calculatePositionFromTime(this.tempoInicialMs);
  }

  get selectionEndPx(): number {
    return this.calculatePositionFromTime(this.tempoFinalMs);
  }

  get selectionProgressPx(): number {
    // progresso CLAMPED dentro do intervalo selecionado
    const clamped = Math.max(this.tempoInicialMs, Math.min(this.tempoAtualMs, this.tempoFinalMs));
    return this.calculatePositionFromTime(clamped);
  }

  get playedWidthPx(): number {
    return Math.max(0, this.selectionProgressPx - this.selectionStartPx);
  }

  get unplayedWidthPx(): number {
    return Math.max(0, this.selectionEndPx - this.selectionProgressPx);
  }

  get isSelectionFullPlayed(): boolean {
    return this.tempoAtualMs >= this.tempoFinalMs;
  }
  /**
   * Atualiza a duração virtual da timeline (videoDurationMs) para ser
   * um múltiplo exato de 5 minutos, baseado no número de containers.
   */
  private updateVirtualDuration(): void {
    const fiveMinutesMs = 300000;

    // Garante que haja pelo menos 1 container (5 minutos)
    if (this.timelineContainers.length === 0) {
      // Se por algum motivo a lista estiver vazia, recria o primeiro.
      // A função 'handleDeleteConfirm' já previne isso, mas é uma segurança.
      // A 'removeTimelineContainer' também previne de zerar.
      // Vamos garantir que a 'onMetadadosCarregados' crie pelo menos 1.
      this.timelineContainers = [0];
    }

    // A duração total é SEMPRE o número de blocos * 5 minutos
    this.videoDurationMs = this.timelineContainers.length * fiveMinutesMs;

    // Reseta a seleção de tempo para os novos limites da timeline
    this.tempoInicialMs = 0;
    this.tempoFinalMs = this.videoDurationMs;

    // Garante que a agulha (playhead) não fique fora dos limites
    if (this.tempoAtualMs > this.videoDurationMs) {
      this.tempoAtualMs = this.videoDurationMs;
    }
  }

  getTimelineBorderClass(): string {
  // Verifica se o marcador inicial está em 0
  const isStartAtEdge = (this.tempoInicialMs === 0);
  
  // Verifica se o marcador final está na duração total
  const isEndAtEdge = (this.tempoFinalMs === this.videoDurationMs);

  if (isStartAtEdge && isEndAtEdge) {
    // Se AMBOS estão nas pontas, a borda fica preta
    return 'timeline-border-black';
  } else {
    // Se QUALQUER um deles for movido, a borda fica amarela
    return 'timeline-border-yellow';
  }
}

// ... (no seu arquivo clipping.component.ts)

/**
 * Retorna as classes CSS corretas para um segmento da timeline base.
 * Esta função é chamada pelo [ngClass] no *ngFor dos segmentos.
 */
getSegmentClass(index: number): any {

  // 1. Se o usuário estiver com uma seleção ativa (puxou os marcadores)
  if (this.isEffectiveSelection) {
    // Aplica a classe que deixa o fundo cinza e sem borda.
    return { 'timeline-segment-disabled': true };
  }

  // 2. Se não houver seleção, usa a lógica antiga:
  //    (azul escuro se selecionado, azul claro se não selecionado)
  return {
    'bg-blue-600 border-blue-800': this.selectedIndex === index,
    'bg-blue-600/20 border-blue-500/30': this.selectedIndex !== index
  };
}

// ... (resto do seu código .ts)
}