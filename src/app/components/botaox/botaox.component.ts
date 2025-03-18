import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-botaox',
  templateUrl: './botaox.component.html',
  styleUrl: './botaox.component.css',
  standalone: false
})
export class BotaoxComponent {
  @Output() onClose = new EventEmitter<void>();

  close() {
    this.onClose.emit(); // Emite o evento para os componentes pais
  }
}