// Caminho do arquivo: src/app/pages/clients/clients.component.ts (Exemplo)

import { Component } from '@angular/core';

// =================================================================================
// 👇 VERIFIQUE SE ESTE CAMINHO ESTÁ CORRETO PARA A ESTRUTURA DO SEU PROJETO
// Se o seu componente 'table-clients' estiver em outra pasta, este caminho precisa mudar.
import { Client as TableClient } from '../../components/table-clients/table-clients.component';
import { ModalClient } from '../../components/modal-create-client/modal-create-client.component';
// =================================================================================

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
  standalone: false
})
export class ClientsComponent {
  isModalOpen = false;
  selectedClientForEdit: ModalClient | null = null;
  
  // Demais propriedades...
  isContractModalOpen = false;
  isCreateContractUserModalOpen = false;
  newlyCreatedClientName: string | undefined;

  constructor() {}

  openCreationModal(): void {
    this.selectedClientForEdit = null;
    this.isModalOpen = true;
  }

  // 👇 Note que o tipo aqui é TableClient, que é o alias para a interface importada
  handleEdit(clientToEdit: TableClient): void {
    this.selectedClientForEdit = {
      fantasyName: clientToEdit.name,
      clientCpfCnpj: clientToEdit.cnpjCpf,
      clientType: clientToEdit.type.toLowerCase(),
      email: clientToEdit.email || '',
      phone: clientToEdit.phone || '',
      stateRegistration: clientToEdit.stateRegistration || '',
      municipalRegistration: clientToEdit.municipalRegistration || '',
    };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedClientForEdit = null;
  }

  // Demais métodos...
  openContractModal(clientData: { fantasyName: string }): void {
    this.newlyCreatedClientName = clientData.fantasyName;
    this.isContractModalOpen = true;
  }

  closeContractModal(): void { this.isContractModalOpen = false; }
  openCreateContractUserModal(): void { this.isContractModalOpen = false; this.isCreateContractUserModalOpen = true; }
  closeCreateContractUserModal(): void { this.isCreateContractUserModalOpen = false; }


    // Método para lidar com a mudança de usuário (se necessário)
  onUserChange(event: any) {
    console.log('User changed:', event);
  }

 // Método para abrir/fechar o modal de criação de cliente (app-modal-create-client)
  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
    // Se o modal principal for fechado, garantir que os outros também estejam
    if (!this.isModalOpen) {
      this.isContractModalOpen = false;
      this.isCreateContractUserModalOpen = false;
    }
  }
}