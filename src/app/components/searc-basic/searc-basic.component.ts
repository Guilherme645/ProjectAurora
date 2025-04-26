import { Component, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
  selector: 'app-searc-basic',
  templateUrl: './searc-basic.component.html',
  styleUrls: ['./searc-basic.component.css'],
  standalone: false
})
export class SearcBasicComponent {
  isScrolled = false;
  searchQuery: string = '';
  isDropdownOpen = false;
  selectedOption: string = 'Mais relevantes';
  isBuscaOpen = false;
  selectedTab: string = 'todos';
  selectAll: boolean = false;
  currentUser: string = 'Superior Tribunal Federal';

  @Output() selectAllEvent = new EventEmitter<boolean>();
  @Output() filterNewsEvent = new EventEmitter<string>();

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    this.isScrolled = scrollTop > 100;  
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.isDropdownOpen = false;
  }

  openAdvancedSearch(): void {
    console.log('Buscando por:', this.searchQuery);
  }

  openBusca() {
    this.isBuscaOpen = true;
  }

  closeBusca() {
    this.isBuscaOpen = false;
  }

  onSearch() {
    console.log('Realizar busca por:', this.searchQuery);
  }

  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    this.selectAllEvent.emit(this.selectAll);
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
    this.filterNewsEvent.emit(tab);  // << Emite o nome da aba: 'todos', 'brutos' ou 'clippings'
  }
}
