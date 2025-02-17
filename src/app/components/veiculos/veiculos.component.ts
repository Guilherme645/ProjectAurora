import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-veiculos',
  templateUrl: './veiculos.component.html',
  styleUrls: ['./veiculos.component.css']
})
export class VeiculosComponent implements OnInit {
  vehiclesList: any = {};  // Dados carregados do JSON
  filteredVehicles: string[] = [];  // Lista de veículos filtrados
  selectedVehicles: { [key: string]: boolean } = {};  // Veículos selecionados
  selectedCategory: string = 'texto';  // Categoria padrão
  searchQuery: string = '';  // Texto de busca
  isMobile: boolean = false; // Verifica se está em um dispositivo móvel

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.checkScreenSize();
    }


  @HostListener('window:resize')
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  // Carrega veículos do arquivo JSON

  // Atualiza a categoria selecionada e filtra veículos
  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.filterVehicles();
  }

  // Filtra veículos com base na categoria e no texto de busca
  filterVehicles(): void {
    if (!this.vehiclesList || !this.vehiclesList[this.selectedCategory]) {
      this.filteredVehicles = [];
      return;
    }

    this.filteredVehicles = this.vehiclesList[this.selectedCategory].filter((vehicle: string) =>
      vehicle.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Seleciona ou desmarca todos os veículos na categoria atual
  selectAll(isChecked: boolean): void {
    this.filteredVehicles.forEach(vehicle => {
      this.selectedVehicles[vehicle] = isChecked;
    });
  }

  // Confirma e exibe os veículos selecionados
  submitSelection(): void {
    const selected = Object.keys(this.selectedVehicles).filter(vehicle => this.selectedVehicles[vehicle]);
    console.log('Veículos selecionados:', selected);
  }
}
