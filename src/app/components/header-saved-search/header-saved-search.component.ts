import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header-saved-search',
  templateUrl: './header-saved-search.component.html',
  styleUrls: ['./header-saved-search.component.css'],
  standalone: false
})
export class HeaderSavedSearchComponent implements OnInit {
  isScrolled: boolean = false;
  isDropdownOpen: boolean = false;
  isBuscaOpen: boolean = false;
  isMobile: boolean = false;
  isCollapsed: boolean = false;
  isSearchOpen: boolean = false;
  searchQuery: string = '';
  selectedOption: string = 'Mais relevantes';
  selectedTab: string = 'todas';
  selectAll: boolean = false;

  @Output() selectAllEvent = new EventEmitter<boolean>();
  @Output() filterNewsEvent = new EventEmitter<string>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() sidebarToggle = new EventEmitter<void>();

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize', [])
  checkScreenSize(): void {
    const previousIsMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;
    // Só redefinir isSearchOpen se o estado de isMobile mudar (evita fechar a busca ao abrir o teclado)
    if (previousIsMobile !== this.isMobile) {
      this.isSearchOpen = !this.isMobile;
    }
    console.log('checkScreenSize - isMobile:', this.isMobile, 'isSearchOpen:', this.isSearchOpen);
  }

  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
    if (!this.isSearchOpen) {
      this.searchQuery = '';
      this.searchChange.emit('');
    }
    console.log('toggleSearch - isSearchOpen:', this.isSearchOpen);
  }

  closeSearch(): void {
    this.isSearchOpen = false;
    this.searchQuery = '';
    this.searchChange.emit('');
    console.log('closeSearch - isSearchOpen:', this.isSearchOpen);
  }

  openBusca(): void {
    this.isBuscaOpen = true;
  }

  closeBusca(): void {
    this.isBuscaOpen = false;
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    this.closeBusca();
    if (this.isSearchOpen) {
      this.closeSearch();
    }
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    // Evitar fechar a busca se o clique for dentro do input de busca
    if (
      !target.closest('app-header-saved-search') &&
      !target.closest('input.search-bar') // Não fechar se clicar na barra de busca
    ) {
      this.closeBusca();
      if (this.isSearchOpen) {
        this.closeSearch();
      }
    }
    console.log('handleClickOutside - target:', target.tagName, 'isSearchOpen:', this.isSearchOpen);
  }

  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    this.selectAllEvent.emit(this.selectAll);
  }

  selectOption(option: string): void {
    this.selectedOption = option;
    this.isDropdownOpen = false;
  }

  setSelectedTab(tab: string): void {
    this.selectedTab = tab;
    this.filterNewsEvent.emit(tab);
    console.log('setSelectedTab:', tab);
  }

  toggleSidebar(): void {
    this.sidebarToggle.emit();
    console.log('toggleSidebar chamado');
  }

  onSearchChange(query: string): void {
    this.searchChange.emit(query);
    console.log('onSearchChange:', query);
  }
}