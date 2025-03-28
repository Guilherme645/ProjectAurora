// share-button.component.ts
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-share-button',
  templateUrl: './share-button.component.html',
  standalone: false
})
export class ShareButtonComponent {
  @Output() shareClicked = new EventEmitter<void>();

  onShareClick() {
    this.shareClicked.emit();
  }
}