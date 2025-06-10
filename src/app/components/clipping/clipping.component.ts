import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { TextoEntidadesService } from 'src/app/services/TextoEntidades.service';
import transcriptData from 'src/assets/transcricao_completa.json';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface TranscriptEntry {
  timestamp: number;
  end: number;
  text: string | SafeHtml;
  originalText: string;
}

@Component({
  selector: 'app-clipping',
  templateUrl: './clipping.component.html',
  styleUrls: ['./clipping.component.css'],
  standalone: false,
})
export class ClippingComponent implements OnInit, AfterViewInit {
  // --- REFERÊNCIAS DE ELEMENTOS ---
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('transcriptionListContainer') transcriptionListContainer!: ElementRef<HTMLElement>;
  @ViewChild('timelineContainer') timelineContainer!: ElementRef<HTMLElement>;

  // --- PROPRIEDADES DE DADOS E ESTADO ---
  fullTranscript: TranscriptEntry[] = [];
  transcript: TranscriptEntry[] = [];
  markedText: string = '';
  markedTextSegments: string[] = [];
  clippingData = {
    titulo: '',
    descricao: '',
    sentimento: 'Automático',
  };
  buscandoTranscricao: boolean = false;
  termoBuscaTranscricao: string = '';
  totalMatches: number = 0;
  currentMatchIndex: number = -1;
  isSaveModalVisible = false;
  isPlaying = false;

  // --- PROPRIEDADES DA TIMELINE ---
  readonly timelineScreenWidth = 554;
  segmentWidth = 554;
  timelineContainers: number[] = [0];
  timeMarks: { left: number; label: string }[] = [];
  selectedIndex: number | null = null;

  // --- PROPRIEDADES DE TEMPO E POSIÇÃO ---
  videoDurationMs = 0;
  currentTime = 0;
  startTime: number | null = 0;
  endTime: number | null = null;
  currentLeft = 0;
  startLeft = 0;
  endLeft = this.timelineScreenWidth;
  dragging: 'start' | 'end' | null = null;

  constructor(
    private elRef: ElementRef,
    private textoEntidadesService: TextoEntidadesService,
    private sanitizer: DomSanitizer
  ) {}

  // --- MÉTODOS DE CICLO DE VIDA ---
  ngOnInit() {
    this.fullTranscript = transcriptData.map(item => ({...item, originalText: item.text, text: item.text})) as TranscriptEntry[];
    this.updateDisplayedTranscript();
  }

  ngAfterViewInit(): void {
    this.recalculateLayout();
  }

  // --- LISTENERS DE EVENTOS ---
  @HostListener('window:mouseup')
  onWindowMouseUp() {
    this.dragging = null;
  }

