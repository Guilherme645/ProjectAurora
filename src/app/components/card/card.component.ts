import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  standalone: false
})
export class CardComponent {
  @Input() allSelected: boolean = false; // Recebe o estado de "Selecionar Todos"
  @Input() searchQuery: string = '';
@Input() noticias: any;
@Input() isSelected: boolean = false; // Mantenha este input para a verificação do checkbox
@Output() selectionChange = new EventEmitter<{ noticia: any, isSelected: boolean }>();

  isModalOpen: boolean = false;
  isMobile: boolean = window.innerWidth <= 768;
  isMenuOpen: boolean = false;
  isEntitiesModalOpen: boolean = false;
  showTagFilter: boolean = false;

  dropdownPosition: { top: number; left: number } = { top: 0, left: 0 };
  activeCardId: string | null = null;

  constructor(private router: Router) {}

  @HostListener('window:resize')
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  @HostListener('document:keydown.escape')
  closeModals(): void {
    this.showTagFilter = false;
    this.isEntitiesModalOpen = false;
    this.isMenuOpen = false;
    this.activeCardId = null;
  }

  toggleMenu(event: MouseEvent): void {
    const button = event.currentTarget as HTMLElement;
    const cardId = this.noticias.id;

    if (this.activeCardId === cardId && this.isMenuOpen) {
      this.isMenuOpen = false;
      this.activeCardId = null;
    } else {
      const rect = button.getBoundingClientRect();
      this.dropdownPosition = {
        top: rect.bottom + window.scrollY + 5,
        left: rect.right + window.scrollX - 187
      };
      this.isMenuOpen = true;
      this.activeCardId = cardId;
    }
  }

onCheckboxChange(event: Event): void {
  const checked = (event.target as HTMLInputElement).checked;
  this.selectionChange.emit({ noticia: this.noticias, isSelected: checked });
}

  openEntitiesModal(): void {
    this.isEntitiesModalOpen = true;
    this.isMenuOpen = false;
    this.activeCardId = null;
  }

  openTagFilter(event: Event): void {
    event.preventDefault();
    this.showTagFilter = true;
  }

  closeTagFilter(): void {
    this.showTagFilter = false;
  }

  closeEntitiesModal(): void {
    this.isEntitiesModalOpen = false;
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  irParaDetalhes() {
    this.router.navigate(['/mention-details']);
  }
}