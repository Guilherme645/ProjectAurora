// page-saved-search.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
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

  modalAberto: boolean = false;
  duplicateModalAberto: boolean = false;
  removeModalAberto: boolean = false;
  modalData: any;

  private subscriptions = new Subscription();

  monitorCards = [
    {
      title: 'Executivo',
      startDate: '30/03/2024',
      endDate: '01/04/2024',
      status: 'Ativa'
    },
    {
      title: 'Executivo',
      startDate: '30/03/2024',
      endDate: '01/04/2024',
      status: 'Pendente'
    },
    {
      title: 'Entidades relevantes',
      startDate: '25/03/2024',
      endDate: '29/03/2024',
      status: 'Desativada'
    },
    {
      title: 'Executivo',
      startDate: '30/03/2024',
      endDate: '01/04/2024',
      status: 'Ativa'
    },
    {
      title: 'Executivo',
      startDate: '30/03/2024',
      endDate: '01/04/2024',
      status: 'Pendente'
    },
    {
      title: 'Entidades relevantes',
      startDate: '25/03/2024',
      endDate: '29/03/2024',
      status: 'Desativada'
    },
    {
      title: 'Executivo',
      startDate: '30/03/2024',
      endDate: '01/04/2024',
      status: 'Ativa'
    },
    {
      title: 'Executivo',
      startDate: '30/03/2024',
      endDate: '01/04/2024',
      status: 'Pendente'
    },
    {
      title: 'Entidades relevantes',
      startDate: '25/03/2024',
      endDate: '-',
      status: 'Desativada'
    },
    {
      title: 'Executivo',
      startDate: '30/03/2024',
      endDate: '01/04/2024',
      status: 'Ativa'
    },
    {
      title: 'Executivo',
      startDate: '30/03/2024',
      endDate: '-',
      status: 'Pendente'
    },
    {
      title: 'Entidades relevantes',
      startDate: '25/03/2024',
      endDate: '29/03/2024',
      status: 'Desativada'
    },
  ];

  filteredMonitorCards = [...this.monitorCards]; // Lista filtrada inicial


  constructor(private modalService: ModalService) {}

  ngOnInit() {
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

  onUserChange(user: string) {
    // Lógica para mudança de usuário
  }

  closeEditModal() {
    this.modalService.closeEditModal();
  }

  closeDuplicateModal() {
    this.modalService.closeDuplicateModal();
  }

  saveEdits() {
    console.log('Edições salvas pelo componente pai!', this.modalData);
    this.modalService.closeEditModal();
    this.modalService.closeDuplicateModal();
  }

  onCancelRemove() {
    this.modalService.closeRemoveModal();
  }

  onConfirmRemove() {
    console.log('Busca removida!', this.modalData);
    this.modalService.closeRemoveModal();
  }

  // Método para filtrar os monitorCards com base na pesquisa
  onSearchChange(query: string) {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) {
      this.filteredMonitorCards = [...this.monitorCards]; // Restaura a lista completa
    } else {
      this.filteredMonitorCards = this.monitorCards.filter(card =>
        card.title.toLowerCase().includes(searchTerm) ||
        card.startDate.toLowerCase().includes(searchTerm) ||
        card.endDate.toLowerCase().includes(searchTerm) ||
        card.status.toLowerCase().includes(searchTerm)
      );
    }
  }
}