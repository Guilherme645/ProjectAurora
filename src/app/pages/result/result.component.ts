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
  selectAll: boolean = false;
  selectedMentionsCount: number = 0;
  allSelected: boolean = false;

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


  onSelectionChange(selected: boolean): void {
    if (selected) {
      this.selectedMentionsCount++;
    } else {
      this.selectedMentionsCount--;
    }
  }

  
  loadNoticias() {
    this.dataService.getData().subscribe(
      (data) => {
        if (data && data.noticias) {
          this.noticias = data.noticias;
          this.aplicarFiltroNoticias(); // <-- Já aplica o filtro baseado no usuário atual
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

  onSelectAll(selected: boolean): void {
    this.selectAll = selected;
  }
  
  onFilterNews(tab: string): void {
    this.selectedTab = tab;
    this.aplicarFiltroNoticias(); // <-- Atualiza os cards
  }
  
  aplicarFiltroNoticias(): void {
    if (this.selectedTab === 'todos') {
      this.filteredNoticias = this.noticias.filter(
        noticia => noticia.usuario === this.currentUser
      );
    } else if (this.selectedTab === 'brutos') {
      this.filteredNoticias = this.noticias.filter(
        noticia =>
          noticia.usuario === this.currentUser &&
          ['Vídeo', ].includes(noticia.tipo) // ← CORRIGIDO AQUI
      );
    } else if (this.selectedTab === 'clippings') {
      this.filteredNoticias = this.noticias.filter(
        noticia =>
          noticia.usuario === this.currentUser &&
          noticia.tipo === 'Áudio'
      );
    }
  }
  
  
}