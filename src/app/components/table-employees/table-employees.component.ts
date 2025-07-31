// src/app/components/table-employees/table-employees.component.ts

import { Component, AfterViewInit, EventEmitter, Output, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChipColor } from '../chips/chips.component';

// Interface para os dados da tabela
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
export class TableEmployeesComponent implements AfterViewInit, OnInit, OnChanges {
  
  // Recebe a lista de colaboradores do componente pai
  @Input() collaborators: Collaborator[] = [];
  
  @Output() deactivateCollaborator = new EventEmitter<Collaborator>();
  @Output() editCollaborator = new EventEmitter<Collaborator>();
  
  // Propriedades de paginação
  paginatedCollaborators: Collaborator[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;

  constructor() {}

  // Detecta mudanças na lista principal e recalcula a paginação
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collaborators'] && !changes['collaborators'].firstChange) {
      this.recalculatePagination();
    }
  }

  ngOnInit(): void {
    this.recalculatePagination();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if ((window as any).HSStaticMethods) {
        (window as any).HSStaticMethods.autoInit();
      }
    }, 100);
  }

  recalculatePagination(): void {
    if (!this.collaborators) return;
    this.totalPages = Math.ceil(this.collaborators.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    } else if (this.totalPages === 0) {
      this.currentPage = 1;
    }
    this.updatePaginatedCollaborators();
  }

  updatePaginatedCollaborators(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCollaborators = this.collaborators.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedCollaborators();
    }
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  get pagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  // Lida com o clique no switch de status
  onStatusChange(collaborator: Collaborator, newStatus: boolean): void {
    if (!newStatus) {
      this.deactivateCollaborator.emit(collaborator);
    } else {
      // Para reativar, a lógica deve estar no componente pai para manter consistência
      // Aqui, apenas emitimos um evento ou deixamos o pai lidar com isso
      // Neste caso, vamos assumir que apenas a desativação precisa de um modal.
      collaborator.status = 'active';
    }
  }

  // Lida com o clique no botão de editar
  onEdit(collaborator: Collaborator): void {
    this.editCollaborator.emit(collaborator);
  }

  getChipColor(type: 'Owner' | 'Analista Interno'): ChipColor {
    switch (type) {
      case 'Owner': return 'green';
      case 'Analista Interno': return 'blue';
      default: return 'gray';
    }
  }
}