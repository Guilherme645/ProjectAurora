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
  standalone: false
})
export class ClippingComponent implements OnInit, AfterViewInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('transcriptionListContainer') transcriptionListContainer!: ElementRef<HTMLElement>;

  fullTranscript: TranscriptEntry[] = [];
  transcript: TranscriptEntry[] = [];
  markedText: string = '';
  markedTextSegments: string[] = [];

  currentTime = 0;
  startTime: number | null = 0;
  endTime: number | null = null;

  dragging: 'start' | 'end' | null = null;
  sliderWidth = 564;
  videoDurationMs = 0;

  startLeft = 0;
  endLeft = this.sliderWidth;
  currentLeft = 0;

  timeMarks: { left: number; label: string }[] = [];

  buscandoTranscricao: boolean = false;
  termoBuscaTranscricao: string = '';
  totalMatches: number = 0;
  currentMatchIndex: number = -1;

  constructor(
    private elRef: ElementRef,
    private textoEntidadesService: TextoEntidadesService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.fullTranscript = transcriptData.map(item => ({
      ...item,
      originalText: item.text,
      text: item.text
    })) as TranscriptEntry[];
    this.updateDisplayedTranscript();
  }

  ngAfterViewInit(): void {}

  @HostListener('window:mouseup', ['$event'])
  onWindowMouseUp(event: MouseEvent) {
    this.stopDragging();
  }

  @HostListener('window:mousemove', ['$event'])
  onWindowMouseMove(event: MouseEvent) {
    this.onMouseMove(event);
  }

  stopDragging() {
    this.dragging = null;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.dragging || !this.videoDurationMs) return;

    const sliderContainer = (this.elRef.nativeElement as HTMLElement).querySelector('.w-\\[564px\\].h-\\[100px\\].mx-auto');
    if (!sliderContainer) return;

    const sliderRect = sliderContainer.getBoundingClientRect();
    let x = event.clientX - sliderRect.left;
    x = Math.max(0, Math.min(this.sliderWidth, x));
    const ms = (x / this.sliderWidth) * this.videoDurationMs;

    if (this.dragging === 'start') {
      if (this.endTime !== null && ms >= this.endTime && this.endTime > 0) {
        this.startLeft = this.getLeftFromTime(this.endTime - 1);
        this.startTime = this.endTime - 1;
      } else {
        this.startLeft = x;
        this.startTime = ms;
      }
    } else if (this.dragging === 'end') {
      if (this.startTime !== null && ms <= this.startTime && this.startTime < this.videoDurationMs) {
        this.endLeft = this.getLeftFromTime(this.startTime + 1);
        this.endTime = this.startTime + 1;
      } else {
        this.endLeft = x;
        this.endTime = ms;
      }
    }
    this.updateDisplayedTranscript();
  }

  startDragging(handle: 'start' | 'end') {
    this.dragging = handle;
  }

  onTimeUpdate(event: Event) {
    const video = event.target as HTMLVideoElement;
    if (!this.dragging) {
      this.currentTime = Math.floor(video.currentTime * 1000);
      this.currentLeft = this.getLeftFromTime(this.currentTime);
    }
  }

  onLoadedMetadata(event: Event) {
    const video = event.target as HTMLVideoElement;
    this.videoDurationMs = Math.floor(video.duration * 1000);
    this.startTime = 0;
    this.endTime = this.videoDurationMs;
    this.startLeft = 0;
    this.endLeft = this.sliderWidth;
    this.currentLeft = 0;
    this.currentTime = 0;
    this.generateTimeMarks();
    this.updateDisplayedTranscript();
  }

  generateTimeMarks() {
    if (this.videoDurationMs <= 0) return;
    const numMarks = 5;
    this.timeMarks = [];
    for (let i = 0; i < numMarks; i++) {
      const fraction = i / (numMarks - 1);
      const ms = fraction * this.videoDurationMs;
      let labelOffset = 0;
      const labelText = this.formatTimestamp(ms);
      if (i > 0 && i < numMarks - 1) {
        labelOffset = (labelText.length * 3);
      } else if (i === numMarks - 1) {
        labelOffset = (labelText.length * 7);
      }
      this.timeMarks.push({
        left: this.getLeftFromTime(ms) - labelOffset,
        label: labelText,
      });
    }
  }

  getLeftFromTime(timeMs: number): number {
    if (this.videoDurationMs === 0) return 0;
    const position = (timeMs / this.videoDurationMs) * this.sliderWidth;
    return Math.max(0, Math.min(this.sliderWidth, position));
  }

  formatTimestamp(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  seekTo(timestamp: number) {
    this.videoPlayer.nativeElement.currentTime = timestamp / 1000;
  }

  resetSelection() {
    this.startTime = 0;
    this.endTime = this.videoDurationMs;
    this.startLeft = 0;
    this.endLeft = this.sliderWidth;
    this.updateDisplayedTranscript();
  }

  updateDisplayedTranscript(): void {
  let itemsToDisplay = [...this.fullTranscript];

  // 1. Aplicar marcações de entidades (usando markedTextSegments)
  if (this.markedTextSegments.length === this.fullTranscript.length) {
    itemsToDisplay = itemsToDisplay.map((item, index) => ({
      ...item,
      text: this.sanitizer.bypassSecurityTrustHtml(this.markedTextSegments[index] || item.originalText)
    }));
  }

  // 2. Filtro de Tempo (slider)
  if (this.startTime !== null && this.endTime !== null && this.endTime > this.startTime) {
    itemsToDisplay = itemsToDisplay.filter(
      t => t.end >= this.startTime! && t.timestamp <= this.endTime!
    );
  }

  // 3. Filtro de Busca Textual e Aplicação de Marcações de Busca
  if (this.buscandoTranscricao && this.termoBuscaTranscricao.trim() !== '') {
    const searchTermLower = this.termoBuscaTranscricao.toLowerCase();
    const regex = new RegExp(this.termoBuscaTranscricao.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');

    itemsToDisplay = itemsToDisplay
      .filter(item => item.originalText.toLowerCase().includes(searchTermLower))
      .map(item => {
        let textToHighlight = typeof item.text === 'string' ? item.text : (item.text as any).changingThisBreaksApplicationSecurity || item.text.toString();
        textToHighlight = textToHighlight.replace(regex, (match: string) => `<mark class="bg-yellow-200 rounded px-0.5 py-0">${match}</mark>`);
        return {
          ...item,
          text: this.sanitizer.bypassSecurityTrustHtml(textToHighlight)
        };
      });
  } else {
    itemsToDisplay = itemsToDisplay.map(item => ({
      ...item,
      text: this.sanitizer.bypassSecurityTrustHtml(typeof item.text === 'string' ? item.text : (item.text as any).changingThisBreaksApplicationSecurity || item.text.toString())
    }));
  }

  this.transcript = itemsToDisplay;

  // 4. Contagem de Matches e atualização do índice na transcrição visível
  if (this.buscandoTranscricao && this.termoBuscaTranscricao.trim() !== '') {
    this.totalMatches = this.transcript.reduce((count, item) => {
      const textContent = typeof item.text === 'string' ? item.text : (item.text as any).changingThisBreaksApplicationSecurity || item.text.toString();
      const matchesInItem = (textContent.match(/<mark/g) || []).length;
      return count + matchesInItem;
    }, 0);

    if (this.currentMatchIndex >= this.totalMatches || this.currentMatchIndex < 0) {
      this.currentMatchIndex = this.totalMatches > 0 ? 0 : -1;
    }
  } else {
    this.totalMatches = 0;
    this.currentMatchIndex = -1;
  }

  // 5. Rolar para o primeiro match se a busca resultou em algo
  if (this.buscandoTranscricao && this.totalMatches > 0 && this.currentMatchIndex === 0) {
    this.scrollToCurrentMatch(false);
  } else if (!this.buscandoTranscricao) {
    this.clearSearchHighlight();
  }
}
  getTooltipPosition(currentLeft: number): number {
    const tooltipWidth = 56;
    const halfTooltip = tooltipWidth / 2;
    let position = currentLeft - halfTooltip;
    position = Math.max(0, position);
    position = Math.min(this.sliderWidth - tooltipWidth, position);
    return position;
  }

  getTranscriptText(): string {
    return this.fullTranscript.map(t => t.originalText).join(' ');
  }

  updateMarkedText(markedText: string): void {
    this.markedText = markedText;
    this.updateDisplayedTranscript();
    console.log('Texto marcado atualizado no ClippingComponent:', markedText.substring(0, 100) + "...");
  }

  updateMarkedTextSegments(markedTextSegments: string[]): void {
    this.markedTextSegments = markedTextSegments;
    this.updateDisplayedTranscript();
    console.log('Segmentos marcados atualizados no ClippingComponent:', markedTextSegments.length);
  }

  onCloseDrawer(): void {
    console.log('Gaveta de entidades fechada');
  }

  onOpenEntityOptions(event: {
    entity: string;
    type: string;
    position: { top: number; left: number };
  }): void {
    console.log('Opções de entidade abertas:', event);
  }

  ativarBuscaTranscricao(): void {
    this.buscandoTranscricao = true;
    setTimeout(() => {
      const inputElement = document.getElementById('campoBuscaTranscricao');
      inputElement?.focus();
    }, 0);
  }

  desativarBuscaTranscricao(): void {
    this.buscandoTranscricao = false;
    this.termoBuscaTranscricao = '';
    this.currentMatchIndex = -1;
    this.totalMatches = 0;
    this.updateDisplayedTranscript();
    this.clearSearchHighlight();
  }

  onTermoBuscaChange(): void {
    this.currentMatchIndex = 0;
    this.updateDisplayedTranscript();
  }

  limparTermoBusca(): void {
    this.termoBuscaTranscricao = '';
    this.onTermoBuscaChange();
  }

  navigateToPreviousMatch(): void {
    if (this.totalMatches === 0) return;
    this.currentMatchIndex = (this.currentMatchIndex - 1 + this.totalMatches) % this.totalMatches;
    this.scrollToCurrentMatch();
  }

  navigateToNextMatch(): void {
    if (this.totalMatches === 0) return;
    this.currentMatchIndex = (this.currentMatchIndex + 1) % this.totalMatches;
    this.scrollToCurrentMatch();
  }

  scrollToCurrentMatch(smooth: boolean = true): void {
    if (this.currentMatchIndex < 0 || this.currentMatchIndex >= this.totalMatches) {
      this.clearSearchHighlight();
      return;
    }

    setTimeout(() => {
      const allMarkedElements = Array.from(this.transcriptionListContainer.nativeElement.querySelectorAll('.transcription-item mark')) as HTMLElement[];
      this.clearSearchHighlight();

      if (allMarkedElements.length > 0 && this.currentMatchIndex < allMarkedElements.length) {
        const currentMarkElement = allMarkedElements[this.currentMatchIndex];
        const parentItem = currentMarkElement.closest('.transcription-item') as HTMLElement;
        if (parentItem) {
          parentItem.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'nearest' });
          parentItem.classList.add('current-search-match');
        }
      }
    }, 0);
  }

  clearSearchHighlight(): void {
    const highlightedItems = this.elRef.nativeElement.querySelectorAll('.current-search-match');
    highlightedItems.forEach((el: HTMLElement) => el.classList.remove('current-search-match'));
  }
}