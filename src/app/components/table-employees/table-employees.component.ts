import { Component, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { ChipColor } from '../chips/chips.component';

// Definimos a interface para tipar nossos dados
export interface Collaborator {
  id: number;
  name: string;
  email: string;
  userType: 'Owner' | 'Analista Interno';
  registrationDate: string;
  lastLogin: string;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-table-employees',
  templateUrl: './table-employees.component.html',
  styleUrls: ['./table-employees.component.css'],
  standalone: false
})
export class TableEmployeesComponent implements AfterViewInit {

  @Output() deactivateCollaborator = new EventEmitter<Collaborator>();

  collaborators: Collaborator[] = [
    { id: 1, name: 'John Brown', email: 'johnbrown@bluebossa.com.br', userType: 'Owner', registrationDate: '2024-01-15', lastLogin: '2025-06-29', status: 'active' },
    { id: 2, name: 'Jim Green', email: 'jimgreen@bluebossa.com.br', userType: 'Analista Interno', registrationDate: '2024-02-20', lastLogin: '2025-06-30', status: 'active' },
    { id: 3, name: 'Joe Black', email: 'joeblack@bluebossa.com.br', userType: 'Analista Interno', registrationDate: '2024-03-10', lastLogin: '2025-06-28', status: 'active' },
    { id: 4, name: 'Edward King', email: 'edwardking@bluebossa.com.br', userType: 'Analista Interno', registrationDate: '2024-03-12', lastLogin: '2025-06-25', status: 'inactive' },
    { id: 5, name: 'Joe Black', email: 'joeblack@bluebossa.com.br', userType: 'Analista Interno', registrationDate: '2024-04-05', lastLogin: '2025-06-22', status: 'inactive' },
    { id: 6, name: 'Jim Green', email: 'jimgreen@bluebossa.com.br', userType: 'Analista Interno', registrationDate: '2024-05-01', lastLogin: '2025-06-19', status: 'inactive' },
    { id: 7, name: 'Joe Black', email: 'joeblack@bluebossa.com.br', userType: 'Analista Interno', registrationDate: '2024-05-15', lastLogin: '2025-06-30', status: 'active' },
    { id: 8, name: 'Edward King', email: 'edwardking@bluebossa.com.br', userType: 'Analista Interno', registrationDate: '2024-06-02', lastLogin: '2025-06-29', status: 'active' },
    { id: 9, name: 'Joe Black', email: 'joeblack@bluebossa.com.br', userType: 'Analista Interno', registrationDate: '2024-07-11', lastLogin: '2025-06-27', status: 'active' },
    { id: 10, name: 'Jim Green', email: 'jimgreen@bluebossa.com.br', userType: 'Analista Interno', registrationDate: '2024-08-01', lastLogin: '2025-06-30', status: 'active' },
  ];

  constructor() {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      if ((window as any).HSStaticMethods) {
        (window as any).HSStaticMethods.autoInit();
      }
    }, 100);
  }

  onStatusChange(collaborator: Collaborator, newStatus: boolean): void {
    if (!newStatus) {
      this.deactivateCollaborator.emit(collaborator);
    } else {
      collaborator.status = 'active';
      console.log(`Status do colaborador ${collaborator.name} (ID: ${collaborator.id}) alterado para: ${collaborator.status}`);
    }
  }

  /**
   * 👇 2. ADICIONE ESTA FUNÇÃO
   * Converte o tipo de usuário para a cor correspondente do chip.
   */
  getChipColor(type: 'Owner' | 'Analista Interno'): ChipColor {
    switch (type) {
      case 'Owner':
        return 'green';
      case 'Analista Interno':
        return 'blue';
      default:
        return 'gray';
    }
  }
}