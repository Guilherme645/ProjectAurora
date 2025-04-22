import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-discard-changes-modal',
  templateUrl: './discard-changes-modal.component.html',
  styleUrls: ['./discard-changes-modal.component.css'],
  standalone: false
})
export class DiscardChangesModalComponent {
  @Input() context: 'edit' | 'new' = 'edit'; // controla a mensagem
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  get title(): string {
    return this.context === 'edit' ? 'Descartar alterações' : 'Descartar nova busca';
  }

  get description(): string {
    return this.context === 'edit'
      ? 'Ao sair você perderá todas as informações alteradas, deseja continuar?'
      : 'Ao sair você perderá todas as informações da nova busca, deseja continuar?';
  }

  get confirmText(): string {
    return this.context === 'edit' ? 'Descartar alterações' : 'Descartar nova busca';
  }
}
