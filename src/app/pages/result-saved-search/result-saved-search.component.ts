import { Component, HostListener, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-result-saved-search',
  templateUrl: './result-saved-search.component.html',
  styleUrls: ['./result-saved-search.component.css'],
  standalone: false
})
export class ResultSavedSearchComponent implements OnInit {
noticias: any[] = []; 
  isMobile: boolean = false;
  isSidebarOpen: boolean = false;
  selectedTab: string = 'todos';
  isDropdownOpen: boolean = false;
  selectedOption: string = 'Mais relevantes';
  filtrosAbertos: boolean = false;
  isScrolled = false;
  currentUser: string = 'Superior Tribunal Federal'; 
  filteredNoticias: any[] = []; 
  isModalVisible: boolean = false;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.checkScreenSize();  

    this.dataService.getData().subscribe(
      (data) => {
        this.noticias = data.noticias;
      },
      (error) => console.error('Erro ao carregar os dados:', error)
    );
  }  

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
    this.loadNoticias(); 
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

  toggleModal() {
    this.isModalVisible = !this.isModalVisible;
    console.log('Estado do modal:', this.isModalVisible);
  }
  
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 100;
  }
  
}

