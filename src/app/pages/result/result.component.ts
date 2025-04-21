import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
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
  isSidebarOpen: boolean = false;
  selectedTab: string = 'todos';
  isDropdownOpen: boolean = false;
  selectedOption: string = 'Mais relevantes';
  filtrosAbertos: boolean = false;
  isScrolled = false;
  currentUser: string = 'Superior Tribunal Federal';
  filteredNoticias: any[] = [];
  isModalVisible: boolean = false;
  modalAberto = false;

  @ViewChild('modalWrapper') modalWrapperRef!: ElementRef;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadNoticias();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  onUserChange(user: string) {
    this.currentUser = user;
    this.loadNoticias();
  }

  loadNoticias() {
    this.dataService.getData().subscribe(
      (data) => {
        if (data && data.noticias) {
          this.noticias = data.noticias;
          this.filteredNoticias = this.noticias.filter(
            noticia => noticia.usuario === this.currentUser
          );
          if (this.filteredNoticias.length === 0) {
            console.warn(`Nenhuma notícia encontrada para ${this.currentUser}`);
          }
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
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 100;
  }

  abrirModal() {
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
  }
}