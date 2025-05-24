import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { TextoEntidadesService } from 'src/app/services/TextoEntidades.service';
import transcriptData from 'src/assets/transcricao_completa.json';

interface TranscriptEntry {
  timestamp: number;
  end: number;
  text: string;
}

@Component({
  selector: 'app-clipping',
  templateUrl: './clipping.component.html',
  styleUrls: ['./clipping.component.css'],
  standalone: false
})
export class ClippingComponent implements OnInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  transcript = transcriptData as TranscriptEntry[];
  fullTranscript = [...transcriptData] as TranscriptEntry[];
  markedText: string = '';

  currentTime = 0;
  startTime: number | null = null;
  endTime: number | null = null;

  dragging: 'start' | 'end' | null = null;

  sliderWidth = 580;
  videoDurationMs = 0;

  startLeft = 0;
  endLeft = 580;
  currentLeft = 0;

  timeMarks: { left: number; label: string }[] = [];

  constructor(private textoEntidadesService: TextoEntidadesService) {}

  ngOnInit() {
    this.fullTranscript = transcriptData as TranscriptEntry[];
    this.transcript = [...this.fullTranscript];
  }

  @HostListener('window:mouseup')
  stopDragging() {
    this.dragging = null;
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.dragging || !this.videoDurationMs) return;

    const sliderRect = document.querySelector('.relative')?.getBoundingClientRect();
    if (!sliderRect) return;

    let x = event.clientX - sliderRect.left;
    x = Math.max(0, Math.min(this.sliderWidth, x));

    const ms = (x / this.sliderWidth) * this.videoDurationMs;

    if (this.dragging === 'start') {
      this.startLeft = x;
      this.startTime = ms;
    } else if (this.dragging === 'end') {
      this.endLeft = x;
      this.endTime = ms;
    }

    if (this.startTime !== null && this.endTime !== null) {
      this.loadTranscriptSlice();
    }
  }

  startDragging(handle: 'start' | 'end') {
    this.dragging = handle;
  }

  onTimeUpdate(event: Event) {
    const video = event.target as HTMLVideoElement;
    this.currentTime = Math.floor(video.currentTime * 1000);
    this.currentLeft = this.getLeftFromTime(this.currentTime);
  }

  onLoadedMetadata(event: Event) {
    const video = event.target as HTMLVideoElement;
    this.videoDurationMs = Math.floor(video.duration * 1000);
    this.endTime = this.videoDurationMs;
    this.endLeft = this.sliderWidth;

    this.generateTimeMarks();
  }

  generateTimeMarks() {
    const totalDuration = this.videoDurationMs;
    const intervals = 4;
    this.timeMarks = [];

    for (let i = 0; i < intervals; i++) {
      const ms = (i * totalDuration) / (intervals - 1);
      this.timeMarks.push({
        left: this.getLeftFromTime(ms),
        label: this.formatFullTimestamp(ms),
      });
    }
  }

  getLeftFromTime(time: number): number {
    if (this.videoDurationMs === 0) return 0;
    return (time / this.videoDurationMs) * this.sliderWidth;
  }

  formatFullTimestamp(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
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

  markStart() {
    this.startTime = this.currentTime;
    this.startLeft = this.getLeftFromTime(this.startTime);
  }

  markEnd() {
    this.endTime = this.currentTime;
    this.endLeft = this.getLeftFromTime(this.endTime);
  }

  loadTranscriptSlice() {
    if (this.startTime !== null && this.endTime !== null) {
      this.transcript = this.fullTranscript.filter(
        (t) => t.end >= this.startTime! && t.timestamp <= this.endTime!
      );
    }
  }

  resetSelection() {
    this.startTime = null;
    this.endTime = null;
    this.transcript = [...this.fullTranscript];
    this.startLeft = 0;
    this.endLeft = this.sliderWidth;
  }

  getTooltipPosition(currentLeft: number): number {
    const tooltipWidth = 56;
    const halfTooltip = tooltipWidth / 2;

    if (currentLeft < halfTooltip) {
      return 0;
    } else if (currentLeft > this.sliderWidth - halfTooltip) {
      return this.sliderWidth - tooltipWidth;
    } else {
      return currentLeft - halfTooltip;
    }
  }

  getTranscriptText(): string {
    return this.transcript.map((t) => t.text).join(' ');
  }

  updateMarkedText(markedText: string): void {
    this.markedText = markedText;
    // Atualizar cada item da transcrição com o texto marcado
    this.transcript = this.transcript.map((item) => {
      const regex = new RegExp(`\\b${item.text}\\b`, 'g');
      const markedItemText = this.markedText.match(regex)
        ? this.markedText.replace(regex, `<span class="entity">${item.text}</span>`)
        : item.text;
      return { ...item, text: markedItemText };
    });
  }

  onCloseDrawer(): void {
    // Lógica para fechar o painel, se necessário
    console.log('Entities drawer closed');
  }

  onOpenEntityOptions(event: {
    entity: string;
    type: string;
    position: { top: number; left: number };
  }): void {
    // Lógica para abrir opções de entidades (ex.: modal)
    console.log('Entity options opened:', event);
  }
}