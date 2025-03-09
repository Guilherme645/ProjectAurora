import { Component, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    standalone: false
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

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isCollapsed = window.scrollY > 50;
  }

  @HostListener('window:resize', [])
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
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
