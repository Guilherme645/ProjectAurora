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
  selectedCategory: string = 'Texto'; 
  searchQuery: string = ''; 
  vehicles: { [key: string]: { nome: string; selecionado: boolean }[] } = {}; 
  categorias: string[] = ['Texto', 'Vídeo', 'Áudio']; 
  selectAll: boolean = false; 
  @Output() closeSection = new EventEmitter<void>();

  constructor(private dataservice: DataService) {}

  ngOnInit(): void {
    this.loadVeiculos();
  }

  loadVeiculos(): void {
    this.dataservice.getVeiculos().subscribe({
      next: (data) => {
        this.vehicles = data;
      },
      error: (err) => console.error('Erro ao carregar veículos:', err)
    });
  }

  selectCategory(categoria: string): void {
    this.selectedCategory = categoria;
  }

  getFilteredVehicles(): { nome: string; selecionado: boolean }[] {
    const allVehicles = this.vehicles[this.selectedCategory] || [];
    return allVehicles.filter(veiculo =>
      veiculo.nome.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  toggleSelectAll(): void {
    const vehicles = this.vehicles[this.selectedCategory];
    if (vehicles) {
      vehicles.forEach(v => v.selecionado = this.selectAll);
    }
  }

  updateSelectAll(): void {
    const vehicles = this.getFilteredVehicles();
    this.selectAll = vehicles.length > 0 && vehicles.every(v => v.selecionado);
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.closeSection.emit();
  }
}
