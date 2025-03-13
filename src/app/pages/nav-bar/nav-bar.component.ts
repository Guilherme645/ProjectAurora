import { Component, HostListener, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css'],
    standalone: false
})
export class NavBarComponent implements OnInit {
  noticias: any[] = [];
  filteredNoticias: any[] = [];
  isMobile: boolean = false;
  isSidebarOpen = true;
  allSelected: boolean = false;
  currentUser: string = 'Superior Tribunal Federal';
  selectedTab: string = 'todos';
  selectedOption: string = 'Mais relevantes';
  isDropdownOpen: boolean = false;
  selectedMentionsCount: number = 0;

  page: number = 1;
  pageSize: number = 10;
  isLoading: boolean = false;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadNoticias();
  }

  @HostListener('window:resize', [])
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= documentHeight - 100 && !this.isLoading) {
      this.loadMoreNoticias();
    }
  }

  setSelectedTab(tab: string) {
    this.selectedTab = tab;
    this.page = 1;
    this.noticias = [];
    this.filteredNoticias = [];
    this.loadNoticias();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  loadNoticias() {
    this.isLoading = true;
    // Pass the currentUser to the data service to fetch user-specific data
    this.dataService.getData(this.page, this.pageSize, this.currentUser).subscribe(
      (data) => {
        console.log('Dados recebidos (página ' + this.page + ', usuário ' + this.currentUser + '):', data);
        if (data && data.noticias) {
          this.noticias = this.noticias.concat(data.noticias);
          this.filterNoticias();
        } else {
          console.warn('Nenhuma notícia encontrada para o usuário:', this.currentUser);
          this.filteredNoticias = []; // Clear if no data
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Erro ao carregar os dados:', error);
        this.isLoading = false;
      }
    );
  }

  loadMoreNoticias() {
    this.page++;
    this.loadNoticias();
  }

  filterNoticias() {
    if (this.selectedTab === 'todos') {
      this.filteredNoticias = this.noticias.filter(noticia => noticia.usuario === this.currentUser);
    } else if (this.selectedTab === 'brutos') {
      this.filteredNoticias = this.noticias.filter(
        noticia => (noticia.tipo === 'Vídeo' || noticia.tipo === 'Áudio') && noticia.usuario === this.currentUser
      );
    } else if (this.selectedTab === 'clippings') {
      this.filteredNoticias = this.noticias.filter(
        noticia => noticia.tipo === 'Texto' && noticia.usuario === this.currentUser
      );
    }
    console.log('Notícias filtradas para ' + this.currentUser + ':', this.filteredNoticias);
  }

  onFilterNews(tab: string) {
    this.selectedTab = tab;
    this.filterNoticias();
  }

  onSelectAll(selectAll: boolean) {
    this.allSelected = selectAll;
    console.log('Seleção de todas as notícias:', this.allSelected);
  }

  onUserChange(user: string) {
    console.log('Usuário mudou para:', user);
    this.currentUser = user;
    this.page = 1;
    this.noticias = [];
    this.filteredNoticias = [];
    this.loadNoticias(); // Fetch new data for the selected user
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.isDropdownOpen = false;
  }

  onSelectionChange(isSelected: boolean) {
    if (isSelected) {
      this.selectedMentionsCount++;
    } else {
      this.selectedMentionsCount--;
    }
  }
}