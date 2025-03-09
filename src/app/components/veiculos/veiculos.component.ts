import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
    selector: 'app-veiculos',
    templateUrl: './veiculos.component.html',
    styleUrls: ['./veiculos.component.css'],
    standalone: false
})
export class VeiculosComponent implements OnInit {
  isMobile: boolean = window.innerWidth <= 768;
  isModalOpen: boolean = true;
  selectedCategory: string = 'Texto'; // Categoria inicial selecionada
  searchQuery: string = ''; // Campo de busca
  vehicles: { [key: string]: { nome: string; selecionado: boolean }[] } = {}; // JSON de veículos
  categorias: string[] = ['Texto', 'Vídeo', 'Áudio']; // Categorias fixas
  selectAll: boolean = false; // Controle de seleção

  @Output() closeSection = new EventEmitter<void>();

  constructor(private dataservice: DataService) {}

  ngOnInit(): void {
    this.loadVeiculos();
  }

  /** 🔹 Carrega os veículos do JSON */
  loadVeiculos(): void {
    this.dataservice.getVeiculos().subscribe({
      next: (data) => {
        this.vehicles = data;
      },
      error: (err) => console.error('Erro ao carregar veículos:', err)
    });
  }

  /** 🔹 Atualiza a categoria selecionada */
  selectCategory(categoria: string): void {
    this.selectedCategory = categoria;
  }

  /** 🔹 Obtém veículos filtrados da categoria selecionada */
  getFilteredVehicles(): { nome: string; selecionado: boolean }[] {
    const allVehicles = this.vehicles[this.selectedCategory] || [];
    return allVehicles.filter(veiculo =>
      veiculo.nome.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  /** 🔹 Alterna a seleção de todos os veículos da categoria */
  toggleSelectAll(): void {
    const vehicles = this.vehicles[this.selectedCategory];
    if (vehicles) {
      vehicles.forEach(v => v.selecionado = this.selectAll);
    }
  }

  /** 🔹 Atualiza o estado do checkbox "Selecionar todos" */
  updateSelectAll(): void {
    const vehicles = this.getFilteredVehicles();
    this.selectAll = vehicles.length > 0 && vehicles.every(v => v.selecionado);
  }

  /** 🔹 Fecha o modal */
  closeModal(): void {
    this.isModalOpen = false;
    this.closeSection.emit();
  }
}
