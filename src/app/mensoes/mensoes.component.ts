import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mensoes',
  templateUrl: './mensoes.component.html',
  styleUrls: ['./mensoes.component.css']
})
export class MensoesComponent {
  dropdownOpen: boolean = false;
  modalAberto: boolean = false;
  isBlurred: boolean = false; 
  @Input() selectedCount: number = 0;

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  abrirRelatorioModal(): void {
    this.modalAberto = true;
    this.isBlurred = true; 
  }

  fecharRelatorioModal(): void {
    this.modalAberto = false;
    this.isBlurred = false; 
  }
}
