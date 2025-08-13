import { Component, HostListener, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  templateUrl:'./result-saved-search.component.html',
  styleUrls: ['./result-saved-search.component.css'],
  standalone: false
})
export class ResultSavedSearchComponent implements OnInit {
  noticias: Noticia[] = [];
  filteredNoticias: Noticia[] = [];
  isMobile: boolean = false;
  isSidebarOpen: boolean = false;
  isSearchOpen: boolean = false;
  selectedTab: string = 'todos';
  isDropdownOpen: boolean = false;
    allSelected: boolean = false;

  selectedOption: string = 'Mais relevantes';
  filtrosAbertos: boolean = false;
  isScrolled: boolean = false;
  isModalVisible: boolean = false;
  currentUser: string = 'Superior Tribunal Federal';
  searchQuery: string = '';
  selectAll: boolean = false;
  selectedMentionsCount: number = 0;

  @ViewChild('modalWrapper') modalWrapperRef!: ElementRef;

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadNoticias();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 100;
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile && this.isSidebarOpen) {
      this.isSidebarOpen = false;
    }
  }

  loadNoticias(): void {
    this.dataService.getData().subscribe({
      next: (data) => {
        console.log('Dados recebidos:', data);
        this.noticias = (data?.noticias || []).map((noticia: Noticia) => ({
          ...noticia,
          selected: noticia.selected ?? false
        }));
        this.aplicarFiltroNoticias();
      },
      error: (error) => {
        console.error('Erro ao carregar os dados:', error);
        this.noticias = [];
        this.filteredNoticias = [];
      }
    });
  }

  onUserChange(user: string): void {
    console.log('Usuário mudou para:', user);
    this.currentUser = user;
    this.loadNoticias();
  }

  onSearchChange(query: string): void {
    this.searchQuery = query.trim();
    this.aplicarFiltroNoticias();
  }

  onSelectionChange(event: { noticia: any, isSelected: boolean }) {
    const item = this.noticias.find(n => n.id === event.noticia.id);
    if (item) {
      item.selected = event.isSelected;
    }
    // Recalcula a contagem total
    this.selectedMentionsCount = this.noticias.filter(n => n.selected).length;
    
    // Sincroniza o checkbox "Selecionar Todos"
    this.allSelected = this.selectedMentionsCount === this.noticias.length;
  }
  onSelectAll(selected: boolean): void {
    this.selectAll = selected;
    this.filteredNoticias.forEach(noticia => noticia.selected = selected);
  }

  onFilterNews(tab: string): void {
    this.selectedTab = tab;
    this.aplicarFiltroNoticias();
  }

  aplicarFiltroNoticias(): void {
    let filtered = this.noticias.filter(noticia => noticia.usuario === this.currentUser);

    // Filtra por termo de busca (mantém marcação de entidades)
    if (this.searchQuery) {
      const queryLower = this.searchQuery.toLowerCase();
      filtered = filtered.filter(noticia =>
        (noticia.titulo?.toLowerCase() || '').includes(queryLower) ||
        (noticia.descricao?.toLowerCase() || '').includes(queryLower)
      );
    }

    // Filtra por aba
    if (this.selectedTab === 'todos') {
      this.filteredNoticias = filtered;
    } else if (this.selectedTab === 'brutos') {
      this.filteredNoticias = filtered.filter(
        noticia => noticia.tipo && ['Vídeo'].includes(noticia.tipo)
      );
    } else if (this.selectedTab === 'clippings') {
      this.filteredNoticias = filtered.filter(
        noticia => noticia.tipo && noticia.tipo === 'Áudio'
      );
    }

    // Garante a propriedade selected
    this.filteredNoticias = this.filteredNoticias.map(noticia => ({
      ...noticia,
      selected: noticia.selected ?? this.selectAll
    }));

    console.log('Notícias filtradas para', this.currentUser, 'na aba', this.selectedTab, ':', this.filteredNoticias);
    if (this.filteredNoticias.length === 0) {
      console.warn(`Nenhuma notícia encontrada para ${this.currentUser} na aba ${this.selectedTab}`);
    }
  }

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