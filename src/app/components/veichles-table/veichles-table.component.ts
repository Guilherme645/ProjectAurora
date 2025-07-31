import { Component, OnInit } from '@angular/core';

// Define a interface para o modelo de dados de cada veículo
export interface Vehicle {
  id: number;
  name: string;
  logoUrl: string;
  mediaType: string;
  selected: boolean;
}


@Component({
  selector: 'app-veichles-table',
  templateUrl: './veichles-table.component.html',
  styleUrls: ['./veichles-table.component.css'],
  standalone: false
})
export class VeichlesTableComponent implements OnInit {
  // Array que armazena a lista de veículos a serem exibidos na tabela
  vehicles: Vehicle[] = [];
  
  // Controla o estado do checkbox principal no cabeçalho
  isAllSelected = false;

  // Termo de busca do input
  searchTerm: string = '';

  constructor() { }

  ngOnInit(): void {
    // Popula a lista de veículos com os dados corrigidos
    this.vehicles = [
      { 
        id: 1, 
        name: 'TV Globo', 
        logoUrl: '/assets/logos/globo.png', // Corrigido para um caminho de logo mais genérico
        mediaType: 'Televisão (Vídeo)', // <-- CAMPO ADICIONADO
        selected: false 
      },
      { 
        id: 2, 
        name: 'Folha de São Paulo', 
        logoUrl: '/assets/logos/fsp.png', // Usando um caminho local para consistência
        mediaType: 'Jornal Impresso (Texto)', 
        selected: false 
      },
      { 
        id: 3, 
        name: 'G1', 
        logoUrl: '/assets/logos/g1.png', // Usando um caminho local para consistência
        mediaType: 'Mídias Web (Texto)', 
        selected: true 
      },
      { 
        id: 4, 
        name: 'TV Globo', 
        logoUrl: '/assets/logos/globo.png',
        mediaType: 'Televisão (Vídeo)', 
        selected: false 
      },
      { 
        id: 5, 
        name: 'G1', 
        logoUrl: '/assets/logos/g1.png',
        mediaType: 'Mídias Web (Texto)', 
        selected: false 
      },
      { 
        id: 6, 
        name: 'G1', 
        logoUrl: '/assets/logos/g1.png',
        mediaType: 'Mídias Web (Texto)', 
        selected: false 
      }
    ];
    this.updateMasterCheckboxState();
  }

  // Alterna a seleção de um único veículo e atualiza o estado do checkbox mestre
  toggleSelection(vehicle: Vehicle): void {
    vehicle.selected = !vehicle.selected;
    this.updateMasterCheckboxState();
  }

  // Alterna a seleção de todos os veículos de uma vez
  toggleAllSelection(): void {
    this.isAllSelected = !this.isAllSelected;
    this.vehicles.forEach(v => v.selected = this.isAllSelected);
  }

  // Atualiza o estado do checkbox mestre (marcado se todos os itens estiverem marcados)
  private updateMasterCheckboxState(): void {
    if (this.vehicles.length === 0) {
      this.isAllSelected = false;
      return;
    }
    this.isAllSelected = this.vehicles.every(v => v.selected);
  }

  // Retorna a lista de veículos filtrada pelo termo de busca
  get filteredVehicles(): Vehicle[] {
    if (!this.searchTerm.trim()) {
      return this.vehicles;
    }
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    return this.vehicles.filter(vehicle => 
      vehicle.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      vehicle.mediaType.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }
}
