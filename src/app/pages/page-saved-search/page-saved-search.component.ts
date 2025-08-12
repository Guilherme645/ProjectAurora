import { Component, OnInit, OnDestroy, Input, ElementRef, ViewChild, HostListener } from '@angular/core';
import { DataService, MonitorCard } from 'src/app/services/data.service';
import { ModalService } from 'src/app/services/modal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-page-saved-search',
  templateUrl: './page-saved-search.component.html',
  styleUrls: ['./page-saved-search.component.css'],
  standalone: false
})
export class PageSavedSearchComponent implements OnInit, OnDestroy {
  noticias: any[] = [];
  filteredNoticias: any[] = [];
  isSidebarOpen: boolean = false;
  allSelected: boolean = false;
  currentUser: string = 'Superior Tribunal Federal';
  selectedTab: string = 'Todas as buscas';
  selectedOption: string = 'Mais relevantes';
  isDropdownOpen: boolean = false;
  selectedMentionsCount: number = 0;
  showScrollTop: boolean = false;
  showScrollTopButton: boolean = false;
  isSearchOpen: boolean = false;
  page: number = 1;
  pageSize: number = 10;
  isLoading: boolean = false;
  hasMoreData: boolean = true;
  errorMessage: string | null = null;
  showDiscardModal: boolean = false;
  modalToClose: 'edit' | 'duplicate' | null = null;
  modalAberto: boolean = false;
  duplicateModalAberto: boolean = false;
  removeModalAberto: boolean = false;
  modalData: any;
  modalContext: 'edit' | 'new' = 'edit';
  @Input() isMobile: boolean = false;
  isModalVisible: boolean = false;

  monitorCards: MonitorCard[] = [];
  filteredMonitorCards: MonitorCard[] = [];

  private subscriptions = new Subscription();

  @ViewChild('modalWrapper') modalWrapperRef!: ElementRef;
  @ViewChild('editModal') editModalRef!: ElementRef;
  @ViewChild('duplicateModal') duplicateModalRef!: ElementRef;
  @ViewChild('removeModal') removeModalRef!: ElementRef;
  @ViewChild('discardModal') discardModalRef!: ElementRef;

  constructor(private modalService: ModalService, private dataService: DataService) {}

