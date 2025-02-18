import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-scroll-top',
  templateUrl: './scroll-top.component.html',
  styleUrls: ['./scroll-top.component.css']
})
export class ScrollTopComponent {
  isVisible: boolean = false;
  isMobile: boolean = window.innerWidth <= 480; // Define se é mobile

  constructor() {
    this.checkScreenSize(); // Checa tamanho da tela ao iniciar
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.isVisible = window.pageYOffset > 200; // Exibe o botão após rolagem
  }

  @HostListener('window:resize', [])
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 480; // Atualiza o valor ao redimensionar
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
