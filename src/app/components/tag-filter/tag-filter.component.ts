import { HttpClient } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-tag-filter',
  templateUrl: './tag-filter.component.html',
  styleUrls: ['./tag-filter.component.css']
})
export class TagFilterComponent {
  entidades: any = {}; // Dados carregados do JSON
  filteredEntities: any[] = []; // Lista de entidades filtradas
  isMobileModalOpen: boolean = false;
  isMobile: boolean = false;
  selectedCategory: string = 'Data'; // Categoria selecionada
  searchQuery: string = ''; // Texto de busca

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadEntidades();
  }

  // Carrega entidades do arquivo JSON
  loadEntidades(): void {
    this.http.get<any>('assets/data.json').subscribe({
      next: (data) => {
        this.entidades = data.entidades;
        this.filterEntities(); // Filtra entidades ao carregar
      },
      error: (err) => {
        console.error('Erro ao carregar entidades:', err);
      }
    });
  }

  // Atualiza a categoria selecionada e filtra entidades
  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.filterEntities();
  }

  // Filtra entidades com base na categoria selecionada e no texto de busca
  filterEntities(): void {
    if (!this.entidades || !this.entidades[this.selectedCategory]) {
      this.filteredEntities = [];
      return;
    }

    this.filteredEntities = this.entidades[this.selectedCategory].filter((entity: string) =>
      entity.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Detecta redimensionamento de tela para verificar se é mobile
  @HostListener('window:resize')
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 480;
  }

  // Fecha o modal ao pressionar a tecla Escape
  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent): void {
    if (this.isMobileModalOpen) {
      this.closeMobileModal();
    }
  }

  // Abre o modal para dispositivos móveis
  openMobileModal(): void {
    this.isMobileModalOpen = true;
  }

  // Fecha o modal para dispositivos móveis
  closeMobileModal(): void {
    this.isMobileModalOpen = false;
  }
}
