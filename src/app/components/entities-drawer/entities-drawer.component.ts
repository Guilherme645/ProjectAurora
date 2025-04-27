import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { TextoEntidadesService } from 'src/app/services/TextoEntidades.service';
import { Subscription } from 'rxjs';
import { debounce } from 'lodash';

@Component({
  selector: 'app-entities-drawer',
  templateUrl: './entities-drawer.component.html',
  styleUrls: ['./entities-drawer.component.css'],
  standalone: false
})
export class EntitiesDrawerComponent implements OnInit, OnDestroy {
  @Input() textoOriginal: string = '';
  @Output() textoMarcadoChange = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();
  @Output() openEntityOptions = new EventEmitter<{
    entity: string;
    type: string;
    position: { top: number; left: number };
  }>();

  isMobile: boolean = false;
  textoMarcado: string = '';
  dates: string[] = [];
  places: string[] = [];
  people: string[] = [];
  organizations: string[] = [];
  displayedDates: string[] = [];
  displayedPlaces: string[] = [];
  displayedPeople: string[] = [];
  displayedOrganizations: string[] = [];
  datesEnabled: boolean = false;
  placesEnabled: boolean = false;
  peopleEnabled: boolean = false;
  organizationsEnabled: boolean = false;
  highlightAllCategories: boolean = false;
  isSearchVisible: boolean = false;
  searchQuery: string = '';
  selectedTab: string = 'all';
  totalEntities: number = 0;
  private readonly displayLimit = 3;
  private subscriptions = new Subscription();
  private debouncedFilterEntities = debounce(this.filterEntities.bind(this), 300);
  private currentlyOpenEntity: { entity: string; type: string } | null = null;

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(private textoEntidadesService: TextoEntidadesService) {}

  ngOnInit(): void {
    this.checkIfMobile();
    this.subscriptions.add(
      this.textoEntidadesService.getTextoOriginal().subscribe({
        next: (texto) => {
          this.textoMarcado = texto;
        },
        error: (error) => {
          console.error('Erro ao carregar texto original:', error);
        }
      })
    );

    this.subscriptions.add(
      this.textoEntidadesService.getEntidades().subscribe({
        next: (entidades) => {
          this.dates = entidades.datas || [];
          this.places = entidades.lugares || [];
          this.people = entidades.pessoas || [];
          this.organizations = entidades.organizacoes || [];

          this.totalEntities = this.dates.length + this.places.length + this.people.length + this.organizations.length;

          this.displayedDates = this.dates.slice(0, this.displayLimit);
          this.displayedPlaces = this.places.slice(0, this.displayLimit);
          this.displayedPeople = this.people.slice(0, this.displayLimit);
          this.displayedOrganizations = this.organizations.slice(0, this.displayLimit);

          this.atualizarTextoMarcado();
        },
        error: (error) => {
          console.error('Erro ao carregar entidades:', error);
        }
      })
    );
  }

