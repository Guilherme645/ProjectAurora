import { Component, OnInit, HostBinding, OnDestroy, HostListener, EventEmitter, Output } from '@angular/core';
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
  selectedEntity: { entity: string; type: string } | null = null;
  modalPosition: { top: number; left: number } = { top: 0, left: 0 };
  @Output() highlight = new EventEmitter<{ entity: string; type: string }>();
  isSaveFilterVisible = false;
  selectedEntityForSave?: { entity: string; type: string };
  errorMessage: string | null = null;
  private subscriptions = new Subscription();

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
    this.selectedEntity = { entity: event.entity, type: event.type };
    this.modalPosition = event.position;
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.selectedEntity = null;
  }

  highlightEntity(event: { entity: string; type: string }): void {
    console.log('Entidade a ser destacada:', event.entity, 'Tipo:', event.type);
    this.highlight.emit(event);
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
    // Here you can add logic to save the selected filters, e.g., to a service or state
    this.closeSaveEntitiesFilter();
  }
}