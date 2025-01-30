import { Component } from '@angular/core';

@Component({
  selector: 'app-mensoes',
  templateUrl: './mensoes.component.html',
  styleUrls: ['./mensoes.component.css']
})
export class MensoesComponent {
  dropdownOpen: boolean = false;
  modalAberto: boolean = false;

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }
    // Método para abrir o modal do relatório
    abrirRelatorioModal() {
      this.modalAberto = true;
    }
  
    // Método para fechar o modal do relatório
    fecharRelatorioModal() {
      this.modalAberto = false;
    }
}
