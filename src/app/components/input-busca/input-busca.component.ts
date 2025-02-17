import { Component } from '@angular/core';

@Component({
  selector: 'app-input-busca',
  templateUrl: './input-busca.component.html',
  styleUrls: ['./input-busca.component.css']
})
export class InputBuscaComponent {
  isSearchModalOpen: boolean = false; // Controle do modal de busca

  constructor() {}

  // Método para abrir o modal
  openSearchModal() {
    this.isSearchModalOpen = true;
  }

  // Método para fechar o modal ao clicar fora dele
  closeSearchModal(event: Event) {
    const modalContent = document.querySelector('.modal-container');
    if (modalContent && !modalContent.contains(event.target as Node)) {
      this.isSearchModalOpen = false;
    }
  }

  // Método executado ao clicar em "Fazer busca"
  onSearch() {
    console.log('Buscando...');
    // Insira a lógica da busca aqui, como chamadas para a API ou filtros
  }
}
