// src/app/pages/employees/employees.component.ts

import { Component } from '@angular/core';
import { Collaborator as TableCollaborator } from 'src/app/components/table-employees/table-employees.component';
import { Collaborator as ModalCollaborator } from 'src/app/components/modal-create-collaborator/modal-create-collaborator.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
    standalone: false

})
export class EmployeesComponent {
  isModalOpen = false;
  isDeactivationModalOpen = false;
  selectedCollaboratorForDeactivation: TableCollaborator | null = null;
  selectedCollaboratorForEdit: ModalCollaborator | null = null;

  // Lista de colaboradores centralizada neste componente (Single Source of Truth)
  collaborators: TableCollaborator[] = [
    { id: 1, name: 'John Brown', email: 'johnbrown@bluebossa.com.br', userType: 'Owner', registrationDate: '2024-01-15', lastLogin: '2025-07-29', status: 'active' },
    { id: 2, name: 'Jim Green', email: 'jimgreen@bluebossa.com.br', userType: 'Analista Interno', registrationDate: '2024-02-20', lastLogin: '2025-07-28', status: 'active' },
    { id: 3, name: 'Joe Black', email: 'joeblack@bluebossa.com.br', userType: 'Analista Interno', registrationDate: '2024-03-10', lastLogin: '2025-07-27', status: 'active' },
    { id: 4, name: 'Edward King', email: 'edwardking@bluebossa.com.br', userType: 'Analista Interno', registrationDate: '2024-03-12', lastLogin: '2025-07-25', status: 'inactive' },
    { id: 5, name: 'Sarah Page', email: 'sarahpage@bluebossa.com.br', userType: 'Analista Interno', registrationDate: '2024-04-05', lastLogin: '2025-07-22', status: 'inactive' },
    { id: 6, name: 'Peter Jones', email: 'peterjones@bluebossa.com.br', userType: 'Analista Interno', registrationDate: '2024-05-01', lastLogin: '2025-07-19', status: 'inactive' },
    { id: 7, name: 'Maria Garcia', email: 'mariagarcia@bluebossa.com.br', userType: 'Analista Interno', registrationDate: '2024-05-15', lastLogin: '2025-07-29', status: 'active' },
  ];

  constructor() {}

  // Abre o modal para criar um novo colaborador
  openCreationModal(): void {
    this.selectedCollaboratorForEdit = null;
    this.isModalOpen = true;
  }

  // Lida com o evento de edição vindo da tabela
  handleEdit(collaborator: TableCollaborator): void {
    this.selectedCollaboratorForEdit = {
      fullName: collaborator.name,
      email: collaborator.email,
      collaboratorType: this.mapUserTypeToModalType(collaborator.userType),
      cpfCnpj: '000.000.000-00', // Dado fictício, substitua se tiver o real
    };
    this.isModalOpen = true;
  }
  
  // Adiciona ou atualiza um colaborador na lista principal
  handleCollaboratorSaved(newData: ModalCollaborator): void {
    if (this.selectedCollaboratorForEdit) {
      // Lógica de Atualização
      const index = this.collaborators.findIndex(c => c.email === this.selectedCollaboratorForEdit!.email);
      if (index !== -1) {
        const updatedCollaborator = {
          ...this.collaborators[index],
          name: newData.fullName,
          email: newData.email,
          userType: this.mapModalTypeToUserType(newData.collaboratorType)
        };
        const allCollaborators = [...this.collaborators];
        allCollaborators[index] = updatedCollaborator;
        this.collaborators = allCollaborators;
      }
    } else {
      // Lógica de Criação
      const newCollaborator: TableCollaborator = {
        id: this.collaborators.length > 0 ? Math.max(...this.collaborators.map(c => c.id)) + 1 : 1,
        name: newData.fullName,
        email: newData.email,
        userType: this.mapModalTypeToUserType(newData.collaboratorType),
        registrationDate: new Date().toISOString().split('T')[0],
        lastLogin: 'Nunca',
        status: 'active'
      };
      this.collaborators = [newCollaborator, ...this.collaborators];
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedCollaboratorForEdit = null;
  }

  onDeactivateCollaborator(collaborator: TableCollaborator): void {
    this.selectedCollaboratorForDeactivation = collaborator;
    this.isDeactivationModalOpen = true;
  }

  closeDeactivationModal(): void {
    this.isDeactivationModalOpen = false;
    this.selectedCollaboratorForDeactivation = null;
  }

  confirmDeactivation(): void {
    if (this.selectedCollaboratorForDeactivation) {
      const index = this.collaborators.findIndex(c => c.id === this.selectedCollaboratorForDeactivation!.id);
      if (index !== -1) {
        const updatedCollaborator = { ...this.collaborators[index], status: 'inactive' as 'inactive' };
        const allCollaborators = [...this.collaborators];
        allCollaborators[index] = updatedCollaborator;
        this.collaborators = allCollaborators;
      }
    }
    this.closeDeactivationModal();
  }

  private mapUserTypeToModalType(userType: 'Owner' | 'Analista Interno'): string {
    const typeMap = { 'Owner': 'admin', 'Analista Interno': 'editor' };
    return typeMap[userType] || 'viewer';
  }

  private mapModalTypeToUserType(modalType: string): 'Owner' | 'Analista Interno' {
    return modalType === 'admin' ? 'Owner' : 'Analista Interno';
  }

  onUserChange(user: any): void {
    console.log('Usuário alterado:', user);
  }

  toggleModal(): void {
    if(this.isModalOpen){
      this.closeModal();
    } else {
      this.openCreationModal();
    }
  }
}