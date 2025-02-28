import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-page-busca',
  templateUrl: './page-busca.component.html',
  styleUrls: ['./page-busca.component.css'],
})
export class PageBuscaComponent {
  isMobile: boolean = window.innerWidth <= 480; 
  isMobileSidebarOpen: boolean = false; 

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobile = window.innerWidth <= 480;
    if (!this.isMobile) {
      this.isMobileSidebarOpen = false; 
    }
  }

  abrirMobileSidebar() {
    this.isMobileSidebarOpen = true;
  }

  closeMobileSidebar() {
    this.isMobileSidebarOpen = false;
  }

toggleMobileSidebar() {
  this.isMobileSidebarOpen = !this.isMobileSidebarOpen; 
}
}
