import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mensoes',
  templateUrl: './mensoes.component.html',
  styleUrls: ['./mensoes.component.css'],
  standalone: false
})
export class MensoesComponent {
  dropdownOpen: boolean = false;
  modalAberto: boolean = false;
  isBlurred: boolean = false; // Inicialmente, não desfocado
  @Input() selectedCount: number = 0;
  @Input() isBuscaOpen: boolean = false; // Novo @Input para o estado do modal de busca

  // Método para atualizar o estado de desfoque com base no modal de busca e app-relatorio-modal
  private updateBlurState(): void {
    this.isBlurred = this.isBuscaOpen || this.modalAberto;
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  abrirRelatorioModal(): void {
    this.modalAberto = true;
    this.updateBlurState();
  }

  fecharRelatorioModal(): void {
    this.modalAberto = false;
    this.updateBlurState();
  }

  // Observa mudanças no @Input isBuscaOpen
  ngOnChanges(): void {
    this.updateBlurState();
  }
}