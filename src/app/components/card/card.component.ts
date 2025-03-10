import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.css'],
    standalone: false
})
export class CardComponent {
  @Input() noticias: any;
  @Input() isSelected: boolean = false;
  @Output() selectionChange = new EventEmitter<boolean>();

  isModalOpen: boolean = false;
  allSelected: boolean = false;

  isMobile: boolean = window.innerWidth <= 768;
  isMenuOpen: boolean = false;
  isEntitiesModalOpen: boolean = false;
  showTagFilter: boolean = false; 

  @HostListener('window:resize')
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  @HostListener('document:keydown.escape')
  closeModals(): void {
    this.showTagFilter = false;
    this.isEntitiesModalOpen = false;
  }

  closeTagFilter(): void {
    this.showTagFilter = false;
  }

  closeEntitiesModal(): void {
    this.isEntitiesModalOpen = false;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  openEntitiesModal(): void {
    this.isEntitiesModalOpen = true;
    this.isMenuOpen = false; 
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
