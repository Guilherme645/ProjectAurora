// nav-bar.component.ts
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
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
  isSidebarOpen: boolean = false;
  allSelected: boolean = false;
  currentUser: string = 'Superior Tribunal Federal';
  selectedTab: string = 'todos';
  selectedOption: string = 'Mais relevantes';
  isDropdownOpen: boolean = false;
  selectedMentionsCount: number = 0;
  showScrollTop: boolean = false;
  showScrollTopButton: boolean = false;
  isSearchOpen: boolean = false;
  isBuscaOpen: boolean = false;
  page: number = 1;
  pageSize: number = 10;
  isLoading: boolean = false;
  hasMoreData: boolean = true;
  isModalVisible: boolean = false;
  modalAberto = false;

  // Referências dos elementos
  @ViewChild('modalWrapper') modalWrapperRef!: ElementRef;
  @ViewChild('searchDrawer') searchDrawerRef!: ElementRef;
  @ViewChild('relatorioModal') relatorioModalRef!: ElementRef;
  @ViewChild('searchModal') searchModal!: ElementRef;

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
    this.showScrollTopButton = scrollPosition > 500;
    if (scrollPosition >= documentHeight - 100 && !this.isLoading) {
      this.loadMoreNoticias();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
  
    if (this.isModalVisible && this.modalWrapperRef && !this.modalWrapperRef.nativeElement.contains(target)) {
      this.isModalVisible = false;
    }
  
    if (this.isSearchOpen && this.searchDrawerRef && !this.searchDrawerRef.nativeElement.contains(target)) {
      this.isSearchOpen = false;
    }
  
    if (this.modalAberto && this.relatorioModalRef && !this.relatorioModalRef.nativeElement.contains(target)) {
      this.modalAberto = false;
    }
  
    if (this.isBuscaOpen && this.searchModal && !this.searchModal.nativeElement.contains(target)) {
      this.isBuscaOpen = false;
    }
  }
  

  setSelectedTab(tab: string) {
    this.selectedTab = tab;
    this.page = 1;
    this.noticias = [];
    this.filteredNoticias = [];
    this.hasMoreData = true;
    this.loadNoticias();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  loadNoticias() {
    if (!this.hasMoreData) return;

    this.isLoading = true;
    this.dataService.getData(this.page, this.pageSize, this.currentUser).subscribe(
      (data) => {
        console.log('Dados recebidos (página ' + this.page + ', usuário ' + this.currentUser + '):', data);
        if (data && data.noticias && data.noticias.length > 0) {
          this.noticias = this.noticias.concat(data.noticias);
          this.filterNoticias();
          this.hasMoreData = data.noticias.length === this.pageSize;
        } else {
          console.warn('Nenhuma notícia encontrada para o usuário:', this.currentUser);
          this.hasMoreData = false;
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Erro ao carregar os dados:', error);
        this.isLoading = false;
        this.hasMoreData = false;
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
  }

  onSidebarToggle(isOpen: boolean) {
    this.isSidebarOpen = isOpen;
  }

  onFilterNews(tab: string) {
    this.selectedTab = tab;
    this.filterNoticias();
  }

  onSelectAll(selectAll: boolean) {
    this.allSelected = selectAll;
  }

  onUserChange(user: string) {
    this.currentUser = user;
    this.page = 1;
    this.noticias = [];
    this.filteredNoticias = [];
    this.hasMoreData = true;
    this.loadNoticias();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.isDropdownOpen = false;
  }

  onSelectionChange(event: any) {
    if (event.isSelected) {
      this.selectedMentionsCount++;
    } else {
      this.selectedMentionsCount--;
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleSearch(): void {
    console.log('Toggle search chamado. isSearchOpen antes:', this.isSearchOpen);
    this.isSearchOpen = !this.isSearchOpen;
    console.log('isSearchOpen depois:', this.isSearchOpen);
  }

  openBusca(): void {
    console.log('Abrindo busca. isBuscaOpen antes:', this.isBuscaOpen);
    this.isBuscaOpen = true;
    console.log('isBuscaOpen depois:', this.isBuscaOpen);
  }

  closeHighSearch(): void {
    this.isSearchOpen = false;
  }

  closeBusca(): void {
    this.isBuscaOpen = false;
  }

  toggleModal() {
    this.isModalVisible = !this.isModalVisible;
    console.log('Estado do modal:', this.isModalVisible);
  }
}
