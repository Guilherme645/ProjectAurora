import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-entities-drawer',
  templateUrl: './entities-drawer.component.html',
  styleUrls: ['./entities-drawer.component.css'],
  standalone: false
})
export class EntitiesDrawerComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  // Dados
  dates: string[] = ['Janeiro', 'Dezembro', '2024', 'Sexta-feira'];
  places: string[] = [
    'Brasil', 'Esplanada dos Ministérios', 'Praça dos Três Poderes', 'Palácio da Alvorada',
    'União', 'Estúdio I'
  ];
  people: string[] = [
    'Jair Bolsonaro', 'Mauro Cid', 'Diles Tofolli', 'Rosa Weber',
    'Alexandre de Moraes', 'Braga Netto'
  ];
  organizations: string[] = [
    'Ministério da Defesa', 'GloboNews', 'STF', 'Força Aérea Brasileira',
    'Exército', 'Marinha', 'Estado-Maior', 'ONU'
  ];

  // Dados exibidos (limitados inicialmente)
  displayedDates: string[] = [];
  displayedPlaces: string[] = [];
  displayedPeople: string[] = [];
  displayedOrganizations: string[] = [];

  // Estado dos toggles
  datesEnabled = true;
  placesEnabled = true;
  peopleEnabled = true;
  organizationsEnabled = true;

  // Limite inicial de itens exibidos
  private readonly displayLimit = 3;

  ngOnInit(): void {
    // Inicializa os dados exibidos com o limite
    this.displayedDates = this.dates.slice(0, this.displayLimit);
    this.displayedPlaces = this.places.slice(0, this.displayLimit);
    this.displayedPeople = this.people.slice(0, this.displayLimit);
    this.displayedOrganizations = this.organizations.slice(0, this.displayLimit);
  }

  // Funções para os toggles
  toggleDates(): void {
    console.log('Datas enabled:', this.datesEnabled);
  }

  togglePlaces(): void {
    console.log('Places enabled:', this.placesEnabled);
  }

  togglePeople(): void {
    console.log('People enabled:', this.peopleEnabled);
  }

  toggleOrganizations(): void {
    console.log('Organizations enabled:', this.organizationsEnabled);
  }

  // Funções para "Ver todos"
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

  // Função para fechar o drawer
  closeDrawer(): void {
    this.close.emit();
  }
}