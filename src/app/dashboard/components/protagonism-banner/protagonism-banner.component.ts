import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { ProtagonismData } from '../../service/dashboard.service';

@Component({
  selector: 'app-protagonism-banner',
  templateUrl: './protagonism-banner.component.html',
  styleUrls: ['./protagonism-banner.component.scss'],
  standalone: false,
})
export class ProtagonismBannerComponent {
  @Input() data?: ProtagonismData;
  @Input() isLoading = false;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLElement>;

  private isDown = false;
  private startX = 0;
  private scrollLeft = 0;

  startDragging(e: MouseEvent) {
    this.isDown = true;

    const el = this.scrollContainer.nativeElement;
    this.startX = e.pageX - el.offsetLeft;
    this.scrollLeft = el.scrollLeft;
  }

  stopDragging() {
    this.isDown = false;
  }

  moveEvent(e: MouseEvent) {
    if (!this.isDown) return;

    e.preventDefault();

    const el = this.scrollContainer.nativeElement;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - this.startX) * 2; // velocidade (2x)
    el.scrollLeft = this.scrollLeft - walk;
  }
}
