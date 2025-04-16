import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TextoEntidadesService } from 'src/app/services/TextoEntidades.service';

@Component({
  selector: 'app-entities-drawer',
  templateUrl: './entities-drawer.component.html',
  styleUrls: ['./entities-drawer.component.css'],
  standalone: false
})
export class EntitiesDrawerComponent implements OnInit {
  @Input() textoOriginal: string = '';
  @Output() textoMarcadoChange = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();
  @Output() openEntityOptions = new EventEmitter<{
    entity: string;
    type: string;
    position: { top: number; left: number };
  }>();

  textoMarcado: string;

  // Entidades completas
  dates: string[] = [];
  places: string[] = [];
  people: string[] = [];
  organizations: string[] = [];

  // Entidades exibidas (limitadas inicialmente ou filtradas)
  displayedDates: string[] = [];
  displayedPlaces: string[] = [];
  displayedPeople: string[] = [];
  displayedOrganizations: string[] = [];

  // Estados dos toggles
  datesEnabled: boolean = false;
  placesEnabled: boolean = false;
  peopleEnabled: boolean = false;
  organizationsEnabled: boolean = false;
  highlightAllCategories: boolean = false;

  // Estado da pesquisa
  isSearchVisible: boolean = false;
  searchQuery: string = '';

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  private readonly displayLimit = 3;

  constructor(private textoEntidadesService: TextoEntidadesService) {
    this.textoMarcado = this.textoOriginal;
  }

  ngOnInit(): void {
    const entidades = this.textoEntidadesService.getEntidades();
    this.dates = entidades.datas;
    this.places = entidades.lugares;
    this.people = entidades.pessoas;
    this.organizations = entidades.organizacoes;

    this.displayedDates = this.dates.slice(0, this.displayLimit);
    this.displayedPlaces = this.places.slice(0, this.displayLimit);
    this.displayedPeople = this.people.slice(0, this.displayLimit);
    this.displayedOrganizations = this.organizations.slice(0, this.displayLimit);

    this.textoMarcado = this.textoOriginal;
    this.atualizarTextoMarcado();
  }

  ngOnChanges(): void {
    this.textoMarcado = this.textoOriginal;
    this.atualizarTextoMarcado();
  }

  atualizarTextoMarcado(): void {
    this.textoMarcado = this.textoEntidadesService.substituirEntidades({
      datas: this.datesEnabled,
      lugares: this.placesEnabled,
      pessoas: this.peopleEnabled,
      organizacoes: this.organizationsEnabled
    });
    this.textoMarcadoChange.emit(this.textoMarcado);
    console.log('Texto marcado atualizado:', this.textoMarcado);
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

  // Funções de pesquisa
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

    // Posiciona o modal à esquerda do botão, como na imagem
    const position = {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX - 260 // 260px é aproximadamente a largura do modal (w-64) + margem
    };

    this.openEntityOptions.emit({
      entity,
      type,
      position
    });
    console.log(`Emitting openEntityOptions for ${type} entity: ${entity} at position`, position);
  }
}