import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-page-busca',
  templateUrl: './page-busca.component.html',
  styleUrls: ['./page-busca.component.css'],
})
export class PageBuscaComponent {
  isMobile: boolean = window.innerWidth <= 480; // Detecta se é mobile
  isMobileSidebarOpen: boolean = false; // Sidebar começa fechada em mobile

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobile = window.innerWidth <= 480;
    if (!this.isMobile) {
      this.isMobileSidebarOpen = false; // Fecha a sidebar no desktop
    }
  }

  abrirMobileSidebar() {
    this.isMobileSidebarOpen = true;
  }

  closeMobileSidebar() {
    this.isMobileSidebarOpen = false;
  }

toggleMobileSidebar() {
  this.isMobileSidebarOpen = !this.isMobileSidebarOpen; // Abre/fecha o sidebar
}
}
