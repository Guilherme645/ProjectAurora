import { Component, ElementRef, HostListener, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
  standalone: false
})
export class ResultComponent implements OnInit, AfterViewInit, OnDestroy {
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
  @ViewChild('highSearchDrawer') highSearchDrawerRef!: ElementRef;
  @ViewChild('saveSearchModal', { static: false }) saveSearchModalRef!: ElementRef;
  @ViewChild('filtrosContainer') filtrosContainerRef!: ElementRef;
  @ViewChild('editModal') editModalRef!: ElementRef;
  @ViewChild('closeButton') closeButtonRef!: ElementRef; // Referência ao app-botaox

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadNoticias();
  }

  ngAfterViewInit(): void {
    this.updateCloseButtonPosition();
    this.startPositionUpdateInterval(); // Inicia intervalo para atualizar posição
  }

  ngOnDestroy(): void {
    this.stopPositionUpdateInterval(); // Para o intervalo ao destruir o componente
  }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  onResizeOrScroll(): void {
    this.updateCloseButtonPosition();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (this.isModalVisible && this.modalWrapperRef && !this.modalWrapperRef.nativeElement.contains(target)) {
      this.isModalVisible = false;
    }

    if (this.isSearchOpen && this.highSearchDrawerRef && !this.highSearchDrawerRef.nativeElement.contains(target)) {
      this.closeHighSearch();
    }

    if (this.modalAberto && this.saveSearchModalRef) {
      const clickedOutside = !this.saveSearchModalRef.nativeElement.contains(target);
      if (clickedOutside) {
        this.fecharModal();
      }
    }

    if (this.modalAberto && this.editModalRef && !this.editModalRef.nativeElement.contains(target)) {
      this.closeEditModal();
    }

    if (this.filtrosAbertos && this.filtrosContainerRef && !this.filtrosContainerRef.nativeElement.contains(target)) {
      this.filtrosAbertos = false;
    }

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
    setTimeout(() => this.updateCloseButtonPosition(), 0); // Atualiza após abrir o modal
  }

  fecharModal() {
    this.modalAberto = false;
  }

  closeEditModal() {
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

  private updateCloseButtonPosition(): void {
    if (this.modalAberto && this.saveSearchModalRef && this.closeButtonRef) {
      const modalRect = this.saveSearchModalRef.nativeElement.getBoundingClientRect();
      const buttonEl = this.closeButtonRef.nativeElement.querySelector('.close-button-container');

      if (buttonEl) {
        buttonEl.style.position = 'absolute';
        buttonEl.style.top = `${modalRect.top + 16}px`; // 16px de padding do header
        buttonEl.style.right = `${window.innerWidth - (modalRect.right - 16)}px`; // 16px de margem interna
        buttonEl.style.zIndex = '2000';
      }
    }
  }

  private positionUpdateInterval: any;
  private startPositionUpdateInterval(): void {
    this.positionUpdateInterval = setInterval(() => this.updateCloseButtonPosition(), 100); // Atualiza a cada 100ms
  }

  private stopPositionUpdateInterval(): void {
    if (this.positionUpdateInterval) {
      clearInterval(this.positionUpdateInterval);
    }
  }
}