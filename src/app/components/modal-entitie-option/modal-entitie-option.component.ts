import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-entitie-option',
  templateUrl: './modal-entitie-option.component.html',
  styleUrls: ['./modal-entitie-option.component.css'],
  standalone: false,
})
export class ModalEntitieOptionComponent {
  @Input() entityName: string = '';
  @Input() type: string = '';
  @Input() position: { top: number, left: number } = { top: 0, left: 0 };
  @Output() close = new EventEmitter<void>();
  @Output() addToSavedSearchEvent = new EventEmitter<{ entity: string, type: string }>();

  closeModal() {
    this.close.emit();
  }

  addToSavedSearch() {
    console.log('Emitting addToSavedSearchEvent:', { entity: this.entityName, type: this.type });
    this.addToSavedSearchEvent.emit({ entity: this.entityName, type: this.type });
    this.closeModal(); // Fecha o modal após emitir o evento
  }

  highlightOnlyThisWord() {
    console.log('Destacar apenas essa palavra:', this.entityName);
  }
}