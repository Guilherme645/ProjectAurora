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
  isMobile: boolean = false;
  isCollapsed: boolean = false;
  selectedOption: string = 'Mais relevantes';
  selectedTab: string = 'brutos';
  selectAll: boolean = false;

  @Output() selectAllEvent = new EventEmitter<boolean>();
  @Output() filterNewsEvent = new EventEmitter<string>();
  @Output() openBusca = new EventEmitter<void>(); // Já adicionado anteriormente
  @Output() toggleSearch = new EventEmitter<void>(); // Já adicionado anteriormente

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 50;
    this.isCollapsed = window.scrollY > 50;
  }

  @HostListener('window:resize', [])
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
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