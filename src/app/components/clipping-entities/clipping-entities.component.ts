import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { TextoEntidadesService, TextoEntidadesData } from 'src/app/services/TextoEntidades.service';
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
  selector: 'app-clipping-entities',
  templateUrl: './clipping-entities.component.html',
  styleUrls: ['./clipping-entities.component.css'],
  standalone: false
})
export class ClippingEntitiesComponent implements OnInit, OnDestroy {
  @Input() textoOriginal: string = '';
  @Input() useAlternativeJson: boolean = false;
  @Output() textoMarcadoChange = new EventEmitter<string>();
  @Output() textoMarcadoSegmentsChange = new EventEmitter<string[]>();
  @Output() close = new EventEmitter<void>();
  @Output() openEntityOptions = new EventEmitter<{
    entity: string;
    type: string;
    position: { top: number; left: number };
  }>();

  isMobile: boolean = false;
  textoMarcado: string = '';
  textoMarcadoSegments: string[] = [];

  dates: string[] = [];
  places: string[] = [];
  people: string[] = [];
  organizations: string[] = [];
  profissoes: string[] = [];

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
  public debouncedFilterEntities = debounce(this.filterEntities.bind(this), 300);
  private currentlyOpenEntity: { entity: string; type: string } | null = null;
  isClippingComponent: boolean = false;

  entityCards: EntityCard[] = [];

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(private textoEntidadesService: TextoEntidadesService, private router: Router) {}

