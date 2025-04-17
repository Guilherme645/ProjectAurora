import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-save-entities-filter',
  templateUrl: './save-entities-filter.component.html',
  styleUrls: ['./save-entities-filter.component.css'],
  standalone: false
})
export class SaveEntitiesFilterComponent {
  @Output() close = new EventEmitter<void>();

  selectedEntity: string = 'Brasília';

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

  getSelectedCount(): number {
    return this.filterCards.filter(card => card.checked).length;
  }

  closeFilter() {
    this.close.emit();
  }
}