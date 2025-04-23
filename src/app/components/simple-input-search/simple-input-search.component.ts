import { Component, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
  selector: 'app-simple-input-search',
  templateUrl: './simple-input-search.component.html',
  styleUrls: ['./simple-input-search.component.css'],
  standalone: false
})
export class SimpleInputSearchComponent {
  searchQuery: string = '';
  isBuscaOpen: boolean = false;
  isMobile: boolean = false;

  @Output() searchChange = new EventEmitter<string>();
  @Output() closeSearch = new EventEmitter<void>(); // Novo evento para fechar a busca

  constructor() {
    this.checkScreenSize();
  }

  @HostListener('window:resize', [])
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  onSearch() {
    this.searchChange.emit(this.searchQuery);
  }

  openBusca() {
    this.isBuscaOpen = true;
  }

  closeBusca() {
    this.isBuscaOpen = false;
    this.closeSearch.emit(); // Emite o evento para o componente pai
  }
}