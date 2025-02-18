import { Component, HostListener, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  noticias: any[] = []; // Todas as notícias
  filteredNoticias: any[] = []; // Notícias filtradas para exibição
  isMobile: boolean = false;
  isSidebarOpen = true;
  allSelected: boolean = false;
  currentUser: string = 'Superior Tribunal Federal'; // Usuário padrão
selectedTab: string = 'todos';

  selectedOption: string = 'Mais relevantes';
  isDropdownOpen: boolean = false;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadNoticias(); // Carregar as notícias ao inicializar
  }

  @HostListener('window:resize', [])
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }
  setSelectedTab(tab: string) {
    this.selectedTab = tab;
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  loadNoticias() {
    this.dataService.getData().subscribe(
      (data) => {
        console.log('Dados recebidos:', data);
        if (data && data.noticias) {
          this.noticias = data.noticias;
          console.log('Todas as notícias:', this.noticias);
          
          this.filteredNoticias = this.noticias.filter(
            noticia => noticia.usuario === this.currentUser
          );
  
          if (this.filteredNoticias.length === 0) {
            console.warn(`Nenhuma notícia encontrada para ${this.currentUser}`);
          }
  
          console.log('Notícias filtradas para', this.currentUser, ':', this.filteredNoticias);
        } else {
          console.warn('Nenhuma notícia encontrada');
        }
      },
      (error) => console.error('Erro ao carregar os dados:', error)
    );
  }
  
  
  onFilterNews(tab: string) {
    console.log('Filtro selecionado:', tab);
    if (tab === 'todos') {
      this.filteredNoticias = this.noticias.filter(
        noticia => noticia.usuario === this.currentUser
      );
    } else if (tab === 'brutos') {
      this.filteredNoticias = this.noticias.filter(
        noticia => (noticia.tipo === 'Vídeo' || noticia.tipo === 'Áudio') && noticia.usuario === this.currentUser
      );
    } else if (tab === 'tratados') {
      this.filteredNoticias = this.noticias.filter(
        noticia => noticia.tipo === 'Texto' && noticia.usuario === this.currentUser
      );
    }
    console.log('Notícias filtradas:', this.filteredNoticias);
  }
  
  onSelectAll(selectAll: boolean) {
    this.allSelected = selectAll;
    console.log('Seleção de todas as notícias:', this.allSelected);
  }
  
  onUserChange(user: string) {
    console.log('Usuário mudou para:', user);
    this.currentUser = user;
    this.loadNoticias(); // Recarrega as notícias para o novo usuário
  }
 
  


  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
    // Seleciona uma opção de ordenação
    selectOption(option: string) {
      this.selectedOption = option;
      this.isDropdownOpen = false;
    }
  
}
