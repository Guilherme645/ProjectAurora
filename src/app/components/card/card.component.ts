import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  standalone: false
})
export class CardComponent {
  @Input() noticias: any; // Inclui o campo 'id'
  @Input() isSelected: boolean = false;
  @Output() selectionChange = new EventEmitter<boolean>();

  isModalOpen: boolean = false;
  allSelected: boolean = false;

  isMobile: boolean = window.innerWidth <= 768;
  isMenuOpen: boolean = false;
  isEntitiesModalOpen: boolean = false;
  showTagFilter: boolean = false;

  dropdownPosition: { top: number; left: number } = { top: 0, left: 0 };
  activeCardId: string | null = null; // Armazena o ID do card onde o menu foi aberto

  @HostListener('window:resize')
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  @HostListener('document:keydown.escape')
  closeModals(): void {
    this.showTagFilter = false;
    this.isEntitiesModalOpen = false;
    this.isMenuOpen = false;
    this.activeCardId = null; // Reseta o card ativo ao fechar
  }

  closeTagFilter(): void {
    this.showTagFilter = false;
  }

  closeEntitiesModal(): void {
    this.isEntitiesModalOpen = false;
  }

  toggleMenu(event: MouseEvent): void {
    const button = event.currentTarget as HTMLElement;
    const cardId = this.noticias.id; // Pega o ID do card atual

    if (this.activeCardId === cardId && this.isMenuOpen) {
      // Se o menu já está aberto para este card, fecha-o
      this.isMenuOpen = false;
      this.activeCardId = null;
    } else {
      // Abre o menu para este card
      const rect = button.getBoundingClientRect();
      this.dropdownPosition = {
        top: rect.bottom + window.scrollY + 5, // Abaixo do botão com um pequeno espaçamento
        left: rect.right + window.scrollX - 187 // Alinha à direita do botão, ajustando pela largura do dropdown (187px)
      };
      this.isMenuOpen = true;
      this.activeCardId = cardId; // Armazena o ID do card ativo
    }
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

  onCheckboxChange(event: Event): void {
    this.selectionChange.emit((event.target as HTMLInputElement).checked);
  }

  openModal(): void {
    this.isModalOpen = true;
  }
}