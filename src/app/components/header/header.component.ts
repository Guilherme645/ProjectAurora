import { Component, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isScrolled: boolean = false;
  isDropdownOpen: boolean = false;
  isBuscaOpen: boolean = false;
  isMobile: boolean = false;
  isCollapsed: boolean = false;
  isSearchOpen: boolean = false;
  selectedOption: string = 'Mais relevantes';
  selectedTab: string = 'brutos';
  selectAll: boolean = false;

  @Output() selectAllEvent = new EventEmitter<boolean>();
  @Output() filterNewsEvent = new EventEmitter<string>();

  ngOnInit(): void {
    this.checkScreenSize();
  }

  /** 📌 Detecta rolagem para recolher o cabeçalho */
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isCollapsed = window.scrollY > 50;
  }

  /** 📌 Detecta redimensionamento da tela */
  @HostListener('window:resize', [])
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  /** 📌 Alternar estado da busca avançada */
  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
  }

  /** 📌 Abrir modal de busca */
  openBusca(): void {
    this.isBuscaOpen = true;
  }

  /** 📌 Fechar modal de busca */
  closeBusca(): void {
    this.isBuscaOpen = false;
  }

  /** 📌 Fechar busca ao pressionar "Esc" */
  @HostListener('document:keydown.escape')
  handleEscape(): void {
    this.closeBusca();
  }

  /** 📌 Fechar busca ao clicar fora */
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('app-input-busca') && !target.closest('app-header')) {
      this.closeBusca();
    }
  }

  /** 📌 Alternar seleção de todos os resultados */
  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    this.selectAllEvent.emit(this.selectAll);
  }

 

  selectOption(option: string): void {
    this.selectedOption = option;
    this.isDropdownOpen = false;
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
    this.filterNewsEvent.emit(tab);
  }
}
