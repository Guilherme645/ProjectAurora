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
    // Popula a lista de veículos com os dados da imagem
    this.vehicles = [
      { 
        id: 1, name: 'TV Globo', 
        logoUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDgiIHN0cm9rZT0iIzE1NUFDRiIgZmlsbD0iI0YwRjBGMyIvPgogIDxyZWN0IHg9IjI1IiB5PSI0MiIgd2lkdGg9IjUwIiBoZWlnaHQ9IjE2IiBmaWxsPSIjRkZGRkZGIi8+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iMjUiIGZpbGw9IiMxNTgzQ0YiLz4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIxMiIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4=', 
        mediaType: 'Televisão (Vídeo)', 
        selected: false 
      },
      { 
        id: 2, name: 'Folha de São Paulo', 
        logoUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAASFBMVEX///8AAAAyMjLy8vL6+vppaWnX19fAwMDt7e3MzMyJiYmcnJz29vaSkpKioqK6urqAgIB+fn6rq6tXV1dAQEBERETg4OBISEg8PDxubm7WgMfjAAABn0lEQVR4nO3dC27CMBAAwZgJ4oSc/v+XNKgtpTDSQjvT6fROWGUdmyJ8pCAIAAAAAAAAAAAAAAAAAAD455y31iTGW2s9xphrDbA2pplHzDk3j1kQ2Yy51iTetaZFRCLM2WstN8z5nj+iJjJmSToRkchESEYkMhGRkIlIRMZCIjISkYhIZCIiIROREJmMhGRkIhGRkIlIRMZCIjISkYhIZCIiIROREJmMhGRkIhGRkIlIRMZCIjISkYhIZCIiIROREJmMhGRkIhGRkIlIRMZCIjISkYhIZCIiIRORyEbM3Wstcc55G/uaxCRiFjbTUEQisjHm2hKiJWZlIkTMW2t3jrkO+1e0Iu8x45y31mTN22s9xphrPaBm3GbMs9baMebas1pE3mA2Y641IebcW+s9b2+1rAnStjMX2TGW2nNGWwPmxpjrTSQmRCLzRkRkIiEjMhKRiEhEJiIiZCISEZmIhGRkIhKRiEhEJiIiZCISEZmIhGRkIhKRiEhEJiIiZCIikY2Yc26t9Z7T2kBEJvP5v+YfAAAAgK/5A6C0h2u70u8xAAAAAElFTkSuQmCC',
        mediaType: 'Jornal Impressao (Texto)', 
        selected: false 
      },
      { 
        id: 3, name: 'G1', 
        logoUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAhFBMVEX////zgTPzgDDzeCr+9fP74t/+9/X529L+8e730cv63tr+7er86Nz0w7j75N32z8bzeijygy/+8/D749/1w7n41c/yfy70vLLzgjP41tD1yL730s7yhibxdi3639z859v64Nrygy/1x7j20MrzgS71xr7zdijzeCTxgSmqT5+nAAACFUlEQVR4nO3c6W6CQBSF4YxNLCJFWwW1VdGqPf//H3eBFrp1mTMvSXD8b86U88HMWbLZiYiIiIiIiIiIiIiIiIiIiIiIiIj8SUnP/y+HO8nZ5l/J3y/m5iN/vjYnEfn3zPyKROTVZ+Y5I/Lns/NWIvLvq/MJI/LPs/NeI/Lvq/MDIvLPs/NCI/LPs/NuI/Lvq/MeI/LPs/NqI/Lvq/MEIvLPs/NKz8y/n4lE5Lfn5mUi8t+Z+SgR+W9+lYj8J36VyM8y87dE5M9m5nci8h+ZuSUR+U8z8z0i8l8z80si8t/5QiLyW8x8QkR+izcfkR/5zR8Q+Z2/+UFEfsfv/B+R//Mb/ysR+cv/KojIf/O/DhGRf/C/IiIi/zX/6xER+e/+NyIi8mv/exGRf+l/ISIi/+F/ISIi/wb/axGRv/Z/ISKiv/1/IyL6wX8rIvq4/42I6Bv+JyKib/mfiIje9D8REb3ifiIievv/RETMn/4nImL61H9ExPTX/wsRMZ/2PxExk+5/IiImi/9LRMTS/0tExMr/S0TE1v9LRAQAiIiIiIiIiIiIiIiIiIiIiIiI/LeS97vJ3fL/J3/eG5P/NfLvJvPdS+TXzcy7ici/mJlPiMivmJnficivm5mvichfmbkUEfkPzdyLyJ+ZuRSR/zRzLyJ/ZeZSRH4fAAAA4Gz+AM3mU6+L0MvHAAAAAElFTkSuQmCC', 
        mediaType: 'Mídias Web (Texto)', 
        selected: true 
      },
      { 
        id: 4, name: 'TV Globo', 
        logoUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDgiIHN0cm9rZT0iIzE1NUFDRiIgZmlsbD0iI0YwRjBGMyIvPgogIDxyZWN0IHg9IjI1IiB5PSI0MiIgd2lkdGg9IjUwIiBoZWlnaHQ9IjE2IiBmaWxsPSIjRkZGRkZGIi8+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iMjUiIGZpbGw9IiMxNTgzQ0YiLz4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIxMiIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4=', 
        mediaType: 'Televisão (Vídeo)', 
        selected: false 
      },
      { 
        id: 5, name: 'G1', 
        logoUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAhFBMVEX////zgTPzgDDzeCr+9fP74t/+9/X529L+8e730cv63tr+7er86Nz0w7j75N32z8bzeijygy/+8/D749/1w7n41c/yfy70vLLzgjP41tD1yL730s7yhibxdi3639z859v64Nrygy/1x7j20MrzgS71xr7zdijzeCTxgSmqT5+nAAACFUlEQVR4nO3c6W6CQBSF4YxNLCJFWwW1VdGqPf//H3eBFrp1mTMvSXD8b86U88HMWbLZiYiIiIiIiIiIiIiIiIiIiIiIiIj8SUnP/y+HO8nZ5l/J3y/m5iN/vjYnEfn3zPyKROTVZ+Y5I/Lns/NWIvLvq/MJI/LPs/NeI/Lvq/MDIvLPs/NCI/LPs/NuI/Lvq/MeI/LPs/NqI/Lvq/MEIvLPs/NKz8y/n4lE5Lfn5mUi8t+Z+SgR+W9+lYj8J36VyM8y87dE5M9m5nci8h+ZuSUR+U8z8z0i8l8z80si8t/5QiLyW8x8QkR+izcfkR/5zR8Q+Z2/+UFEfsfv/B+R//Mb/ysR+cv/KojIf/O/DhGRf/C/IiIi/zX/6xER+e/+NyIi8mv/exGRf+l/ISIi/+F/ISIi/wb/axGRv/Z/ISKiv/1/IyL6wX8rIvq4/42I6Bv+JyKib/mfiIje9D8REb3ifiIievv/RETMn/4nImL61H9ExPTX/wsRMZ/2PxExk+5/IiImi/9LRMTS/0tExMr/S0TE1v9LRAQAiIiIiIiIiIiIiIiIiIiIiIiI/LeS97vJ3fL/J3/eG5P/NfLvJvPdS+TXzcy7ici/mJlPiMivmJnficivm5mvichfmbkUEfkPzdyLyJ+ZuRSR/zRzLyJ/ZeZSRH4fAAAA4Gz+AM3mU6+L0MvHAAAAAElFTkSuQmCC', 
        mediaType: 'Mídias Web (Texto)', 
        selected: false 
      },
      { 
        id: 6, name: 'G1', 
        logoUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAhFBMVEX////zgTPzgDDzeCr+9fP74t/+9/X529L+8e730cv63tr+7er86Nz0w7j75N32z8bzeijygy/+8/D749/1w7n41c/yfy70vLLzgjP41tD1yL730s7yhibxdi3639z859v64Nrygy/1x7j20MrzgS71xr7zdijzeCTxgSmqT5+nAAACFUlEQVR4nO3c6W6CQBSF4YxNLCJFWwW1VdGqPf//H3eBFrp1mTMvSXD8b86U88HMWbLZiYiIiIiIiIiIiIiIiIiIiIiIiIj8SUnP/y+HO8nZ5l/J3y/m5iN/vjYnEfn3zPyKROTVZ+Y5I/Lns/NWIvLvq/MJI/LPs/NeI/Lvq/MDIvLPs/NCI/LPs/NuI/Lvq/MeI/LPs/NqI/Lvq/MEIvLPs/NKz8y/n4lE5Lfn5mUi8t+Z+SgR+W9+lYj8J36VyM8y87dE5M9m5nci8h+ZuSUR+U8z8z0i8l8z80si8t/5QiLyW8x8QkR+izcfkR/5zR8Q+Z2/+UFEfsfv/B+R//Mb/ysR+cv/KojIf/O/DhGRf/C/IiIi/zX/6xER+e/+NyIi8mv/exGRf+l/ISIi/+F/ISIi/wb/axGRv/Z/ISKiv/1/IyL6wX8rIvq4/42I6Bv+JyKib/mfiIje9D8REb3ifiIievv/RETMn/4nImL61H9ExPTX/wsRMZ/2PxExk+5/IiImi/9LRMTS/0tExMr/S0TE1v9LRAQAiIiIiIiIiIiIiIiIiIiIiIiI/LeS97vJ3fL/J3/eG5P/NfLvJvPdS+TXzcy7ici/mJlPiMivmJnficivm5mvichfmbkUEfkPzdyLyJ+ZuRSR/zRzLyJ/ZeZSRH4fAAAA4Gz+AM3mU6+L0MvHAAAAAElFTkSuQmCC', 
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
    if (!this.searchTerm) {
      return this.vehicles;
    }
    return this.vehicles.filter(vehicle => 
      vehicle.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}