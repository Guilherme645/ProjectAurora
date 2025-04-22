import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-veiculos',
  templateUrl: './veiculos.component.html',
  styleUrls: ['./veiculos.component.css'],
  standalone: false,
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
        this.updateSelectAll();
      },
      error: (err) => console.error('Erro ao carregar veículos:', err),
    });
  }

  selectCategory(categoria: string): void {
    this.selectedCategory = categoria;
    this.updateSelectAll();
  }

  getFilteredVehicles(): { nome: string; selecionado: boolean }[] {
    const allVehicles = this.vehicles[this.selectedCategory] || [];
    return allVehicles.filter((veiculo) =>
      veiculo.nome.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  toggleSelectAll(): void {
    const filteredVehicles = this.getFilteredVehicles();
    filteredVehicles.forEach((v) => (v.selecionado = this.selectAll));
  }

  updateSelectAll(): void {
    const filteredVehicles = this.getFilteredVehicles();
    this.selectAll =
      filteredVehicles.length > 0 && filteredVehicles.every((v) => v.selecionado);
  }

  getCategoryTitle(): string {
    if (this.selectedCategory === 'Texto') {
      return 'Texto (Jornais impressos e Web)';
    } else if (this.selectedCategory === 'Áudio') {
      return 'Áudio (Rádio)';
    } else if (this.selectedCategory === 'Vídeo') {
      return 'Vídeo (Canais de televisão)';
    }
    return this.selectedCategory;
  }
  

  closeModal(): void {
    this.isModalOpen = false;
    this.closeSection.emit(); // emite pro pai
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    if (this.isModalOpen) {
      this.closeModal(); // função que já emite o closeSection
    }
  }
}