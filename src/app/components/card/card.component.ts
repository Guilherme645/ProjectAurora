import { Component, Input, OnInit, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input() noticias: any;
  @Input() isSelected: boolean = false;
  @Output() selectionChange = new EventEmitter<boolean>();

  allSelected: boolean = false;
  showTagFilter: boolean = false;
  isMobile: boolean = false;
  isMenuOpen: boolean = false;
  isEntitiesModalOpen: boolean = false;

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768; // Define se está em mobile
  }

  // Função para abrir o modal de tag filter
  openTagFilter(event: Event): void {
    event.preventDefault();
    this.showTagFilter = true;
  }

  // Função para fechar o modal de tag filter
  closeTagFilter(): void {
    this.showTagFilter = false;
  }

  // Detecta a tecla "Escape" para fechar o modal
  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent): void {
    if (this.showTagFilter) {
      this.closeTagFilter();
    }
  }

  toggleAllCards(selectAll: boolean): void {
    this.allSelected = selectAll;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  openEntitiesModal() {
    this.isEntitiesModalOpen = true;
    this.isMenuOpen = false; // Fecha o menu ao abrir o modal
  }

  closeEntitiesModal() {
    this.isEntitiesModalOpen = false;
  }

  onCheckboxChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectionChange.emit(isChecked);
  }
}
