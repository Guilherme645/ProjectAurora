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
  selectedOption: string = 'Mais relevantes';
  selectedTab: string = 'brutos';
  selectAll: boolean = false;

  @Output() selectAllEvent = new EventEmitter<boolean>();
  @Output() filterNewsEvent = new EventEmitter<string>();

  ngOnInit(): void {
    this.checkScreenSize();
  }



  @HostListener('window:resize', [])
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
  }

  closeHighSearch(): void {
    this.isSearchOpen = false;
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
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('app-input-busca') && !target.closest('app-header')) {
      this.closeBusca();
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

  selectTab(tab: string): void {
    this.selectedTab = tab;
    this.filterNewsEvent.emit(tab);
  }

}
