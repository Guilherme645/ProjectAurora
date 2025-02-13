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
  menuItems = [
    { label: 'Início', link: '/home/workspace', icon: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>' },
    { label: 'Busca Geral', link: '/home/general-search', icon: '<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>' },
    { label: 'Buscas Salvas', link: '/home/saved-search', icon: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z"></path><path d="M17 21v-8H7v8"></path><path d="M7 3v4h10V3"></path>' },
    { label: 'Clippings', link: '/home/clippings', icon: '<circle cx="8" cy="8" r="2"></circle><path d="M9.414 9.414 12 12"></path><path d="M14.8 14.8 18 18"></path><circle cx="8" cy="16" r="2"></circle>' },
    { label: 'Dashboard', link: '/home/dashboard', icon: '<rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect>' },
  ];
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