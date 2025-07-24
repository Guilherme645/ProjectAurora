import { Component } from '@angular/core';

@Component({
  selector: 'app-clients', // Certifique-se de que este é o seletor do seu componente principal
  templateUrl: './clients.component.html', // Onde o HTML principal está
  styleUrls: ['./clients.component.css'],
  standalone: false // ou true, dependendo da sua configuração do Angular
})
export class ClientsComponent {
  // Controla a visibilidade do modal de criação de cliente (app-modal-create-client)
  isModalOpen: boolean = false;

  // Controla a visibilidade do modal de prompt de contrato (app-modal-contract)
  isContractModalOpen: boolean = false;

  // NOVO: Controla a visibilidade do modal de criação de contrato/usuário (app-modal-create-contract-user)
  isCreateContractUserModalOpen: boolean = false;

  // Armazena o nome do cliente recém-criado para passar para o modal de contrato
  newlyCreatedClientName: string | undefined;

  constructor() {}

  // Método para abrir/fechar o modal de criação de cliente (app-modal-create-client)
  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
    // Se o modal principal for fechado, garantir que os outros também estejam
    if (!this.isModalOpen) {
      this.isContractModalOpen = false;
      this.isCreateContractUserModalOpen = false;
    }
  }

  // Método para fechar o modal de criação de cliente
  closeModal() {
    this.isModalOpen = false;
    // Limpar dados do cliente quando o modal de criação é fechado
    this.newlyCreatedClientName = undefined;
  }

  // Chamado quando um cliente é criado no app-modal-create-client
  // Ele recebe os dados do cliente e abre o modal de prompt de contrato
  openContractModal(clientData: { fantasyName: string }) { // Assumindo que clientData tem fantasyName
    this.closeModal(); // Fecha o modal de criação do cliente
    this.newlyCreatedClientName = clientData.fantasyName; // Armazena o nome para o próximo modal
    this.isContractModalOpen = true; // Abre o modal de prompt de contrato
    console.log('Cliente criado, abrindo modal de contrato para:', clientData.fantasyName);
  }

  // Chamado para fechar o modal de prompt de contrato (app-modal-contract)
  closeContractModal() {
    this.isContractModalOpen = false;
    // Limpar o nome do cliente ao fechar este modal (se não for continuar)
    this.newlyCreatedClientName = undefined;
    console.log('Modal de contrato fechado.');
  }

  // NOVO: Chamado quando "Continuar cadastro" é clicado no app-modal-contract
  // Fecha o modal de prompt de contrato e abre o modal de criação de contrato/usuário
  openCreateContractUserModal(): void {
    this.closeContractModal(); // Fecha o modal de prompt de contrato
    this.isCreateContractUserModalOpen = true; // Abre o modal de criação de contrato/usuário
    console.log('Continuando cadastro, abrindo modal de criação de contrato/usuário.');
  }

  // NOVO: Chamado para fechar o modal de criação de contrato/usuário (app-modal-create-contract-user)
  closeCreateContractUserModal(): void {
    this.isCreateContractUserModalOpen = false;
    console.log('Modal de criação de contrato/usuário fechado.');
  }

  // Método para lidar com a mudança de usuário (se necessário)
  onUserChange(event: any) {
    console.log('User changed:', event);
  }
}