  ngOnInit(): void {
    this.checkIfMobile();
    this.isClippingComponent = this.router.url.includes('clipping');
    this.initializeEntityCards();

    if (this.useAlternativeJson) {
      this.subscriptions.add(
        this.textoEntidadesService.carregarTextoEntidadesAlternativo().subscribe({
          next: (data: TextoEntidadesData) => {
            console.log('ClippingEntitiesComponent recebeu dados do JSON alternativo:', data);
            this.textoMarcado = data.texto;
            this.textoMarcadoSegments = data.texto.split(' ').map(() => ''); // Inicializar com strings vazias

            this.dates = data.entidades.datas || [];
            this.places = data.entidades.lugares || [];
            this.people = data.entidades.pessoas || [];
            this.organizations = data.entidades.organizacoes || [];
            this.profissoes = data.entidades.profissoes || [];

            this.updateTotalEntities();
            this.updateEntityCards();
            this.atualizarTextoMarcado();
          },
          error: (error) => {
            console.error('Erro ao carregar e processar transcricao_completa.json em ClippingEntitiesComponent:', error);
          }
        })
      );
    } else {
      this.subscriptions.add(
        this.textoEntidadesService.getTextoOriginal().subscribe({
          next: (texto) => {
            this.textoMarcado = texto;
          },
          error: (error) => console.error('Erro ao carregar texto-entidades.json (texto):', error)
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
            this.updateTotalEntities();
            this.updateEntityCards();
            this.atualizarTextoMarcado();
          },
          error: (error) => console.error('Erro ao carregar texto-entidades.json (entidades):', error)
        })
      );
    }
  }

  private updateTotalEntities(): void {
    this.totalEntities =
      (this.dates?.length || 0) +
      (this.places?.length || 0) +
      (this.people?.length || 0) +
      (this.organizations?.length || 0) +
      (this.profissoes?.length || 0);
    console.log('Total de entidades únicas:', this.totalEntities);
  }

  @HostListener('window:resize', ['$event'])
  checkIfMobile(): void {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      this.isSearchVisible = true;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.debouncedFilterEntities.cancel();
  }

  private initializeEntityCards(): void {
    this.entityCards = [
      { title: 'Datas extraídas', color: '#2563eb', type: 'date', items: [], displayedItems: [], allItems: [], enabled: this.datesEnabled, tagClass: 'bg-blue-100 text-blue-800', toggle: () => this.toggleDates(), showAll: () => this.showAllForCard('date') },
      { title: 'Lugares extraídos', color: '#14B8A6', type: 'place', items: [], displayedItems: [], allItems: [], enabled: this.placesEnabled, tagClass: 'bg-green-100 text-green-800', toggle: () => this.togglePlaces(), showAll: () => this.showAllForCard('place') },
      { title: 'Pessoas extraídas', color: '#EAB308', type: 'person', items: [], displayedItems: [], allItems: [], enabled: this.peopleEnabled, tagClass: 'bg-yellow-100 text-yellow-800', toggle: () => this.togglePeople(), showAll: () => this.showAllForCard('person') },
      { title: 'Organizações extraídas', color: '#D4D4D4', type: 'organization', items: [], displayedItems: [], allItems: [], enabled: this.organizationsEnabled, tagClass: 'bg-gray-100 text-gray-800', toggle: () => this.toggleOrganizations(), showAll: () => this.showAllForCard('organization') },
      { title: 'Profissões extraídas', color: '#EF4444', type: 'profissao', items: [], displayedItems: [], allItems: [], enabled: this.profissoesEnabled, tagClass: 'bg-red-100 text-red-800', toggle: () => this.toggleProfissoes(), showAll: () => this.showAllForCard('profissao') },
    ];
  }

  private updateEntityCards(): void {
    this.entityCards.forEach((card) => {
      let sourceArray: string[] = [];
      switch (card.type) {
        case 'date': sourceArray = this.dates; card.enabled = this.datesEnabled; break;
        case 'place': sourceArray = this.places; card.enabled = this.placesEnabled; break;
        case 'person': sourceArray = this.people; card.enabled = this.peopleEnabled; break;
        case 'organization': sourceArray = this.organizations; card.enabled = this.organizationsEnabled; break;
        case 'profissao': sourceArray = this.profissoes; card.enabled = this.profissoesEnabled; break;
      }
      card.allItems = [...(sourceArray || [])];
      card.items = card.allItems;
      this.applyQueryToCard(card);
    });
    console.log('Cartões de entidades atualizados:', JSON.parse(JSON.stringify(this.entityCards)));
    this.filterEntities();
  }

  private applyQueryToCard(card: EntityCard): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (query) {
      card.displayedItems = card.allItems.filter((item) => item.toLowerCase().includes(query));
    } else {
      card.displayedItems = card.allItems.slice(0, this.displayLimit);
    }
  }

  atualizarTextoMarcado(): void {
    this.subscriptions.add(
      this.textoEntidadesService.substituirEntidadesPorSegmento({
        datas: this.datesEnabled,
        lugares: this.placesEnabled,
        pessoas: this.peopleEnabled,
        organizacoes: this.organizationsEnabled,
        profissoes: this.profissoesEnabled
      }).subscribe({
        next: (textosMarcados) => {
          this.textoMarcadoSegments = textosMarcados;
          this.textoMarcado = textosMarcados.join(' '); // Para compatibilidade
          this.textoMarcadoChange.emit(this.textoMarcado);
          this.textoMarcadoSegmentsChange.emit(this.textoMarcadoSegments);
          console.log('Texto marcado atualizado:', this.textoMarcado.substring(0, 100) + "...");
        },
        error: (error) => {
          console.error('Erro ao atualizar texto marcado:', error);
        }
      })
    );
  }

  toggleDates(): void { this.datesEnabled = !this.datesEnabled; this.updateCardEnableState('date', this.datesEnabled); }
  togglePlaces(): void { this.placesEnabled = !this.placesEnabled; this.updateCardEnableState('place', this.placesEnabled); }
  togglePeople(): void { this.peopleEnabled = !this.peopleEnabled; this.updateCardEnableState('person', this.peopleEnabled); }
  toggleOrganizations(): void { this.organizationsEnabled = !this.organizationsEnabled; this.updateCardEnableState('organization', this.organizationsEnabled); }
  toggleProfissoes(): void { this.profissoesEnabled = !this.profissoesEnabled; this.updateCardEnableState('profissao', this.profissoesEnabled); }

  private updateCardEnableState(type: string, enabled: boolean): void {
    const card = this.entityCards.find((c) => c.type === type);
    if (card) card.enabled = enabled;
    this.atualizarTextoMarcado();
    console.log(`${type} ativado/desativado:`, enabled);
  }

  toggleHighlightAll(): void {
    this.highlightAllCategories = !this.highlightAllCategories;
    this.datesEnabled = this.highlightAllCategories;
    this.placesEnabled = this.highlightAllCategories;
    this.peopleEnabled = this.highlightAllCategories;
    this.organizationsEnabled = this.highlightAllCategories;
    this.profissoesEnabled = this.highlightAllCategories;

    this.entityCards.forEach((card) => (card.enabled = this.highlightAllCategories));
    this.atualizarTextoMarcado();
    console.log('Destaque de todas as categorias ativado/desativado:', this.highlightAllCategories);
  }

  showAllForCard(type: string): void {
    const card = this.entityCards.find((c) => c.type === type);
    if (card) {
      card.displayedItems = [...card.allItems];
      console.log(`Mostrar todos para ${type}:`, card.displayedItems.length);
    }
  }

  closeDrawer(): void {
    this.close.emit();
    console.log('Gaveta de entidades fechada');
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filterEntities();
  }

  filterEntities(): void {
    this.entityCards.forEach(card => this.applyQueryToCard(card));
    console.log('Entidades filtradas com base na consulta:', this.searchQuery);
  }

  openEntityModal(event: MouseEvent, entity: string, type: string): void {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    const modalWidth = 260;
    const viewportHeight = window.innerHeight;

    let left = rect.left + window.scrollX - modalWidth;
    let top = rect.top + window.scrollY;

    if (left < 0) { left = rect.right + window.scrollX + 10; }
    if (top + 150 > viewportHeight + window.scrollY) { top = viewportHeight + window.scrollY - 160; }
    if (top < window.scrollY) { top = window.scrollY + 10; }

    const position = { top, left };

    if (this.currentlyOpenEntity && this.currentlyOpenEntity.entity === entity && this.currentlyOpenEntity.type === type) {
      this.openEntityOptions.emit({ entity: '', type: '', position: { top: 0, left: 0 } });
      this.currentlyOpenEntity = null;
    } else {
      this.openEntityOptions.emit({ entity, type, position });
      this.currentlyOpenEntity = { entity, type };
    }
    console.log(`Emitindo openEntityOptions para entidade ${type}: ${entity} na posição`, position);
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
    this.searchQuery = '';
    this.filterEntities();
    console.log('Aba selecionada:', this.selectedTab);
  }
}