  ngOnInit() {
    this.checkIfMobile();
    window.addEventListener('resize', () => this.checkIfMobile());
    this.loadMonitorCards();
    this.subscriptions.add(
      this.modalService.editModalState$.subscribe(state => {
        this.modalAberto = state.open;
        this.modalData = state.data;
      })
    );
    this.subscriptions.add(
      this.modalService.duplicateModalState$.subscribe(state => {
        this.duplicateModalAberto = state.open;
        this.modalData = state.data;
      })
    );
    this.subscriptions.add(
      this.modalService.removeModalState$.subscribe(state => {
        this.removeModalAberto = state.open;
        this.modalData = state.data;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    window.removeEventListener('resize', () => this.checkIfMobile());
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Fechar o modal de conta se clicar fora
    if (this.isModalVisible && this.modalWrapperRef && !this.modalWrapperRef.nativeElement.contains(target)) {
      this.isModalVisible = false;
    }

    // Fechar o modal de edição se clicar fora
    if (this.modalAberto && this.editModalRef && !this.editModalRef.nativeElement.contains(target)) {
      this.closeEditModal();
    }

    // Fechar o modal de duplicação se clicar fora
    if (this.duplicateModalAberto && this.duplicateModalRef && !this.duplicateModalRef.nativeElement.contains(target)) {
      this.closeDuplicateModal();
    }

    // Fechar o modal de remoção se clicar fora
    if (this.removeModalAberto && this.removeModalRef && !this.removeModalRef.nativeElement.contains(target)) {
      this.modalService.closeRemoveModal();
    }

    // Fechar o modal de descarte se clicar fora
    if (this.showDiscardModal && this.discardModalRef && !this.discardModalRef.nativeElement.contains(target)) {
      this.onCancelDiscard();
    }

    // Fechar a sidebar mobile se clicar fora
    if (this.isMobile && this.isSidebarOpen && target.closest('.sidebar-mobile') === null) {
      this.isSidebarOpen = false;
    }
  }

  closeHighSearch(): void {
    this.isSearchOpen = false;
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth <= 640;
    console.log('PageSavedSearchComponent - isMobile:', this.isMobile);
  }

  toggleModal() {
    this.isModalVisible = !this.isModalVisible;
    console.log('Estado do modal:', this.isModalVisible);
  }

  loadMonitorCards() {
    this.isLoading = true;
    this.errorMessage = null;
    this.subscriptions.add(
      this.dataService.getMonitorCards().subscribe({
        next: (data) => {
          this.monitorCards = data;
          this.filterMonitorCardsByTab();
          console.log('filteredMonitorCards:', this.filteredMonitorCards);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar monitorCards:', error);
          this.errorMessage = 'Falha ao carregar os dados. Tente novamente mais tarde.';
          this.isLoading = false;
        }
      })
    );
  }

  onUserChange(user: string) {
    this.currentUser = user;
  }

  setActiveTab(tab: string) {
    console.log('setActiveTab:', tab);
    switch (tab) {
      case 'todas':
        this.selectedTab = 'Todas as buscas';
        break;
      case 'ativas':
        this.selectedTab = 'Ativas';
        break;
      case 'pendentes':
        this.selectedTab = 'Pendentes';
        break;
      default:
        this.selectedTab = 'Todas as buscas';
    }
    this.filterMonitorCardsByTab();
  }

  filterMonitorCardsByTab() {
    console.log('filterMonitorCardsByTab - selectedTab:', this.selectedTab);
    if (this.selectedTab === 'Todas as buscas') {
      this.filteredMonitorCards = [...this.monitorCards];
    } else if (this.selectedTab === 'Ativas') {
      this.filteredMonitorCards = this.monitorCards.filter(card => card.status.toLowerCase() === 'ativa');
    } else if (this.selectedTab === 'Pendentes') {
      this.filteredMonitorCards = this.monitorCards.filter(card => card.status.toLowerCase() === 'pendente');
    }
    console.log('filteredMonitorCards após filtro:', this.filteredMonitorCards);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    console.log('toggleSidebar - isSidebarOpen:', this.isSidebarOpen);
  }

  confirmDiscard() {
    if (this.modalToClose === 'edit') {
      this.modalService.closeEditModal();
    } else if (this.modalToClose === 'duplicate') {
      this.modalService.closeDuplicateModal();
    }
    this.showDiscardModal = false;
    this.modalToClose = null;
  }

  cancelDiscard() {
    this.showDiscardModal = false;
    this.modalToClose = null;
  }

  saveEdits() {
    console.log('Edições salvas pelo componente pai!', this.modalData);
    this.modalService.closeEditModal();
    this.modalService.closeDuplicateModal();
    this.loadMonitorCards();
  }

  onCancelRemove() {
    this.modalService.closeRemoveModal();
  }

  onConfirmRemove() {
    console.log('Busca removida!', this.modalData);
    this.modalService.closeRemoveModal();
    this.loadMonitorCards();
  }

  onSearchChange(query: string) {
    console.log('onSearchChange:', query);
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) {
      this.filterMonitorCardsByTab();
    } else {
      this.filteredMonitorCards = this.monitorCards.filter(card =>
        (card.title.toLowerCase().includes(searchTerm) ||
         card.startDate.toLowerCase().includes(searchTerm) ||
         card.endDate.toLowerCase().includes(searchTerm) ||
         card.status.toLowerCase().includes(searchTerm)) &&
        (this.selectedTab === 'Todas as buscas' ||
         (this.selectedTab === 'Ativas' && card.status.toLowerCase() === 'ativa') ||
         (this.selectedTab === 'Pendentes' && card.status.toLowerCase() === 'pendente'))
      );
    }
    console.log('filteredMonitorCards após busca:', this.filteredMonitorCards);
  }

  closeEditModal() {
    this.modalContext = 'edit';
    this.modalToClose = 'edit';
    this.showDiscardModal = true;
  }

  closeDuplicateModal() {
    this.modalContext = 'new';
    this.modalToClose = 'duplicate';
    this.showDiscardModal = true;
  }

  onCancelDiscard() {
    this.showDiscardModal = false;
    this.modalToClose = null;
  }

onConfirmDiscard() {
  this.showDiscardModal = false;

  // Fecha explicitamente todos os modais
  this.modalService.closeEditModal();
  this.modalService.closeDuplicateModal();
  this.modalService.closeRemoveModal(); // Se houver um modal de remoção
  
  // Limpa a variável de controle
  this.modalToClose = null; 
}
}