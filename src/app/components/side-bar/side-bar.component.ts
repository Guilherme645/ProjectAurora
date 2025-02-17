import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  @Output() userChange = new EventEmitter<string>();

  isModalVisible = false;
  menuOpen = false;
  isExpanded = true;
  isMobile = false;
  isSidebarOpen = true;
  activeTab = 'Tab 2';
  currentUser = { name: 'Superior Tribunal Federal' };
  indicatorPosition = 0;

  menuItems = [
    { label: 'Início', link: '/home/workspace', icon: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>' },
    { label: 'Busca Geral', link: '/home/general-search', icon: '<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>' },
    { label: 'Buscas Salvas', link: '/home/saved-search', icon: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z"></path><path d="M17 21v-8H7v8"></path><path d="M7 3v4h10V3"></path>' },
    { label: 'Clippings', link: '/home/clippings', icon: '<circle cx="8" cy="8" r="2"></circle><path d="M9.414 9.414 12 12"></path><path d="M14.8 14.8 18 18"></path><circle cx="8" cy="16" r="2"></circle>' },
    { label: 'Dashboard', link: '/home/dashboard', icon: '<rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect>' }
  ];

  ngOnInit(): void {
    this.checkScreenSize();
  }

  // Alterna a visibilidade do sidebar
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Define a aba ativa
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // Alterna a abertura do modal
  toggleModal(): void {
    console.log('toggleModal foi chamado');
    this.isModalVisible = !this.isModalVisible;
  }

  // Detecta o redimensionamento da janela para verificar se está em modo mobile
  @HostListener('window:resize')
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  // Alterna o menu mobile manualmente
  toggleMobileMenu(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Muda o usuário atual e emite o evento correspondente
  changeUser(user: string): void {
    this.currentUser.name = this.getUserFullName(user);
    this.indicatorPosition = this.getIndicatorPosition(user);
    this.userChange.emit(this.currentUser.name);
  }

  // Retorna o nome completo do usuário baseado na abreviação
  getUserFullName(user: string): string {
    switch (user) {
      case 'ST':
        return 'Superior Tribunal Federal';
      case 'PG':
        return 'Procuradoria Geral';
      case 'SE':
        return 'Secretaria de Educação';
      default:
        return '';
    }
  }

  // Calcula a posição do indicador baseado no usuário selecionado
  getIndicatorPosition(user: string): number {
    switch (user) {
      case 'ST':
        return 0;
      case 'PG':
        return 48;
      case 'SE':
        return 96;
      default:
        return 0;
    }
  }
}
