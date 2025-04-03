import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TextoEntidadesService } from 'src/app/services/TextoEntidades.service';

@Component({
  selector: 'app-entities-drawer',
  templateUrl: './entities-drawer.component.html',
  styleUrls: ['./entities-drawer.component.css'],
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
  }

  toggleDates(): void {
    this.datesEnabled = !this.datesEnabled;
    this.atualizarTextoMarcado();
  }

  togglePlaces(): void {
    this.placesEnabled = !this.placesEnabled;
    this.atualizarTextoMarcado();
  }

  togglePeople(): void {
    this.peopleEnabled = !this.peopleEnabled;
    this.atualizarTextoMarcado();
  }

  toggleOrganizations(): void {
    this.organizationsEnabled = !this.organizationsEnabled;
    this.atualizarTextoMarcado();
  }

  showAllDates(event: Event): void {
    event.preventDefault();
    this.displayedDates = [...this.dates];
  }

  showAllPlaces(event: Event): void {
    event.preventDefault();
    this.displayedPlaces = [...this.places];
  }

  showAllPeople(event: Event): void {
    event.preventDefault();
    this.displayedPeople = [...this.people];
  }

  showAllOrganizations(event: Event): void {
    event.preventDefault();
    this.displayedOrganizations = [...this.organizations];
  }

  closeDrawer(): void {
    this.close.emit(); // Emite evento para o pai fechar o drawer
  }
}