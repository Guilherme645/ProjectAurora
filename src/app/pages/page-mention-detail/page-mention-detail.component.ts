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
  isSidebarOpen: boolean = true;
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
  showEntitiesDrawer: boolean = false;
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

  // Referências aos elementos
  @ViewChild('modalWrapper') modalWrapperRef!: ElementRef; // Para o modal de conta
  @ViewChild('entityModal') entityModalRef!: ElementRef; // Para o modal de opções de entidade
  @ViewChild('entitiesDrawer') entitiesDrawerRef!: ElementRef; // Para o drawer de entidades
  @ViewChild('saveFilterModal') saveFilterModalRef!: ElementRef; // Para o modal de salvar filtros

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

  // Lógica para detectar cliques fora dos componentes
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Fechar o modal de conta se clicar fora
    if (this.isAccountModalVisible && this.modalWrapperRef && !this.modalWrapperRef.nativeElement.contains(target)) {
      this.isAccountModalVisible = false;
    }

    // Fechar o modal de opções de entidade se clicar fora
    if (this.isModalVisible && this.entityModalRef && !this.entityModalRef.nativeElement.contains(target)) {
      this.closeModal();
    }

    // Fechar o drawer de entidades se clicar fora (apenas no layout desktop, já que no mobile ele já tem um comportamento de fechar ao clicar fora)
    if (!this.isMobile && this.showEntitiesDrawer && this.entitiesDrawerRef && !this.entitiesDrawerRef.nativeElement.contains(target)) {
      this.verEntidadesExtraidas();
    }

    // Fechar o modal de salvar filtros se clicar fora
    if (this.isSaveFilterVisible && this.saveFilterModalRef && !this.saveFilterModalRef.nativeElement.contains(target)) {
      this.closeSaveEntitiesFilter();
    }
  }

  // Métodos existentes...
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
    console.log('Sidebar toggled, isSidebarOpen:', this.isSidebarOpen);
  }

  verEntidadesExtraidas(): void {
    this.showEntitiesDrawer = !this.showEntitiesDrawer;
    if (this.showEntitiesDrawer) {
      this.isSidebarOpen = false;
    } else {
      this.isSidebarOpen = true;
    }
    console.log('Entities drawer toggled, showEntitiesDrawer:', this.showEntitiesDrawer);
  }

  onOpenEntityOptions(event: { entity: string; type: string; position: { top: number; left: number } }): void {
    if (event.entity === '' && event.type === '') {
      // Se receber vazio (o próprio EntitiesDrawer mandou fechar)
      this.closeModal();
    } else {
      // Se for diferente, ou novo clique
      this.selectedEntity = { entity: event.entity, type: event.type };
      this.modalPosition = event.position;
      this.isModalVisible = true;
    }
  }
  
  closeModal(): void {
    this.isModalVisible = false;
    this.selectedEntity = null;
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