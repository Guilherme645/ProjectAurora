import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
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
  totalEntities: number = 0;
  private readonly displayLimit = 3;
  private subscriptions = new Subscription();
  private debouncedFilterEntities = debounce(this.filterEntities.bind(this), 300);

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(private textoEntidadesService: TextoEntidadesService) {}

  ngOnInit(): void {
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
    this.datesEnabled = !this.datesEnabled;
    this.highlightAllCategories = this.datesEnabled && this.placesEnabled && this.peopleEnabled && this.organizationsEnabled;
    this.atualizarTextoMarcado();
    console.log('Dates toggled:', this.datesEnabled, 'Highlight all:', this.highlightAllCategories);
  }

  togglePlaces(): void {
    this.placesEnabled = !this.placesEnabled;
    this.highlightAllCategories = this.datesEnabled && this.placesEnabled && this.peopleEnabled && this.organizationsEnabled;
    this.atualizarTextoMarcado();
    console.log('Places toggled:', this.placesEnabled, 'Highlight all:', this.highlightAllCategories);
  }

  togglePeople(): void {
    this.peopleEnabled = !this.peopleEnabled;
    this.highlightAllCategories = this.datesEnabled && this.placesEnabled && this.peopleEnabled && this.organizationsEnabled;
    this.atualizarTextoMarcado();
    console.log('People toggled:', this.peopleEnabled, 'Highlight all:', this.highlightAllCategories);
  }

  toggleOrganizations(): void {
    this.organizationsEnabled = !this.organizationsEnabled;
    this.highlightAllCategories = this.datesEnabled && this.placesEnabled && this.peopleEnabled && this.organizationsEnabled;
    this.atualizarTextoMarcado();
    console.log('Organizations toggled:', this.organizationsEnabled, 'Highlight all:', this.highlightAllCategories);
  }

  toggleHighlightAll(): void {
    this.highlightAllCategories = !this.highlightAllCategories;
    this.datesEnabled = this.highlightAllCategories;
    this.placesEnabled = this.highlightAllCategories;
    this.peopleEnabled = this.highlightAllCategories;
    this.organizationsEnabled = this.highlightAllCategories;
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
    this.isSearchVisible = false;
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
    const button = event.currentTarget as HTMLButtonElement;
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
      top = rect.bottom + window.scrollY - 150 - 10;
    }
    if (top < window.scrollY) {
      top = window.scrollY + 10;
    }

    const position = { top, left };

    this.openEntityOptions.emit({
      entity,
      type,
      position
    });
    console.log(`Emitting openEntityOptions for ${type} entity: ${entity} at position`, position);
  }
}