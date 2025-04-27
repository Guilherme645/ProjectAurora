import { Component, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
  selector: 'app-search-saved-search',
  templateUrl: './search-saved-search.component.html',
  styleUrls: ['./search-saved-search.component.css'],
  standalone: false
})
export class SearchSavedSearchComponent {
  isScrolled: boolean = false;
  searchQuery: string = '';
  selectedTab: string = 'todos';
  selectAll: boolean = false;

  @Output() searchChange = new EventEmitter<string>();
  @Output() selectAllEvent = new EventEmitter<boolean>();
  @Output() filterNewsEvent = new EventEmitter<string>();

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    this.isScrolled = scrollTop > 100;
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchChange.emit(this.searchQuery);
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
    this.filterNewsEvent.emit(tab);
  }
  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    this.selectAllEvent.emit(this.selectAll);
  }

  onSearch(): void {
    this.searchChange.emit(this.searchQuery);
  }
}