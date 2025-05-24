import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { TextoEntidadesService } from 'src/app/services/TextoEntidades.service';
import { Subscription } from 'rxjs';
import { debounce } from 'lodash';
import { Router } from '@angular/router';

interface EntityCard {
  title: string;
  color: string;
  type: string;
  items: string[];
  displayedItems: string[];
  allItems: string[];
  enabled: boolean;
  tagClass: string;
  toggle: () => void;
  showAll: () => void;
}

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
  profissoes: string[] = [];
  displayedDates: string[] = [];
  displayedPlaces: string[] = [];
  displayedPeople: string[] = [];
  displayedOrganizations: string[] = [];
  displayedProfissoes: string[] = [];
  datesEnabled: boolean = false;
  placesEnabled: boolean = false;
  peopleEnabled: boolean = false;
  organizationsEnabled: boolean = false;
  profissoesEnabled: boolean = false;
  highlightAllCategories: boolean = false;
  isSearchVisible: boolean = false;
  searchQuery: string = '';
  selectedTab: string = 'all';
  totalEntities: number = 0;
  private readonly displayLimit = 3;
  private subscriptions = new Subscription();
  private debouncedFilterEntities = debounce(this.filterEntities.bind(this), 300);
  private currentlyOpenEntity: { entity: string; type: string } | null = null;
