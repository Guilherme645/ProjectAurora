import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-scroll-top',
  templateUrl: './scroll-top.component.html',
  styleUrls: ['./scroll-top.component.css']
})
export class ScrollTopComponent {
  isVisible = false;
  isMobile = window.innerWidth <= 480; 

  // Detecta rolagem para exibir/esconder botão
  @HostListener('window:scroll')
  onScroll(): void {
    this.isVisible = window.pageYOffset > 200;
  }

  // Detecta redimensionamento da tela para ajustar mobile
  @HostListener('window:resize')
  onResize(): void {
    this.isMobile = window.innerWidth <= 480;
  }

  // Volta suavemente ao topo
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
