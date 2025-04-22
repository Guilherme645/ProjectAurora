import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService, MonitorCard } from 'src/app/services/data.service'; // Import MonitorCard interface
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
  isSearchOpen = false;
  page: number = 1;
  pageSize: number = 10;
  isLoading: boolean = false;
  hasMoreData: boolean = true;
  errorMessage: string | null = null;
  showDiscardModal = false;
  modalToClose: 'edit' | 'duplicate' | null = null;
  modalAberto: boolean = false;
  duplicateModalAberto: boolean = false;
  removeModalAberto: boolean = false;
  modalData: any;
  modalContext: 'edit' | 'new' = 'edit';

  monitorCards: MonitorCard[] = [];
  filteredMonitorCards: MonitorCard[] = [];

  private subscriptions = new Subscription();

  constructor(private modalService: ModalService, private dataService: DataService) {}

  ngOnInit() {
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
  }

  loadMonitorCards() {
    this.isLoading = true;
    this.errorMessage = null;
    this.subscriptions.add(
      this.dataService.getMonitorCards().subscribe({
        next: (data) => {
          this.monitorCards = data;
          this.filteredMonitorCards = [...this.monitorCards];
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
    // Add logic if user change affects monitorCards
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
    this.loadMonitorCards(); // Refresh data after saving edits
  }

  onCancelRemove() {
    this.modalService.closeRemoveModal();
  }

  onConfirmRemove() {
    console.log('Busca removida!', this.modalData);
    this.modalService.closeRemoveModal();
    this.loadMonitorCards(); // Refresh data after removal
  }

  

  onSearchChange(query: string) {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) {
      this.filteredMonitorCards = [...this.monitorCards];
    } else {
      this.filteredMonitorCards = this.monitorCards.filter(card =>
        card.title.toLowerCase().includes(searchTerm) ||
        card.startDate.toLowerCase().includes(searchTerm) ||
        card.endDate.toLowerCase().includes(searchTerm) ||
        card.status.toLowerCase().includes(searchTerm)
      );
    }
  }


  closeEditModal() {
    this.modalContext = 'edit';
    this.showDiscardModal = true;
  }
  
  closeDuplicateModal() {
    this.modalContext = 'new';
    this.showDiscardModal = true;
  }
  
  onCancelDiscard() {
    this.showDiscardModal = false;
  }
  
  onConfirmDiscard() {
    this.showDiscardModal = false;
    this.modalService.closeEditModal();
    this.modalService.closeDuplicateModal();
  }
}