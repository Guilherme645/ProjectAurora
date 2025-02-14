import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-page-busca',
  templateUrl: './page-busca.component.html',
  styleUrls: ['./page-busca.component.css']
})
export class PageBuscaComponent {
  isMobile = window.innerWidth <= 768;
  isSidebarOpen = false;
  isMobileSidebarOpen = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth <= 768;
  }
  
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleMobileSidebar() {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }
  
  closeMobileSidebar() {
    this.isMobileSidebarOpen = false;
  }
}
