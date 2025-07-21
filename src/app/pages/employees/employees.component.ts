import { Component } from '@angular/core';
import { Collaborator } from 'src/app/components/table-employees/table-employees.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
  standalone: false
})
export class EmployeesComponent {
  isModalOpen: boolean = false;
  isDeactivationModalOpen: boolean = false;
  selectedCollaboratorForDeactivation: Collaborator | null = null; // To hold the collaborator data

  onUserChange(user: any): void {
    console.log('Usuário alterado:', user);
  }

  toggleModal(): void {
    this.isModalOpen = !this.isModalOpen;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  /**
   * Opens the deactivation confirmation modal.
   * @param collaborator The collaborator object to be deactivated.
   */
  onDeactivateCollaborator(collaborator: Collaborator): void {
    this.selectedCollaboratorForDeactivation = collaborator;
    this.isDeactivationModalOpen = true;
  }

  /**
   * Closes the deactivation confirmation modal without performing deactivation.
   */
  closeDeactivationModal(): void {
    this.isDeactivationModalOpen = false;
    this.selectedCollaboratorForDeactivation = null; // Clear selected collaborator
  }

  /**
   * Confirms the deactivation of the selected collaborator.
   * In a real application, this would involve calling a service to update the backend.
   */
  confirmDeactivation(): void {
    if (this.selectedCollaboratorForDeactivation) {
      // Find the collaborator in the table data and update their status
      // This is a simplified example. In a real app, you'd likely have a service
      // that manages the `collaborators` array and persists changes.
      // For demonstration, we'll assume `app-table-employees` is a child and
      // its data needs to be updated. A better approach would be to use a shared service.

      // For now, let's just log the action and close the modal.
      console.log(`Confirming deactivation for: ${this.selectedCollaboratorForDeactivation.name}`);
      
      // You would typically call a service here to update the status in your backend
      // For example: this.employeeService.deactivateEmployee(this.selectedCollaboratorForDeactivation.id).subscribe(...)

      // After successful deactivation (or if it's handled by the table itself),
      // you might want to refresh the table data or update the specific collaborator's status.
      // Since `app-table-employees` manages its own `collaborators` array,
      // we need a way to tell it to update. For simplicity, we'll just log here.
      // If `collaborators` was managed in `EmployeesComponent`, we would update it here.
    }
    this.closeDeactivationModal();
  }
}
