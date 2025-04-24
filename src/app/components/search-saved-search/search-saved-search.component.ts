import { Component, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
  selector: 'app-search-saved-search',
  templateUrl: './search-saved-search.component.html',
  styleUrls: ['./search-saved-search.component.css'],
  standalone: false
})
export class SearchSavedSearchComponent {
  isScrolled: boolean = false; // Estado de rolagem da página
  searchQuery: string = ''; // Termo de busca
  selectedTab: string = 'todos'; // Aba selecionada
  allSelected: boolean = false; // Estado do checkbox "Selecionar todos"

  @Output() searchChange = new EventEmitter<string>(); // Evento para mudança na busca
  @Output() tabChange = new EventEmitter<string>(); // Evento para mudança de aba
  @Output() allSelectedChange = new EventEmitter<boolean>(); // Evento para mudança no checkbox

  // Monitora a rolagem da janela
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    this.isScrolled = scrollTop > 100;
  }

  // Limpa o campo de busca
  clearSearch(): void {
    this.searchQuery = '';
    this.searchChange.emit(this.searchQuery);
  }

  // Seleciona uma aba
  selectTab(tab: string): void {
    this.selectedTab = tab;
    this.tabChange.emit(tab);
  }

  // Alterna o estado do checkbox "Selecionar todos"
  toggleAllSelected(): void {
    this.allSelected = !this.allSelected;
    this.allSelectedChange.emit(this.allSelected);
  }

  // Emite o termo de busca
  onSearch(): void {
    this.searchChange.emit(this.searchQuery);
  }
}