  @HostListener('window:resize', ['$event'])
  checkIfMobile(): void {
    this.isMobile = window.innerWidth <= 768;
    console.log('isMobile atualizado:', this.isMobile);
    if (this.isMobile) {
      this.isSearchVisible = true;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  atualizarTextoMarcado(): void {
    this.subscriptions.add(
      this.textoEntidadesService.substituirEntidades({
        datas: this.datesEnabled,
        lugares: this.placesEnabled,
        pessoas: this.peopleEnabled,
        organizacoes: this.organizationsEnabled
      }).subscribe({
        next: (textoMarcado) => {
          this.textoMarcado = textoMarcado;
          this.textoMarcadoChange.emit(this.textoMarcado);
          console.log('Texto marcado atualizado:', this.textoMarcado);
        },
        error: (error) => {
          console.error('Erro ao atualizar texto marcado:', error);
        }
      })
    );
  }

  toggleDates(): void {
    // Removido a atualização de highlightAllCategories para evitar conflitos
    this.atualizarTextoMarcado();
    console.log('Dates toggled:', this.datesEnabled);
  }

  togglePlaces(): void {
    // Removido a atualização de highlightAllCategories para evitar conflitos
    this.atualizarTextoMarcado();
    console.log('Places toggled:', this.placesEnabled);
  }

  togglePeople(): void {
    // Removido a atualização de highlightAllCategories para evitar conflitos
    this.atualizarTextoMarcado();
    console.log('People toggled:', this.peopleEnabled);
  }

  toggleOrganizations(): void {
    // Removido a atualização de highlightAllCategories para evitar conflitos
    this.atualizarTextoMarcado();
    console.log('Organizations toggled:', this.organizationsEnabled);
  }

  toggleHighlightAll(): void {
    // Inverte o estado de highlightAllCategories
    this.highlightAllCategories = !this.highlightAllCategories;
    // Atualiza todas as categorias para corresponder ao estado
    this.datesEnabled = this.highlightAllCategories;
    this.placesEnabled = this.highlightAllCategories;
    this.peopleEnabled = this.highlightAllCategories;
    this.organizationsEnabled = this.highlightAllCategories;
    // Chama a atualização do texto marcado
    this.atualizarTextoMarcado();
    console.log('Highlight all toggled:', this.highlightAllCategories);
  }

  showAllDates(): void {
    this.displayedDates = [...this.dates];
    console.log('Show all dates:', this.displayedDates);
  }

  showAllPlaces(): void {
    this.displayedPlaces = [...this.places];
    console.log('Show all places:', this.displayedPlaces);
  }

  showAllPeople(): void {
    this.displayedPeople = [...this.people];
    console.log('Show all people:', this.displayedPeople);
  }

  showAllOrganizations(): void {
    this.displayedOrganizations = [...this.organizations];
    console.log('Show all organizations:', this.displayedOrganizations);
  }

  closeDrawer(): void {
    this.close.emit();
    console.log('Close drawer emitted');
  }

  toggleSearch(): void {
    this.isSearchVisible = !this.isSearchVisible;
    if (this.isSearchVisible) {
      setTimeout(() => this.searchInput.nativeElement.focus(), 0);
    } else {
      this.clearSearch();
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    if (!this.isMobile) {
      this.isSearchVisible = false;
    }
    this.selectedTab = 'all';
    this.filterEntities();
  }

  filterEntities(): void {
    const query = this.searchQuery.toLowerCase().trim();

    if (!query) {
      this.displayedDates = this.dates.slice(0, this.displayLimit);
      this.displayedPlaces = this.places.slice(0, this.displayLimit);
      this.displayedPeople = this.people.slice(0, this.displayLimit);
      this.displayedOrganizations = this.organizations.slice(0, this.displayLimit);
    } else {
      this.selectedTab = 'all';
      this.displayedDates = this.dates.filter(date => date.toLowerCase().includes(query));
      this.displayedPlaces = this.places.filter(place => place.toLowerCase().includes(query));
      this.displayedPeople = this.people.filter(person => person.toLowerCase().includes(query));
      this.displayedOrganizations = this.organizations.filter(org => org.toLowerCase().includes(query));
    }

    console.log('Entities filtered:', {
      dates: this.displayedDates,
      places: this.displayedPlaces,
      people: this.displayedPeople,
      organizations: this.displayedOrganizations
    });
  }

  openEntityModal(event: MouseEvent, entity: string, type: string): void {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    const modalWidth = 260;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = rect.left + window.scrollX - modalWidth;
    let top = rect.top + window.scrollY;

    if (left < 0) {
      left = rect.right + window.scrollX + 10;
    }
    if (top + 150 > viewportHeight + window.scrollY) {
      top = viewportHeight + window.scrollY - 160;
    }
    if (top < window.scrollY) {
      top = window.scrollY + 10;
    }

    const position = { top, left };

    if (
      this.currentlyOpenEntity &&
      this.currentlyOpenEntity.entity === entity &&
      this.currentlyOpenEntity.type === type
    ) {
      this.openEntityOptions.emit({
        entity: '',
        type: '',
        position: { top: 0, left: 0 }
      });
      this.currentlyOpenEntity = null;
    } else {
      this.openEntityOptions.emit({
        entity,
        type,
        position
      });
      this.currentlyOpenEntity = { entity, type };
    }

    console.log(`Emitting openEntityOptions for ${type} entity: ${entity} at position`, position);
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
    this.searchQuery = '';
    if (!this.isMobile) {
      this.isSearchVisible = false;
    }
    this.filterEntities();
    console.log('Tab selected:', this.selectedTab);
  }
}