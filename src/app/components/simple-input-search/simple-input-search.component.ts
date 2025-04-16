import { Component, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
  selector: 'app-simple-input-search',
  templateUrl: './simple-input-search.component.html',
  styleUrls: ['./simple-input-search.component.css'],
  standalone: false
})
export class SimpleInputSearchComponent {
  isScrolled = false;
  searchQuery: string = '';
  isDropdownOpen = false;
  selectedOption = 'Mais relevantes';
  isBuscaOpen = false;

  // Evento para emitir o valor da pesquisa
  @Output() searchChange = new EventEmitter<string>();

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    this.isScrolled = scrollTop > 100;
  }

  // Método chamado quando o input muda
  onSearch() {
    this.searchChange.emit(this.searchQuery);
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

  selectedTab: string = 'brutos';

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.isDropdownOpen = false;
  }
}