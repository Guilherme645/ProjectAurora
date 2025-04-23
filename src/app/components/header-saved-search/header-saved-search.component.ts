import { Component, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { SimpleInputSearchComponent } from '../simple-input-search/simple-input-search.component';

@Component({
  selector: 'app-header-saved-search',
  templateUrl: './header-saved-search.component.html',
  styleUrls: ['./header-saved-search.component.css'],
  standalone: false
})
export class HeaderSavedSearchComponent implements OnInit {
  isScrolled: boolean = false;
  isDropdownOpen: boolean = false;
  isMobile: boolean = false;
  isCollapsed: boolean = false;
  isSearchOpen: boolean = false;
  searchQuery: string = '';
  selectedOption: string = 'Mais relevantes';
  selectedTab: string = 'todas';
  selectAll: boolean = false;

  @ViewChild('searchComponent') searchComponent!: SimpleInputSearchComponent;
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
    // Só redefinir isSearchOpen se o estado de isMobile mudar
    if (previousIsMobile !== this.isMobile) {
      this.isSearchOpen = false; // Fecha a busca ao mudar de mobile para desktop ou vice-versa
    }
  }

  openSearch() {
    this.isSearchOpen = true;
    this.searchComponent.openBusca(); // Abre a barra de busca no componente filho
  }

  closeSearch(): void {
    this.isSearchOpen = false;
    this.searchComponent.closeBusca(); // Fecha a barra de busca no componente filho
    this.searchQuery = '';
    this.searchChange.emit('');
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (this.isSearchOpen) {
      this.closeSearch();
    }
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    // Evitar fechar a busca se o clique for dentro do input de busca ou no botão de busca
    if (
      !target.closest('app-header-saved-search') &&
      !target.closest('input.search-bar') &&
      !target.closest('button[aria-label="Abrir busca"]')
    ) {
      if (this.isSearchOpen) {
        this.closeSearch();
      }
    }
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
  }

  toggleSidebar(): void {
    this.sidebarToggle.emit();
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.searchChange.emit(query);
  }
}