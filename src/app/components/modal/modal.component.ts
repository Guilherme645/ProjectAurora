import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  standalone: false
})
export class ModalComponent  {

  @Input() isVisible: boolean = false;
  @Input() title: string = 'Atenção';
  @Input() message: string = '';
  @Input() subMessage: string = '';
  @Input() confirmButtonText: string = 'Confirmar';
  @Input() cancelButtonText: string = 'Cancelar';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
    this.close.emit();
  }

  onCancel(): void {
    this.cancel.emit();
    this.close.emit();
  }

  onClose(): void {
    this.close.emit();
  }
}
