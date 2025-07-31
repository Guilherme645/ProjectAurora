// src/app/pages/clients/clients.component.ts

import { Component } from '@angular/core';
import { Client as TableClient } from '../../components/table-clients/table-clients.component';
import { ModalClient } from '../../components/modal-create-client/modal-create-client.component';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
  standalone: false
})
export class ClientsComponent {
  isModalOpen = false;
  selectedClientForEdit: ModalClient | null = null;
  isContractModalOpen = false;
  isCreateContractUserModalOpen = false;
  newlyCreatedClientName: string | undefined;

  // ✅ 1. A lista de clientes agora vive aqui.
  clients: TableClient[] = [
    { id: 1, name: 'Superior Tribunal Federal', cnpjCpf: '00.581.040/0001-45', type: 'Público', contracts: 1, email: 'stf@exemplo.com', phone: '(61) 3217-3000', stateRegistration: 'ISENTO', municipalRegistration: 'ISENTO' },
    { id: 2, name: 'Procuradoria Geral', cnpjCpf: '22.302.716/0001-02', type: 'Público', contracts: 1, email: 'pgr@exemplo.com', phone: '(61) 3105-5100', stateRegistration: 'ISENTO', municipalRegistration: 'ISENTO' },
    { id: 3, name: 'Nestlé Brasil Ltda.', cnpjCpf: '60.409.075/0001-52', type: 'Privado', contracts: 3, email: 'contato@nestle.com.br', phone: '(11) 5508-4400', stateRegistration: '110.041.222.118', municipalRegistration: '9.345.678-3' },
    { id: 4, name: 'Tribunal de Contas da União', cnpjCpf: '00.373.840/0001-90', type: 'Público', contracts: 1, email: 'tcu@exemplo.com', phone: '(61) 3316-7248', stateRegistration: 'ISENTO', municipalRegistration: 'ISENTO' },
  ];

  constructor() {}

  openCreationModal(): void {
    this.selectedClientForEdit = null;
    this.isModalOpen = true;
  }

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

  // ✅ 2. A função de `openContractModal` agora também adiciona o novo cliente à lista.
  openContractModal(clientData: ModalClient): void {
    // Adiciona o novo cliente à lista principal
    this.addClient(clientData);

    // Fecha o modal de criação
    this.closeModal();

    // Abre o próximo modal do fluxo
    this.newlyCreatedClientName = clientData.fantasyName;
    this.isContractModalOpen = true;
  }
  
  // ✅ 3. Nova função auxiliar para converter e adicionar o cliente.
  addClient(clientData: ModalClient): void {
    const newClient: TableClient = {
      id: this.clients.length + 1, // Geração de ID simples
      name: clientData.fantasyName,
      cnpjCpf: clientData.clientCpfCnpj,
      type: (clientData.clientType.charAt(0).toUpperCase() + clientData.clientType.slice(1)) as 'Público' | 'Privado' | 'Notas',
      contracts: 0, // Novo cliente começa com 0 contratos
      email: clientData.email,
      phone: clientData.phone,
      stateRegistration: clientData.stateRegistration,
      municipalRegistration: clientData.municipalRegistration,
    };
    // Adiciona o novo cliente no topo da lista para fácil visualização
    this.clients = [newClient, ...this.clients];
  }

  closeContractModal(): void { this.isContractModalOpen = false; }
  openCreateContractUserModal(): void { this.isContractModalOpen = false; this.isCreateContractUserModalOpen = true; }
  closeCreateContractUserModal(): void { this.isCreateContractUserModalOpen = false; }

  onUserChange(event: any) {
    console.log('User changed:', event);
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
    if (!this.isModalOpen) {
      this.isContractModalOpen = false;
      this.isCreateContractUserModalOpen = false;
    }
  }
}