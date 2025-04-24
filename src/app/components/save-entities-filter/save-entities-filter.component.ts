import { Component, EventEmitter, Output, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-save-entities-filter',
  templateUrl: './save-entities-filter.component.html',
  styleUrls: ['./save-entities-filter.component.css'],
  standalone: false
})
export class SaveEntitiesFilterComponent {
  @Output() close = new EventEmitter<void>();
  @Output() saveSelectedFilters = new EventEmitter<{ entity: string, selectedFilters: any[] }>();
  @Input() entityName: string = 'Brasília';

  searchTerm: string = ''; // Property to store the search input

  filterCards = [
    {
      title: 'Presidência',
      owner: 'Guilherme Soares',
      initials: 'GS',
      avatarColor: 'bg-blue-500',
      checked: false,
    },
    {
      title: 'Ministros',
      owner: 'Guilherme Soares',
      initials: 'GS',
      avatarColor: 'bg-blue-500',
      checked: true,
    },
    {
      title: 'Senadores',
      owner: 'Marina Campos',
      initials: 'MC',
      avatarColor: 'bg-red-500',
      checked: false,
    },
    {
      title: 'Deputados',
      owner: 'Guilherme Soares',
      initials: 'GS',
      avatarColor: 'bg-blue-500',
      checked: false,
    },
    {
      title: 'Juízes',
      owner: 'Sistema',
      initials: 'JS',
      avatarColor: 'bg-gray-400',
      checked: false,
    },
    {
      title: 'OAB',
      owner: 'Sistema',
      initials: 'OB',
      avatarColor: 'bg-gray-400',
      checked: false,
    },
  ];

  // Getter to compute the filtered cards based on the search term
  get filteredCards(): any[] {
    if (!this.searchTerm) {
      return this.filterCards; // Return all cards if search term is empty
    }
    const searchLower = this.searchTerm.toLowerCase();
    return this.filterCards.filter(card =>
      card.title.toLowerCase().includes(searchLower)
    );
  }

  getSelectedCount(): number {
    return this.filterCards.filter(card => card.checked).length;
  }

  closeFilter() {
    this.close.emit();
  }

  saveFilters() {
    const selectedFilters = this.filterCards.filter(card => card.checked);
    this.saveSelectedFilters.emit({ entity: this.entityName, selectedFilters });
    this.closeFilter();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKeydownHandler(event: KeyboardEvent) {
    event.preventDefault();
    this.closeFilter();
  }
}