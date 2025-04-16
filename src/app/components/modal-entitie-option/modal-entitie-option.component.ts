import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-entitie-option',
  templateUrl: './modal-entitie-option.component.html',
  styleUrls: ['./modal-entitie-option.component.css'],
  standalone: false
})
export class ModalEntitieOptionComponent {
  @Input() entityName: string = 'Entidade';
  @Input() type: string = '';
  @Input() position: { top: number; left: number } = { top: 0, left: 0 };
  @Output() close = new EventEmitter<void>();

  addToSavedSearch() {
    console.log(`Adicionando "${this.entityName}" à busca salva`);
    this.close.emit(); // Fecha o modal após a ação
  }

  highlightOnlyThisWord() {
    console.log(`Destacando somente "${this.entityName}"`);
    this.close.emit(); // Fecha o modal após a ação
  }
}