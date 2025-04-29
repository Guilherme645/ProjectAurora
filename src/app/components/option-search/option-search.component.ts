// option-search.component.ts
import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-option-search',
  templateUrl: './option-search.component.html',
  styleUrls: ['./option-search.component.css'],
  standalone: false,
})
export class OptionSearchComponent {
  isMenuOpen: boolean = false;
  @Input() cardData: any;

  constructor(
    private elementRef: ElementRef,
    private modalService: ModalService
  ) {}

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  openEditModal(): void {
    this.modalService.openEditModal(this.cardData);
    this.isMenuOpen = false;
  }

  openDuplicateModal(): void {
    this.modalService.openDuplicateModal(this.cardData);
    this.isMenuOpen = false;
  }

  openRemoveModal(): void {
    this.modalService.openRemoveModal(this.cardData);
    this.isMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const clickedInsideMenu = this.elementRef.nativeElement.contains(target);
    if (!clickedInsideMenu) {
      this.isMenuOpen = false;
    }
  }
}