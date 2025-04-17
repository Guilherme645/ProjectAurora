import { Component, OnInit, HostBinding, OnDestroy, HostListener, EventEmitter, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TextoEntidadesService } from 'src/app/services/TextoEntidades.service';

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
  isMobile: boolean = false;
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
  textoOriginal: string;
  isHeaderScrolled: boolean = false;
  isPlayerMinimized: boolean = false; // Mantido para compatibilidade com ngClass
isModalVisible: boolean = false;
selectedEntity: { entity: string; type: string } | null = null;
modalPosition: { top: number; left: number } = { top: 0, left: 0 };
@Output() highlight = new EventEmitter<{ entity: string; type: string }>();
isSaveFilterVisible = false;
selectedEntityForSave?: { entity: string; type: string };

  @HostBinding('class.show-entities-drawer')
  get isEntitiesDrawerOpen() {
    return this.showEntitiesDrawer;
  }

  constructor(
    private textoEntidadesService: TextoEntidadesService,
    private sanitizer: DomSanitizer
  ) {
    this.textoOriginal = this.textoEntidadesService.getTextoOriginal();
  }

  ngOnInit(): void {
    this.checkScreenSize();
    this.videoDescription = this.sanitizer.bypassSecurityTrustHtml(this.textoOriginal);
  }

  ngOnDestroy(): void {}

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    this.isHeaderScrolled = window.scrollY > 50;
    // Removido isPlayerMinimized, pois PlayerComponent gerencia isFloating
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
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
    // Aqui você pode implementar a lógica para destacar a entidade
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
}