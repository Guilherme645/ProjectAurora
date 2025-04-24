import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

// Interface para tipagem das notícias
interface Noticia {
  id: string;
  titulo: string;
  descricao: string;
  usuario: string;
  isBruto?: boolean;
  isClipping?: boolean;
  veiculo?: string;
  tipo?: string;
  local?: string;
  data?: string;
  sentimento?: string;
  entidades?: string[];
  logo?: string;
  selected?: boolean;
}

@Component({
  selector: 'app-result-saved-search',
  templateUrl: './result-saved-search.component.html',
  styleUrls: ['./result-saved-search.component.css'],
  standalone: false
})
export class ResultSavedSearchComponent implements OnInit {
  // Estado das notícias
  noticias: Noticia[] = [];
  filteredNoticias: Noticia[] = [];

  // Estado da interface
  isMobile: boolean = false;
  isSidebarOpen: boolean = false;
  isSearchOpen: boolean = false;
  selectedTab: string = 'todos';
  isDropdownOpen: boolean = false;
  selectedOption: string = 'Mais relevantes';
  filtrosAbertos: boolean = false;
  isScrolled: boolean = false;
  isModalVisible: boolean = false;

  // Estado de filtros e seleção
  currentUser: string = 'Superior Tribunal Federal';
  searchQuery: string = '';
  allSelected: boolean = false;

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  // Inicialização
  ngOnInit(): void {
    this.checkScreenSize();
    this.loadNoticias();
  }

  // Listeners de eventos da janela
  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 100;
  }

  // Verifica o tamanho da tela
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile && this.isSidebarOpen) {
      this.isSidebarOpen = false; // Fecha a sidebar no desktop
    }
  }

  // Carrega as notícias do serviço
  loadNoticias(): void {
    this.dataService.getData().subscribe({
      next: (data) => {
        console.log('Dados recebidos:', data);
        this.noticias = (data?.noticias || []).map((noticia: Noticia) => ({
          ...noticia,
          selected: noticia.selected ?? false
        }));
        this.applyFilters();
      },
      error: (error) => {
        console.error('Erro ao carregar os dados:', error);
        this.noticias = [];
        this.filteredNoticias = [];
      }
    });
  }

  // Manipulação de eventos
  onUserChange(user: string): void {
    console.log('Usuário mudou para:', user);
    this.currentUser = user;
    this.loadNoticias();
  }

  onSearchChange(query: string): void {
    this.searchQuery = query.trim();
    this.applyFilters();
  }

  onTabChange(tab: string): void {
    this.setSelectedTab(tab);
  }

  onAllSelectedChange(allSelected: boolean): void {
    this.allSelected = allSelected;
    this.filteredNoticias.forEach(noticia => noticia.selected = allSelected);
  }

  // Configura a aba selecionada e atualiza filtros
  setSelectedTab(tab: string): void {
    this.selectedTab = tab;
    this.applyFilters();
    // Removida a lógica de marcar/desmarcar automaticamente
    // this.allSelected = tab === 'todos';
    // this.filteredNoticias.forEach(noticia => noticia.selected = this.allSelected);
  }

  // Aplica filtros com base em usuário, busca e aba
  applyFilters(): void {
    let filtered = this.noticias.filter(noticia => noticia.usuario === this.currentUser);

    // Filtra por termo de busca
    if (this.searchQuery) {
      const queryLower = this.searchQuery.toLowerCase();
      filtered = filtered.filter(noticia =>
        (noticia.titulo?.toLowerCase() || '').includes(queryLower) ||
        (noticia.descricao?.toLowerCase() || '').includes(queryLower)
      );
    }

    // Filtra por aba
    switch (this.selectedTab) {
      case 'todos':
        this.filteredNoticias = filtered;
        break;
      case 'brutos':
        this.filteredNoticias = filtered.filter(noticia => noticia.isBruto === true);
        break;
      case 'clippings':
        this.filteredNoticias = filtered.filter(noticia => noticia.isClipping === true);
        break;
      default:
        this.filteredNoticias = filtered;
    }

    // Garante a propriedade selected
    this.filteredNoticias = this.filteredNoticias.map(noticia => ({
      ...noticia,
      selected: noticia.selected ?? this.allSelected
    }));

    console.log('Notícias filtradas para', this.currentUser, 'na aba', this.selectedTab, ':', this.filteredNoticias);
    if (this.filteredNoticias.length === 0) {
      console.warn(`Nenhuma notícia encontrada para ${this.currentUser} na aba ${this.selectedTab}`);
    }
  }

  // Ações da interface
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option: string): void {
    this.selectedOption = option;
    this.isDropdownOpen = false;
  }

  toggleFiltros(): void {
    this.filtrosAbertos = !this.filtrosAbertos;
  }

  toggleModal(): void {
    this.isModalVisible = !this.isModalVisible;
    console.log('Estado do modal:', this.isModalVisible);
  }

  goBack(): void {
    this.router.navigate(['..']);
  }

  openSearch(): void {
    this.isSearchOpen = true;
  }

  closeSearch(): void {
    this.isSearchOpen = false;
  }
}