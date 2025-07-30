import { Component, AfterViewInit, EventEmitter, Output, OnInit } from '@angular/core'; // 👈 1. IMPORTE O OnInit
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
export class TableEmployeesComponent implements AfterViewInit, OnInit { // 👈 2. IMPLEMENTE O OnInit

  @Output() deactivateCollaborator = new EventEmitter<Collaborator>();
  @Output() editCollaborator = new EventEmitter<Collaborator>();

  // 👇 3. DADOS EXPANDIDOS PARA DEMONSTRAR A PAGINAÇÃO
  collaborators: Collaborator[] = [
    { id: 1, name: 'John Brown', email: 'johnbrown@bluebossa.com.br', userType: 'Owner', registrationDate: '2024-01-15', lastLogin: '2025-07-29', status: 'active' },
    { id: 2, name: 'Jim Green', email: 'jimgreen@bluebossa.com.br', userType: 'Analista Interno', registrationDate: '2024-02-20', lastLogin: '2025-07-28', status: 'active' },
    { id: 3, name: 'Joe Black', email: 'joeblack@bluebossa.com.br', userType: 'Analista Interno', registrationDate: '2024-03-10', lastLogin: '2025-07-27', status: 'active' },
    { id: 4, name: 'Edward King', email: 'edwardking@bluebossa.com.br', userType: 'Analista Interno', registrationDate: '2024-03-12', lastLogin: '2025-07-25', status: 'inactive' },
    { id: 5, name: 'Sarah Page', email: 'sarahpage@bluebossa.com.br', userType: 'Analista Interno', registrationDate: '2024-04-05', lastLogin: '2025-07-22', status: 'inactive' },
    { id: 6, name: 'Peter Jones', email: 'peterjones@bluebossa.com.br', userType: 'Analista Interno', registrationDate: '2024-05-01', lastLogin: '2025-07-19', status: 'inactive' },
    { id: 7, name: 'Maria Garcia', email: 'mariagarcia@bluebossa.com.br', userType: 'Analista Interno', registrationDate: '2024-05-15', lastLogin: '2025-07-29', status: 'active' },
    { id: 8, name: 'James Smith', email: 'jamessmith@bluebossa.com.br', userType: 'Analista Interno', registrationDate: '2024-06-02', lastLogin: '2025-07-28', status: 'active' },
    { id: 9, name: 'Ana Souza', email: 'anasouza@bluebossa.com.br', userType: 'Analista Interno', registrationDate: '2024-07-11', lastLogin: '2025-07-26', status: 'active' },
    { id: 10, name: 'Lucas Ferreira', email: 'lucasferreira@bluebossa.com.br', userType: 'Analista Interno', registrationDate: '2024-08-01', lastLogin: '2025-07-29', status: 'active' },
    { id: 11, name: 'Beatriz Costa', email: 'beatrizcosta@bluebossa.com.br', userType: 'Analista Interno', registrationDate: '2024-08-15', lastLogin: '2025-07-25', status: 'active' },
    { id: 12, name: 'Carlos Lima', email: 'carloslima@bluebossa.com.br', userType: 'Analista Interno', registrationDate: '2024-09-01', lastLogin: '2025-07-20', status: 'inactive' },
    { id: 13, name: 'Daniel Alves', email: 'danielalves@bluebossa.com.br', userType: 'Analista Interno', registrationDate: '2024-09-20', lastLogin: '2025-07-29', status: 'active' },
    { id: 14, name: 'Fernanda Rocha', email: 'fernandarocha@bluebossa.com.br', userType: 'Analista Interno', registrationDate: '2024-10-05', lastLogin: '2025-07-28', status: 'active' },
  ];

  // 👇 4. ADICIONE AS PROPRIEDADES DE PAGINAÇÃO
  paginatedCollaborators: Collaborator[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10; // Itens por página, conforme solicitado
  totalPages: number = 0;

  constructor() {}

  ngOnInit(): void {
    // 5. INICIE A LÓGICA DA PAGINAÇÃO
    this.totalPages = Math.ceil(this.collaborators.length / this.itemsPerPage);
    this.updatePaginatedCollaborators();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if ((window as any).HSStaticMethods) {
        (window as any).HSStaticMethods.autoInit();
      }
    }, 100);
  }

  // 👇 6. ADICIONE OS MÉTODOS PARA CONTROLAR A PAGINAÇÃO
  /**
   * Atualiza a lista de colaboradores a ser exibida na página atual.
   */
  updatePaginatedCollaborators(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCollaborators = this.collaborators.slice(startIndex, endIndex);
  }

  /**
   * Navega para uma página específica.
   * @param page - O número da página de destino.
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedCollaborators();
    }
  }

  /**
   * Navega para a página anterior.
   */
  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  /**
   * Navega para a próxima página.
   */
  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  /**
   * Gera um array com os números das páginas para o controle de navegação.
   */
  get pagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  onStatusChange(collaborator: Collaborator, newStatus: boolean): void {
    if (!newStatus) {
      this.deactivateCollaborator.emit(collaborator);
    } else {
      collaborator.status = 'active';
      console.log(`Status do colaborador ${collaborator.name} (ID: ${collaborator.id}) alterado para: ${collaborator.status}`);
    }
  }

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