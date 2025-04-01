import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-remove-saved-search',
  templateUrl: './remove-saved-search.component.html',
  styleUrls: ['./remove-saved-search.component.css'],
  standalone: false,
})
export class RemoveSavedSearchComponent {
  @Output() cancel = new EventEmitter<void>();
  @Output() confirmRemove = new EventEmitter<void>();

  onCancel() {
    this.cancel.emit();
  }

  onConfirmRemove() {
    this.confirmRemove.emit();
  }
}