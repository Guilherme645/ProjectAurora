import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-mensoes',
  templateUrl: './mensoes.component.html',
  styleUrls: ['./mensoes.component.css'],
  standalone: false
})
export class MensoesComponent {
  dropdownOpen: boolean = false;
  modalAberto: boolean = false;
  isBlurred: boolean = false; 
  @Input() selectedCount: number = 0;
  @Input() isBuscaOpen: boolean = false; 
  @Output() abrirRelatorioModal = new EventEmitter<void>();

  private updateBlurState(): void {
    this.isBlurred = this.isBuscaOpen || this.modalAberto;
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  abrirModalRelatorio() {
    this.abrirRelatorioModal.emit();
  }
  fecharRelatorioModal(): void {
    this.modalAberto = false;
    this.updateBlurState();
  }

  ngOnChanges(): void {
    this.updateBlurState();
  }
}