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
  isBlurred: boolean = false; 
  @Input() selectedCount: number = 0;
  @Input() isBuscaOpen: boolean = false; 

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

  ngOnChanges(): void {
    this.updateBlurState();
  }
}