  @HostListener('window:mousemove', ['$event'])
  onWindowMouseMove(event: MouseEvent) {
    if (!this.dragging || !this.videoDurationMs || !this.timelineContainer) return;

    const sliderRect = this.timelineContainer.nativeElement.getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - sliderRect.left, this.timelineScreenWidth));
    const ms = (x / this.timelineScreenWidth) * this.videoDurationMs;

    if (this.dragging === 'start') {
      this.startTime = Math.max(0, (this.endTime !== null && ms >= this.endTime) ? this.endTime : ms);
    } else if (this.dragging === 'end') {
      this.endTime = Math.min(this.videoDurationMs, (this.startTime !== null && ms <= this.startTime) ? this.startTime : ms);
    }
    
    // CORRETO: Ao arrastar as alças, a seleção visual do bloco é removida.
    this.selectedIndex = null;

    this.updateAllElementPositions();
    this.updateDisplayedTranscript();
  }

  // --- LÓGICA PRINCIPAL DA TIMELINE ---
  recalculateLayout(): void {
    const numSegments = this.timelineContainers.length;
    if (numSegments > 0) {
      this.segmentWidth = this.timelineScreenWidth / numSegments;
    }
    this.generateTimeMarks();
    this.updateAllElementPositions();
  }

  addTimelineContainer() {
    this.timelineContainers.push(this.timelineContainers.length);
    this.videoDurationMs += 300000;
    this.recalculateLayout();
    this.updateDisplayedTranscript();
  }

  // --- MÉTODO CORRIGIDO ---
  // Esta função agora APENAS atualiza o `selectedIndex` para a seleção visual.
  // Ela NÃO afeta mais as alças de seleção (startTime/endTime).
  selectContainer(index: number): void {
    if (this.selectedIndex === index) {
      // Se clicar no mesmo bloco, deseleciona.
      this.selectedIndex = null;
    } else {
      // Se clicar em um novo bloco, seleciona-o.
      this.selectedIndex = index;
    }
  }

  updateAllElementPositions(): void {
    if (this.startTime !== null) this.startLeft = this.getLeftFromTime(this.startTime);
    if (this.endTime !== null) this.endLeft = this.getLeftFromTime(this.endTime);
    this.currentLeft = this.getLeftFromTime(this.currentTime);
  }

  // --- EVENTOS DO VÍDEO (sem alterações) ---
  onLoadedMetadata(event: Event) {
    const video = event.target as HTMLVideoElement;
    this.videoDurationMs = Math.floor(video.duration * 1000);
    this.startTime = 0;
    this.endTime = this.videoDurationMs;
    this.currentTime = 0;
    this.recalculateLayout(); 
    this.updateDisplayedTranscript();
  }

  onTimeUpdate(event: Event) {
    if (this.dragging) return;
    this.currentTime = Math.floor((event.target as HTMLVideoElement).currentTime * 1000);
    this.currentLeft = this.getLeftFromTime(this.currentTime);
  }

  startDragging(handle: 'start' | 'end') {
    this.dragging = handle;
  }

  seekTo(timestamp: number) {
    if (this.videoPlayer) this.videoPlayer.nativeElement.currentTime = timestamp / 1000;
  }

  // --- FUNÇÕES UTILITÁRIAS E RESTANTE DO CÓDIGO (sem alterações) ---
  getLeftFromTime(timeMs: number): number {
    if (this.videoDurationMs === 0) return 0;
    return (timeMs / this.videoDurationMs) * this.timelineScreenWidth;
  }

  generateTimeMarks() {
    this.timeMarks = [];
    if (this.videoDurationMs <= 0) return;
    const numMarks = Math.floor(this.videoDurationMs / 60000);
    for (let i = 0; i <= numMarks; i++) {
        const fraction = numMarks > 0 ? (i / numMarks) : 0;
        const ms = fraction * this.videoDurationMs;
        const labelText = this.formatTimestamp(ms);
        let leftPosition = this.getLeftFromTime(ms);
        const labelWidth = labelText.length * 6;
        if (i === 0) {
            leftPosition = 5;
        } else if (i === numMarks) {
            leftPosition = this.timelineScreenWidth - labelWidth - 5;
        } else {
            leftPosition -= labelWidth / 2;
        }
        this.timeMarks.push({
            label: labelText,
            left: leftPosition
        });
    }
  }

  formatTimestamp(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
  
  getTooltipPosition(currentLeft: number): number {
    const tooltipWidth = 56;
    const halfTooltip = tooltipWidth / 2;
    let position = currentLeft - halfTooltip;
    position = Math.max(0, position);
    position = Math.min(this.timelineScreenWidth - tooltipWidth, position);
    return position;
  }
 
  updateDisplayedTranscript(): void { let itemsToDisplay = [...this.fullTranscript]; if (this.markedTextSegments.length === this.fullTranscript.length) { itemsToDisplay = itemsToDisplay.map((item, index) => ({ ...item, text: this.sanitizer.bypassSecurityTrustHtml(this.markedTextSegments[index] || item.originalText) })); } if (this.startTime !== null && this.endTime !== null && this.endTime > this.startTime) { itemsToDisplay = itemsToDisplay.filter(t => t.end >= this.startTime! && t.timestamp <= this.endTime!); } if (this.buscandoTranscricao && this.termoBuscaTranscricao.trim() !== '') { const searchTermLower = this.termoBuscaTranscricao.toLowerCase(); const regex = new RegExp(this.termoBuscaTranscricao.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'); itemsToDisplay = itemsToDisplay.filter(item => item.originalText.toLowerCase().includes(searchTermLower)).map(item => { let textToHighlight = typeof item.text === 'string' ? item.text : (item.text as any).changingThisBreaksApplicationSecurity || item.text.toString(); textToHighlight = textToHighlight.replace(regex, (match: string) => `<mark class="bg-yellow-200 rounded px-0.5 py-0">${match}</mark>`); return { ...item, text: this.sanitizer.bypassSecurityTrustHtml(textToHighlight) }; }); } else { itemsToDisplay = itemsToDisplay.map(item => ({ ...item, text: this.sanitizer.bypassSecurityTrustHtml(typeof item.text === 'string' ? item.text : (item.text as any).changingThisBreaksApplicationSecurity || item.text.toString()) })); } this.transcript = itemsToDisplay; if (this.buscandoTranscricao && this.termoBuscaTranscricao.trim() !== '') { this.totalMatches = this.transcript.reduce((count, item) => { const textContent = typeof item.text === 'string' ? item.text : (item.text as any).changingThisBreaksApplicationSecurity || item.text.toString(); const matchesInItem = (textContent.match(/<mark/g) || []).length; return count + matchesInItem; }, 0); if (this.currentMatchIndex >= this.totalMatches || this.currentMatchIndex < 0) { this.currentMatchIndex = this.totalMatches > 0 ? 0 : -1; } } else { this.totalMatches = 0; this.currentMatchIndex = -1; } if (this.buscandoTranscricao && this.totalMatches > 0 && this.currentMatchIndex === 0) { this.scrollToCurrentMatch(false); } else if (!this.buscandoTranscricao) { this.clearSearchHighlight(); } }
  getTranscriptText(): string { return this.fullTranscript.map(t => t.originalText).join(' '); }
  updateMarkedText(markedText: string): void { this.markedText = markedText; this.updateDisplayedTranscript(); }
  updateMarkedTextSegments(markedTextSegments: string[]): void { this.markedTextSegments = markedTextSegments; this.updateDisplayedTranscript(); }
  onCloseDrawer(): void { }
  onOpenEntityOptions(event: { entity: string; type: string; position: { top: number; left: number; }; }): void { }
  ativarBuscaTranscricao(): void { this.buscandoTranscricao = true; setTimeout(() => { const inputElement = document.getElementById('campoBuscaTranscricao'); inputElement?.focus(); }, 0); }
  desativarBuscaTranscricao(): void { this.buscandoTranscricao = false; this.termoBuscaTranscricao = ''; this.currentMatchIndex = -1; this.totalMatches = 0; this.updateDisplayedTranscript(); this.clearSearchHighlight(); }
  onTermoBuscaChange(): void { this.currentMatchIndex = 0; this.updateDisplayedTranscript(); }
  limparTermoBusca(): void { this.termoBuscaTranscricao = ''; this.onTermoBuscaChange(); }
  navigateToPreviousMatch(): void { if (this.totalMatches === 0) return; this.currentMatchIndex = (this.currentMatchIndex - 1 + this.totalMatches) % this.totalMatches; this.scrollToCurrentMatch(); }
  navigateToNextMatch(): void { if (this.totalMatches === 0) return; this.currentMatchIndex = (this.currentMatchIndex + 1) % this.totalMatches; this.scrollToCurrentMatch(); }
  scrollToCurrentMatch(smooth: boolean = true): void { if (this.currentMatchIndex < 0 || this.currentMatchIndex >= this.totalMatches) { this.clearSearchHighlight(); return; } setTimeout(() => { const allMarkedElements = Array.from(this.transcriptionListContainer.nativeElement.querySelectorAll('.transcription-item mark')) as HTMLElement[]; this.clearSearchHighlight(); if (allMarkedElements.length > 0 && this.currentMatchIndex < allMarkedElements.length) { const currentMarkElement = allMarkedElements[this.currentMatchIndex]; const parentItem = currentMarkElement.closest('.transcription-item') as HTMLElement; if (parentItem) { parentItem.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'nearest' }); parentItem.classList.add('current-search-match'); } } }, 0); }
  clearSearchHighlight(): void { const highlightedItems = this.elRef.nativeElement.querySelectorAll('.current-search-match'); highlightedItems.forEach((el: HTMLElement) => el.classList.remove('current-search-match')); }
  openSaveModal(): void { this.isSaveModalVisible = true; }
  closeSaveModal(): void { this.isSaveModalVisible = false; }
}