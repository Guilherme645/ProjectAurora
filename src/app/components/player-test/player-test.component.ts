// player-test.component.ts
import {
  Component,
  ViewChild,
  ElementRef,
  HostListener,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

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

@Component({
  selector: 'app-player-test',
  templateUrl: './player-test.component.html',
  styleUrls: ['./player-test.component.css'],
  standalone: false,
})
export class PlayerTestComponent implements AfterViewInit {
 // --- Referências de Elementos ---
  @ViewChild('playerVideo') videoPlayerRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('containerTimeline') timelineContainerRef!: ElementRef<HTMLElement>;

  // --- Propriedades auxiliares ---
  isSelectionActive = false;
  startMoved = false; 
  endMoved = false;   
  edgeThreshold = 1;  
  timelineWidth = 0;  
  handleWidth = 0;    

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

  constructor(
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.recalculateLayout();
    this.timelineWidthPx = this.timelineContainerRef?.nativeElement?.clientWidth || this.timelineWidthPx;
    this.cdr.detectChanges();
  }

  @HostListener('window:resize') onWindowResize(): void {
    this.timelineWidthPx = this.timelineContainerRef?.nativeElement?.clientWidth || this.timelineWidthPx;
    this.recalculateLayout();
  }

  isAtLeftEdge(): boolean {
    return this.posicaoInicioPx <= this.edgeThreshold;
  }

  isAtRightEdge(): boolean {
    return (this.timelineWidthPx - this.posicaoFimPx) <= this.edgeThreshold;
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.dragging && this.draggingMarkerIndex === null) return;
    event.preventDefault();

    const rect = this.timelineContainerRef.nativeElement.getBoundingClientRect();
    const mouseX = Math.max(0, Math.min(event.clientX - rect.left, this.timelineWidthPx));
    
    if (this.dragging) {
        const tempoMs = this.calculateTimeFromPosition(mouseX);
        if (this.dragging === 'inicio' && tempoMs < this.tempoFinalMs) {
            this.tempoInicialMs = tempoMs;
        } else if (this.dragging === 'fim' && tempoMs > this.tempoInicialMs) {
            this.tempoFinalMs = tempoMs;
        }
        this.updateAllPositions();
    } 
    else if (this.draggingMarkerIndex !== null) {
        const marker = this.structuralMarkers[this.draggingMarkerIndex];
        if (marker) {
            marker.left = `${mouseX}px`;
        }
    }
  }

  finalizarArrasto(event: MouseEvent) {
    if (this.dragging) {
      this.dragging = null;
      this.isSelectionActive = true;
    }
  }

  @HostListener('window:mouseup')
  onMouseUp(): void {
    const wasDraggingSelection = !!this.dragging;

    if (this.draggingMarkerIndex !== null) {
      this.generateTimeMarks();
    }

    this.dragging = null;
    this.draggingMarkerIndex = null;

    if (wasDraggingSelection) {
      if (this.videoPlayerRef) {
        this.videoPlayerRef.nativeElement.currentTime = 0;
        this.videoPlayerRef.nativeElement.pause(); 
      }
      this.tempoAtualMs = 0;
      this.updateAllPositions(); 
    } else {
      this.adjustVideoPlayback();
    }
  }

  computeHandleBgClass(handle: 'inicio' | 'fim') {
    const atLeft  = handle === 'inicio' && this.isAtLeftEdge();
    const atRight = handle === 'fim'    && this.isAtRightEdge();
    const moved   = handle === 'inicio' ? this.startMoved : this.endMoved;

    if (atLeft || atRight) return { 'handle--black': true };
    if (moved)             return { 'handle--yellow800': true };
    return { 'handle--black': true };
  }

  // --- Eventos do Player e Timeline ---
  onMetadadosCarregados(event: Event): void {
    const video = event.target as HTMLVideoElement;
    this.videoDurationMs = video.duration * 1000;
    this.tempoInicialMs = 0;
    this.tempoFinalMs = this.videoDurationMs;
    this.recalculateLayout();
  }

  onPlay(): void {
    this.isVideoPlaying = true;
    if (this.videoPlayerRef) {
      const video = this.videoPlayerRef.nativeElement;
      const currentTimeMs = video.currentTime * 1000;
      
      if (currentTimeMs < this.tempoInicialMs || currentTimeMs >= this.tempoFinalMs) {
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
    if (handle === 'inicio') this.startMoved = true;
    if (handle === 'fim') this.endMoved = true;
  }

  iniciarArrastoMarcador(event: MouseEvent, index: number): void {
    event.stopPropagation();
    this.draggingMarkerIndex = index;
    this.dragging = null;
  }
  
  public isMarkerInSelectedSegment(marker: TimeMark): boolean {
    if (this.selectedIndex === null) {
      return false;
    }
    const segmentStartTimeMs = this.selectedIndex * 300000;
    const segmentEndTimeMs = segmentStartTimeMs + 360000; 
    return marker.timeMs >= segmentStartTimeMs && marker.timeMs <= segmentEndTimeMs;
  }
  
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
    this.adjustVideoPlayback();
  }

  // --- Lógica de Blocos da Timeline ---
  addTimelineContainer(): void {
    this.timelineContainers.push(this.timelineContainers.length);
    this.videoDurationMs += 300000;
    this.recalculateLayout();
  }

  selectContainer(index: number | null, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    if (this.selectedIndex === index) {
      this.selectedIndex = null;
      this.isSelectionActive = false;
    } else {
      this.selectedIndex = index;
      this.isSelectionActive = true; 
      if (index !== null) {
        const segmentStart = index * 300000;
        const segmentEnd = Math.min((index + 1) * 300000, this.videoDurationMs);
        this.tempoInicialMs = segmentStart;
        this.tempoFinalMs = segmentEnd;
        this.updateAllPositions();
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
  
  // --- Métodos Utilitários e de Interação ---
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

  formatTimestamp(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  // ESTAS PROPRIEDADES JÁ ESTAVAM NO SEU CÓDIGO E SÃO FUNDAMENTAIS PARA A NOVA LÓGICA DO HTML
  get selectionStartPx(): number {
    return this.calculatePositionFromTime(this.tempoInicialMs);
  }
  get selectionEndPx(): number {
    return this.calculatePositionFromTime(this.tempoFinalMs);
  }
  get selectionProgressPx(): number {
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
  isFullSelectionPlayed(): boolean {
  return this.isVideoPlaying && this.isAtLeftEdge() && this.isAtRightEdge();
}
get selectionPlayedWidthPx(): number {
  const progress = Math.min(this.selectionProgressPx, this.selectionEndPx);
  const width = Math.max(0, progress - this.selectionStartPx);
  return width;
}

}