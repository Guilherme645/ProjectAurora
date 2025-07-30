import { Component } from '@angular/core';
import { Collaborator as TableCollaborator } from 'src/app/components/table-employees/table-employees.component';
// ✅ ESTA IMPORTAÇÃO AGORA FUNCIONA CORRETAMENTE
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

  constructor() {}

  openCreationModal(): void {
    this.selectedCollaboratorForEdit = null;
    this.isModalOpen = true;
  }

  handleEdit(collaborator: TableCollaborator): void {
    this.selectedCollaboratorForEdit = {
      fullName: collaborator.name,
      email: collaborator.email,
      password: '',
      collaboratorType: this.mapUserTypeToModalType(collaborator.userType),
      cpfCnpj: '000.000.000-00', // Substitua por dados reais se disponíveis
    };
    this.isModalOpen = true;
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
      console.log(`Confirmando desativação para: ${this.selectedCollaboratorForDeactivation.name}`);
    }
    this.closeDeactivationModal();
  }

  private mapUserTypeToModalType(userType: 'Owner' | 'Analista Interno'): string {
    const typeMap = {
      'Owner': 'admin',
      'Analista Interno': 'editor',
    };
    return typeMap[userType] || 'viewer';
  }

    onUserChange(user: any): void {
    console.log('Usuário alterado:', user);
  }

  toggleModal(): void {
    this.isModalOpen = !this.isModalOpen;
  }

 
}