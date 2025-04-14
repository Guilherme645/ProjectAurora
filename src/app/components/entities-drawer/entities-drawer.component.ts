import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TextoEntidadesService } from 'src/app/services/TextoEntidades.service';

@Component({
  selector: 'app-entities-drawer',
  templateUrl: './entities-drawer.component.html',
  styleUrls: [], // Removido, pois usamos Tailwind diretamente no HTML
  standalone: false
})
export class EntitiesDrawerComponent implements OnInit {
  @Input() textoOriginal: string = ''; // Recebe o texto do componente pai
  @Output() textoMarcadoChange = new EventEmitter<string>(); // Emite o texto marcado para o pai
  @Output() close = new EventEmitter<void>(); // Emite evento ao fechar o drawer

  textoMarcado: string;

  // Entidades completas
  dates: string[] = [];
  places: string[] = [];
  people: string[] = [];
  organizations: string[] = [];

  // Entidades exibidas (limitadas inicialmente)
  displayedDates: string[] = [];
  displayedPlaces: string[] = [];
  displayedPeople: string[] = [];
  displayedOrganizations: string[] = [];

  // Estados dos toggles
  datesEnabled: boolean = false;
  placesEnabled: boolean = false;
  peopleEnabled: boolean = false;
  organizationsEnabled: boolean = false;
  highlightAllCategories: boolean = false; // Novo estado para o toggle do rodapé

  private readonly displayLimit = 3; // Limite inicial de exibição

  constructor(private textoEntidadesService: TextoEntidadesService) {
    this.textoMarcado = this.textoOriginal;
  }

  ngOnInit(): void {
    // Obtém as entidades do serviço
    const entidades = this.textoEntidadesService.getEntidades();
    this.dates = entidades.datas;
    this.places = entidades.lugares;
    this.people = entidades.pessoas;
    this.organizations = entidades.organizacoes;

    // Limita as entidades exibidas inicialmente
    this.displayedDates = this.dates.slice(0, this.displayLimit);
    this.displayedPlaces = this.places.slice(0, this.displayLimit);
    this.displayedPeople = this.people.slice(0, this.displayLimit);
    this.displayedOrganizations = this.organizations.slice(0, this.displayLimit);

    // Inicializa o texto marcado com o texto original
    this.textoMarcado = this.textoOriginal;
    this.atualizarTextoMarcado(); // Aplica as substituições iniciais (se toggles estiverem ativados)
  }

  ngOnChanges(): void {
    this.textoMarcado = this.textoOriginal; // Atualiza textoMarcado quando o input muda
    this.atualizarTextoMarcado(); // Reaplica as substituições
  }

  atualizarTextoMarcado(): void {
    this.textoMarcado = this.textoEntidadesService.substituirEntidades({
      datas: this.datesEnabled,
      lugares: this.placesEnabled,
      pessoas: this.peopleEnabled,
      organizacoes: this.organizationsEnabled
    });
    this.textoMarcadoChange.emit(this.textoMarcado); // Emite o texto marcado para o pai
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
    this.close.emit(); // Emite evento para o pai fechar o drawer
    console.log('Close drawer emitted');
  }
  
}