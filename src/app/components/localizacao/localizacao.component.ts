import { HttpClient } from '@angular/common/http';
import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-localizacao',
  templateUrl: './localizacao.component.html',
  styleUrls: ['./localizacao.component.css']
})
export class LocalizacaoComponent implements OnInit {

  vehiclesList: { [key: string]: string[] } = {}; // Dados carregados do JSON
  filteredVehicles: string[] = []; // Lista de veículos filtrados
  selectedVehicles: { [key: string]: boolean } = {}; // Veículos selecionados
  selectedCategory: string = 'texto'; // Categoria padrão
  searchQuery: string = ''; // Texto de busca
  isMobile: boolean = false; // Identifica se está em mobile

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadVehicles();
  }

  // Detecta se está em um dispositivo móvel
  @HostListener('window:resize')
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  // Carrega veículos do arquivo JSON
  loadVehicles(): void {
    this.http.get<{ [key: string]: string[] }>('assets/veiculos.json').subscribe({
      next: (data) => {
        this.vehiclesList = data || {}; // Garante que o objeto seja inicializado
        this.filterVehicles();
      },
      error: (err) => {
        console.error('Erro ao carregar veículos:', err);
      }
    });
  }

  // Atualiza a categoria selecionada e filtra veículos
  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.filterVehicles();
  }

  // Filtra veículos com base na categoria e no texto de busca
  filterVehicles(): void {
    if (!this.vehiclesList[this.selectedCategory]) {
      this.filteredVehicles = [];
      return;
    }

    this.filteredVehicles = this.vehiclesList[this.selectedCategory].filter(vehicle =>
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
    console.log('🚀 Veículos selecionados:', selected);
  }
}
