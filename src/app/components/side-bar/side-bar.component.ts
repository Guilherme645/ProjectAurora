import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent {
  menuOpen = false;
  isExpanded = true; // Controle para o modo expandido
  isMobile = false;
  isSidebarOpen = true;

  ngOnInit(): void {
    this.checkScreenSize();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  activeTab: string = 'Tab 2'; // Define a aba ativa inicialmente

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  isModalOpen = false;

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('window:resize')
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleMobileMenu(): void {
    this.isMobile = !this.isMobile;
  }
}