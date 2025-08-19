import { Component, OnInit, HostBinding, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TextoEntidadesService } from 'src/app/services/TextoEntidades.service';
import { Subscription } from 'rxjs';

interface Entities {
  dates: string[];
  places: string[];
  people: string[];
  organizations: string[];
}

@Component({
  selector: 'app-page-mention-detail',
  templateUrl: './page-mention-detail.component.html',
  styleUrls: ['./page-mention-detail.component.css'],
  standalone: false
})
export class PageMentionDetailComponent implements OnInit, OnDestroy {
  // Propriedades existentes...
  noticias: any[] = [];
  filteredNoticias: any[] = [];
  isMobile: boolean = window.innerWidth <= 768;
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
  videoDescription: SafeHtml = '';
  textoOriginal: string = '';
  entities: Entities = { dates: [], places: [], people: [], organizations: [] };
  isHeaderScrolled: boolean = false;
  isPlayerMinimized: boolean = false;
  isModalVisible: boolean = false;
  isAccountModalVisible: boolean = false;
  selectedEntity: { entity: string; type: string } | null = null;
  modalPosition: { top: number; left: number } = { top: 0, left: 0 };
  isSaveFilterVisible = false;
  selectedEntityForSave?: { entity: string; type: string };
  errorMessage: string | null = null;
  private subscriptions = new Subscription();
  isSidebarOpen: boolean = true;
  showEntitiesDrawer: boolean = false;
  private isModalOpening = false;

  // Referências aos elementos
  @ViewChild('modalWrapper') modalWrapperRef!: ElementRef;
  @ViewChild('entityModal') entityModalRef!: ElementRef;
  @ViewChild('entitiesDrawer') entitiesDrawerRef!: ElementRef;
  @ViewChild('saveFilterModal') saveFilterModalRef!: ElementRef;

  @HostBinding('class.show-entities-drawer')
  get isEntitiesDrawerOpen() {
    return this.showEntitiesDrawer;
  }

  constructor(
    private textoEntidadesService: TextoEntidadesService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Se o modal acabou de ser aberto, ignora o primeiro clique
    if (this.isModalOpening) {
      this.isModalOpening = false;
      return;
    }

    // Fechar o modal de conta se clicar fora
    if (this.isAccountModalVisible && this.modalWrapperRef && !this.modalWrapperRef.nativeElement.contains(target)) {
      this.isAccountModalVisible = false;
    }

    // Fechar o modal de opções de entidade se clicar fora
    if (this.isModalVisible && this.entityModalRef && !this.entityModalRef.nativeElement.contains(target)) {
      this.closeModal();
    }

    // Fechar o drawer de entidades se clicar fora (apenas no layout desktop)
    if (!this.isMobile && this.showEntitiesDrawer && this.entitiesDrawerRef && !this.entitiesDrawerRef.nativeElement.contains(target)) {
      this.verEntidadesExtraidas();
    }

    // Fechar o modal de salvar filtros se clicar fora
    if (this.isSaveFilterVisible && this.saveFilterModalRef && !this.saveFilterModalRef.nativeElement.contains(target)) {
      this.closeSaveEntitiesFilter();
    }
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.subscriptions.add(
      this.textoEntidadesService.getTextoOriginal().subscribe({
        next: (texto) => {
          this.textoOriginal = texto;
          this.videoDescription = this.sanitizer.bypassSecurityTrustHtml(texto || 'Nenhuma descrição disponível');
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar texto:', error);
          this.errorMessage = 'Falha ao carregar o texto. Tente novamente mais tarde.';
          this.isLoading = false;
        }
      })
    );
    this.subscriptions.add(
      this.textoEntidadesService.getEntidades().subscribe({
        next: (entities) => {
          this.entities = {
            dates: entities.datas || [],
            places: entities.lugares || [],
            people: entities.pessoas || [],
            organizations: entities.organizacoes || []
          };
        },
        error: (error) => {
          console.error('Erro ao carregar entidades:', error);
          this.errorMessage = 'Falha ao carregar as entidades. Tente novamente mais tarde.';
        }
      })
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    this.isHeaderScrolled = window.scrollY > 50;
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
    console.log('isMobile:', this.isMobile);
  }
  
  onDescriptionReceived(description: string): void {
    console.log('Descrição recebida (já marcada):', description);
    this.videoDescription = this.sanitizer.bypassSecurityTrustHtml(description);
  }

  onUserChange(user: string) {
    this.currentUser = user;
  }

  onSidebarToggled(isOpen: boolean): void {
    this.isSidebarOpen = isOpen;
    if (isOpen) {
      this.showEntitiesDrawer = false;
      console.log('Fechando o drawer, pois a sidebar foi aberta.');
    }
    console.log('Sidebar toggled, isSidebarOpen:', this.isSidebarOpen);
  }

  // Lógica para abrir/fechar o drawer e ajustar a sidebar
  verEntidadesExtraidas(): void {
    // Alterna o estado do drawer
    this.showEntitiesDrawer = !this.showEntitiesDrawer;
    console.log('Entities drawer toggled, showEntitiesDrawer:', this.showEntitiesDrawer);

    // Se o drawer está sendo aberto, fecha a sidebar.
    if (this.showEntitiesDrawer) {
      this.isSidebarOpen = false;
      console.log('Fechando a sidebar, pois o drawer de entidades foi aberto.');
    } else {
      // Se o drawer está sendo fechado, abre a sidebar.
      this.isSidebarOpen = true;
      console.log('Abrindo a sidebar, pois o drawer de entidades foi fechado.');
    }
  }

  onOpenEntityOptions(event: { entity: string; type: string; position: { top: number; left: number } }): void {
    // Se o modal já estiver aberto, fecha-o
    if (this.isModalVisible) {
      this.closeModal();
      // Se o clique foi no mesmo item, não reabra
      if (this.selectedEntity?.entity === event.entity && this.selectedEntity?.type === event.type) {
        return;
      }
    }
    // Abre o modal com os novos dados
    this.selectedEntity = { entity: event.entity, type: event.type };
    this.modalPosition = event.position;
    this.isModalVisible = true;
    this.isModalOpening = true;
    console.log('Modal de entidade deve estar visível agora.', this.selectedEntity);
  }
  
  closeModal(): void {
    this.isModalVisible = false;
    this.selectedEntity = null;
    this.isModalOpening = false;
  }

  showSaveEntitiesFilter(entityName: string, type: string) {
    console.log('showSaveEntitiesFilter called with:', entityName, type);
    this.selectedEntityForSave = { entity: entityName, type };
    this.isSaveFilterVisible = true;
  }

  closeSaveEntitiesFilter() {
    console.log('closeSaveEntitiesFilter called');
    this.isSaveFilterVisible = false;
    this.selectedEntityForSave = undefined;
  }

  onSaveSelectedFilters(event: { entity: string, selectedFilters: any[] }) {
    console.log('Filters saved:', event.entity, event.selectedFilters);
    this.closeSaveEntitiesFilter();
  }

  toggleModal() {
    this.isAccountModalVisible = !this.isAccountModalVisible;
    console.log('Estado do modal de conta:', this.isAccountModalVisible);
  }
}