import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

export type IndexExplainType = 'relevance' | 'quality';

@Component({
  selector: 'app-index-explain-modal',
  templateUrl: './index-explain-modal.component.html',
  standalone: false,
})
export class IndexExplainModalComponent {
  @Input() open = false;
  @Input() type: IndexExplainType = 'relevance';

  @Input() description = '';
  @Input() formula = '';
  @Input() score: 1 | 2 | 3 | 4 | 5 = 3;

  @Output() close = new EventEmitter<void>();

  get isRelevance() {
    return this.type === 'relevance';
  }

  // Gradiente do Fundo Superior (Header)
  get headerBackground(): string {
    return this.isRelevance
      ? 'linear-gradient(7.77deg, #FFFFFF 11.54%, #2563EB 161.89%)' // Azul
      : 'linear-gradient(7.77deg, #FFFFFF 11.54%, #CE8030 154.32%)'; // Laranja
  }

  // Gradiente da Régua Vertical
  get barBackground(): string {
    return this.isRelevance
      ? 'linear-gradient(179.65deg, #D7DFF1 0.27%, #2563EB 150.01%)' // Azul -> Azul Escuro
      : 'linear-gradient(179.8deg, #E75E2A 0.18%, #9FBE3B 99.83%)';   // Laranja -> Verde
  }

  onClose() {
    this.close.emit();
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.open) this.onClose();
  }
}