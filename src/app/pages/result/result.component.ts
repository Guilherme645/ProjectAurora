import { Component, HostListener, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
    selector: 'app-result',
    templateUrl: './result.component.html',
    styleUrls: ['./result.component.css'],
    standalone: false
})
export class ResultComponent implements OnInit {
  noticias: any[] = []; 
  isMobile: boolean = false;
  isSidebarOpen = true;  
  selectedTab: string = 'todos';
  isDropdownOpen: boolean = false;
  selectedOption: string = 'Mais relevantes';
  filtrosAbertos: boolean = false;
  isScrolled = false;
  currentUser: string = 'Superior Tribunal Federal'; // Usuário padrão
  filteredNoticias: any[] = []; // Notícias filtradas para exibição

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.checkScreenSize();  // Verifica o tamanho da tela ao carregar a página

    this.dataService.getData().subscribe(
      (data) => {
        this.noticias = data.noticias;
      },
      (error) => console.error('Erro ao carregar os dados:', error)
    );
  }  

  // Detecta mudanças no tamanho da tela e ajusta `isMobile`
  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  onUserChange(user: string) {
    console.log('Usuário mudou para:', user);
    this.currentUser = user;
    this.loadNoticias(); // Recarrega as notícias para o novo usuário
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

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  setSelectedTab(tab: string): void {
    this.selectedTab = tab;
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

  // Detecta rolagem e altera estado do cabeçalho
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 100;
  }
  
}
