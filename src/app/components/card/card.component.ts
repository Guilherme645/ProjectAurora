import { Component, Input, OnInit, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input() noticias: any;
  @Input() isSelected: boolean = false; // Recebe a flag de seleção do HeaderComponent
  @Output() selectionChange = new EventEmitter<boolean>(); // Emite o evento de seleção
  allSelected: boolean = false; // Controle da seleção global

  showTagFilter: boolean = false;
  isMobile = false;
  isMenuOpen = false;
  isEntitiesModalOpen = false;

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleAllCards(selectAll: boolean) {
    this.allSelected = selectAll; // Define o estado global para todos os cards
  }

  openTagFilter(event: Event): void {
    event.preventDefault();
    this.showTagFilter = true;
  }

  closeTagFilter(): void {
    this.showTagFilter = false;
  }

  openEntitiesModal(): void {
    this.isMenuOpen = false;
    this.isEntitiesModalOpen = true;
  }

  closeEntitiesModal(): void {
    this.isEntitiesModalOpen = false;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onCheckboxChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectionChange.emit(isChecked); // Notifica o componente pai sobre a mudança de seleção
  }
}