isClippingComponent = false; // ou true, se estiver no clipping

  // Adicionando entityCards para suportar a segunda versão
  entityCards: EntityCard[] = [];

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(private textoEntidadesService: TextoEntidadesService,
private router: Router
  ) {}

  ngOnInit(): void {
    this.checkIfMobile();
      this.isClippingComponent = this.router.url.includes('clipping');
    this.initializeEntityCards();
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
          this.profissoes = entidades.profissoes || [];

          this.totalEntities = this.dates.length + this.places.length + this.people.length + this.organizations.length + this.profissoes.length;

          // Atualizar entityCards com os dados
          this.updateEntityCards();

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

  // Inicializar entityCards para a segunda versão
  private initializeEntityCards(): void {
    this.entityCards = [
      {
        title: 'Datas extraídas',
        color: '#2563eb',
        type: 'date',
        items: [],
        displayedItems: [],
        allItems: [],
        enabled: this.datesEnabled,
        tagClass: 'bg-blue-100 text-blue-800',
        toggle: () => this.toggleDates(),
        showAll: () => this.showAllDates(),
      },
      {
        title: 'Lugares extraídos',
        color: '#14B8A6',
        type: 'place',
        items: [],
        displayedItems: [],
        allItems: [],
        enabled: this.placesEnabled,
        tagClass: 'bg-green-100 text-green-800',
        toggle: () => this.togglePlaces(),
        showAll: () => this.showAllPlaces(),
      },
      {
        title: 'Pessoas extraídas',
        color: '#EAB308',
        type: 'person',
        items: [],
        displayedItems: [],
        allItems: [],
        enabled: this.peopleEnabled,
        tagClass: 'bg-yellow-100 text-yellow-800',
        toggle: () => this.togglePeople(),
        showAll: () => this.showAllPeople(),
      },
      {
        title: 'Organizações extraídas',
        color: '#D4D4D4',
        type: 'organization',
        items: [],
        displayedItems: [],
        allItems: [],
        enabled: this.organizationsEnabled,
        tagClass: 'bg-gray-100 text-gray-800',
        toggle: () => this.toggleOrganizations(),
        showAll: () => this.showAllOrganizations(),
      },
      {
        title: 'Profissões extraídas',
        color: '#EF4444',
        type: 'profissao',
        items: [],
        displayedItems: [],
        allItems: [],
        enabled: this.profissoesEnabled,
        tagClass: 'bg-red-100 text-red-800',
        toggle: () => this.toggleProfissoes(),
        showAll: () => this.showAllProfissions(),
      },
    ];
  }

  // Atualizar entityCards com os dados das entidades
  private updateEntityCards(): void {
    this.entityCards.forEach((card) => {
      switch (card.type) {
        case 'date':
          card.items = this.dates;
          card.allItems = this.dates;
          card.displayedItems = this.dates.slice(0, this.displayLimit);
          card.enabled = this.datesEnabled;
          break;
        case 'place':
          card.items = this.places;
          card.allItems = this.places;
          card.displayedItems = this.places.slice(0, this.displayLimit);
          card.enabled = this.placesEnabled;
          break;
        case 'person':
          card.items = this.people;
          card.allItems = this.people;
          card.displayedItems = this.people.slice(0, this.displayLimit);
          card.enabled = this.peopleEnabled;
          break;
        case 'organization':
          card.items = this.organizations;
          card.allItems = this.organizations;
          card.displayedItems = this.organizations.slice(0, this.displayLimit);
          card.enabled = this.organizationsEnabled;
          break;
        case 'profissao':
          card.items = this.profissoes;
          card.allItems = this.profissoes;
          card.displayedItems = this.profissoes.slice(0, this.displayLimit);
          card.enabled = this.profissoesEnabled;
          break;
      }
    });

    // Atualizar variáveis legadas para manter compatibilidade
    this.displayedDates = this.entityCards.find((c) => c.type === 'date')?.displayedItems || [];
    this.displayedPlaces = this.entityCards.find((c) => c.type === 'place')?.displayedItems || [];
    this.displayedPeople = this.entityCards.find((c) => c.type === 'person')?.displayedItems || [];
    this.displayedOrganizations = this.entityCards.find((c) => c.type === 'organization')?.displayedItems || [];
    this.displayedProfissoes = this.entityCards.find((c) => c.type === 'profissao')?.displayedItems || [];
  }

  atualizarTextoMarcado(): void {
    this.subscriptions.add(
      this.textoEntidadesService.substituirEntidades({
        datas: this.datesEnabled,
        lugares: this.placesEnabled,
        pessoas: this.peopleEnabled,
        organizacoes: this.organizationsEnabled,
        profissoes: this.profissoesEnabled
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
    this.entityCards.find((c) => c.type === 'date')!.enabled = this.datesEnabled;
    this.atualizarTextoMarcado();
    console.log('Dates toggled:', this.datesEnabled);
  }

  togglePlaces(): void {
    this.placesEnabled = !this.placesEnabled;
    this.entityCards.find((c) => c.type === 'place')!.enabled = this.placesEnabled;
    this.atualizarTextoMarcado();
    console.log('Places toggled:', this.placesEnabled);
  }

  togglePeople(): void {
    this.peopleEnabled = !this.peopleEnabled;
    this.entityCards.find((c) => c.type === 'person')!.enabled = this.peopleEnabled;
    this.atualizarTextoMarcado();
    console.log('People toggled:', this.peopleEnabled);
  }

  toggleOrganizations(): void {
    this.organizationsEnabled = !this.organizationsEnabled;
    this.entityCards.find((c) => c.type === 'organization')!.enabled = this.organizationsEnabled;
    this.atualizarTextoMarcado();
    console.log('Organizations toggled:', this.organizationsEnabled);
  }

  toggleProfissoes(): void {
    this.profissoesEnabled = !this.profissoesEnabled;
    this.entityCards.find((c) => c.type === 'profissao')!.enabled = this.profissoesEnabled;
    this.atualizarTextoMarcado();
    console.log('Professions toggled:', this.profissoesEnabled);
  }

  toggleHighlightAll(): void {
    this.highlightAllCategories = !this.highlightAllCategories;
    this.datesEnabled = this.highlightAllCategories;
    this.placesEnabled = this.highlightAllCategories;
    this.peopleEnabled = this.highlightAllCategories;
    this.organizationsEnabled = this.highlightAllCategories;
    this.profissoesEnabled = this.highlightAllCategories;

    // Atualizar entityCards
    this.entityCards.forEach((card) => (card.enabled = this.highlightAllCategories));

    this.atualizarTextoMarcado();
    console.log('Highlight all toggled:', this.highlightAllCategories);
  }

  showAllDates(): void {
    this.displayedDates = [...this.dates];
    this.entityCards.find((c) => c.type === 'date')!.displayedItems = [...this.dates];
    console.log('Show all dates:', this.displayedDates);
  }

  showAllPlaces(): void {
    this.displayedPlaces = [...this.places];
    this.entityCards.find((c) => c.type === 'place')!.displayedItems = [...this.places];
    console.log('Show all places:', this.displayedPlaces);
  }

  showAllPeople(): void {
    this.displayedPeople = [...this.people];
    this.entityCards.find((c) => c.type === 'person')!.displayedItems = [...this.people];
    console.log('Show all people:', this.displayedPeople);
  }

  showAllOrganizations(): void {
    this.displayedOrganizations = [...this.organizations];
    this.entityCards.find((c) => c.type === 'organization')!.displayedItems = [...this.organizations];
    console.log('Show all organizations:', this.displayedOrganizations);
  }

  showAllProfissions(): void {
    this.displayedProfissoes = [...this.profissoes];
    this.entityCards.find((c) => c.type === 'profissao')!.displayedItems = [...this.profissoes];
    console.log('Show all profissao:', this.displayedProfissoes);
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
      this.displayedProfissoes = this.profissoes.slice(0, this.displayLimit);

      this.entityCards.forEach((card) => {
        card.displayedItems = card.allItems.slice(0, this.displayLimit);
      });
    } else {
      this.selectedTab = 'all';
      this.displayedDates = this.dates.filter((date) => date.toLowerCase().includes(query));
      this.displayedPlaces = this.places.filter((place) => place.toLowerCase().includes(query));
      this.displayedPeople = this.people.filter((person) => person.toLowerCase().includes(query));
      this.displayedOrganizations = this.organizations.filter((org) => org.toLowerCase().includes(query));
      this.displayedProfissoes = this.profissoes.filter((profissao) => profissao.toLowerCase().includes(query));

      this.entityCards.forEach((card) => {
        card.displayedItems = card.allItems.filter((item) => item.toLowerCase().includes(query));
      });
    }

    console.log('Entities filtered:', {
      dates: this.displayedDates,
      places: this.displayedPlaces,
      people: this.displayedPeople,
      organizations: this.displayedOrganizations,
      profissoes: this.displayedProfissoes,
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