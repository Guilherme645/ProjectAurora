import { Component, HostListener } from '@angular/core';

@Component({
    selector: 'app-scroll-top',
    templateUrl: './scroll-top.component.html',
    styleUrls: ['./scroll-top.component.css'],
    standalone: false
})
export class ScrollTopComponent {
  isVisible = false;
  isMobile = window.innerWidth <= 480; 

  @HostListener('window:scroll')
  onScroll(): void {
    this.isVisible = window.pageYOffset > 200;
  }

  @HostListener('window:resize')
  onResize(): void {
    this.isMobile = window.innerWidth <= 480;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
