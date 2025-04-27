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
  isSearchOpen: boolean = false;

  @ViewChild('modalWrapper') modalWrapperRef!: ElementRef;
  @ViewChild('highSearchDrawer') highSearchDrawerRef!: ElementRef; // Referência ao HighSearch
  @ViewChild('saveSearchModal') saveSearchModalRef!: ElementRef; // Referência ao modal de save search
  @ViewChild('filtrosContainer') filtrosContainerRef!: ElementRef; // Referência ao container de filtros (mobile)

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadNoticias();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Fechar o modal de conta se clicar fora
    if (this.isModalVisible && this.modalWrapperRef && !this.modalWrapperRef.nativeElement.contains(target)) {
      this.isModalVisible = false;
    }

    // Fechar o HighSearch se clicar fora
    if (this.isSearchOpen && this.highSearchDrawerRef && !this.highSearchDrawerRef.nativeElement.contains(target)) {
      this.closeHighSearch();
    }

    // Fechar o modal de save search se clicar fora
    if (this.modalAberto && this.saveSearchModalRef && !this.saveSearchModalRef.nativeElement.contains(target)) {
      this.fecharModal();
    }

    // Fechar os filtros (mobile) se clicar fora
    if (this.filtrosAbertos && this.filtrosContainerRef && !this.filtrosContainerRef.nativeElement.contains(target)) {
      this.filtrosAbertos = false;
    }

    // Fechar a sidebar mobile se clicar fora
    if (this.isMobile && this.isSidebarOpen && target.closest('.sidebar-mobile') === null) {
      this.isSidebarOpen = false;
    }
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  onUserChange(user: string) {
    this.currentUser = user;
    this.loadNoticias();
  }

  abrirBuscaAvancada() {
    this.isSearchOpen = true; 
  }
  
  closeHighSearch() {
    this.isSearchOpen = false; 
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
          this.aplicarFiltroNoticias();
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
    this.aplicarFiltroNoticias();
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
          ['Vídeo'].includes(noticia.tipo)
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