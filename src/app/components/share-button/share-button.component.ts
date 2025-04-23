// share-button.component.ts
import { Component, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-share-button',
  templateUrl: './share-button.component.html',
  standalone: false
})
export class ShareButtonComponent {
  @Output() shareClicked = new EventEmitter<void>();
  isMobile: boolean = false;

  ngOnInit() {
    this.checkIfMobile();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkIfMobile();
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth < 768;
  }

  onShareClick() {
    this.shareClicked.emit();
  }
}