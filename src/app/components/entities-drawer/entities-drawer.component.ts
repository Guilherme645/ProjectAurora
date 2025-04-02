import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { EntitiesService } from 'src/app/services/entities.service';

@Component({
  selector: 'app-entities-drawer',
  templateUrl: './entities-drawer.component.html',
  styleUrls: ['./entities-drawer.component.css'],
  standalone: false
})
export class EntitiesDrawerComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  dates: string[] = [];
  places: string[] = [];
  people: string[] = [];
  organizations: string[] = [];

  displayedDates: string[] = [];
  displayedPlaces: string[] = [];
  displayedPeople: string[] = [];
  displayedOrganizations: string[] = [];

  datesEnabled: boolean = true;
  placesEnabled: boolean = true;
  peopleEnabled: boolean = true;
  organizationsEnabled: boolean = true;

  private readonly displayLimit = 3;

  constructor(private entitiesService: EntitiesService) {}

  ngOnInit(): void {
    const initialEntities = this.entitiesService.getInitialEntities();
    this.dates = initialEntities.dates;
    this.places = initialEntities.places;
    this.people = initialEntities.people;
    this.organizations = initialEntities.organizations;
  
    const initialToggleState = this.entitiesService.getInitialToggleState();
    this.datesEnabled = initialToggleState.showDates;
    this.placesEnabled = initialToggleState.showPlaces;
    this.peopleEnabled = initialToggleState.showPeople;
    this.organizationsEnabled = initialToggleState.showOrganizations;
  
    console.log('EntitiesDrawerComponent inicializado com toggles:', {
      datesEnabled: this.datesEnabled,
      placesEnabled: this.placesEnabled,
      peopleEnabled: this.peopleEnabled,
      organizationsEnabled: this.organizationsEnabled
    });
  
    // Forçar os toggles iniciais no serviço
    this.entitiesService.toggleDates(this.datesEnabled);
    this.entitiesService.togglePlaces(this.placesEnabled);
    this.entitiesService.togglePeople(this.peopleEnabled);
    this.entitiesService.toggleOrganizations(this.organizationsEnabled);
  
    this.displayedDates = this.dates.slice(0, this.displayLimit);
    this.displayedPlaces = this.places.slice(0, this.displayLimit);
    this.displayedPeople = this.people.slice(0, this.displayLimit);
    this.displayedOrganizations = this.organizations.slice(0, this.displayLimit);
  
    this.entitiesService.updateEntities({
      dates: this.dates,
      places: this.places,
      people: this.people,
      organizations: this.organizations
    });
  }

  toggleDates(): void {
    this.datesEnabled = !this.datesEnabled;
    this.entitiesService.toggleDates(this.datesEnabled);
  }

  togglePlaces(): void {
    this.placesEnabled = !this.placesEnabled;
    this.entitiesService.togglePlaces(this.placesEnabled);
  }

  togglePeople(): void {
    this.peopleEnabled = !this.peopleEnabled;
    this.entitiesService.togglePeople(this.peopleEnabled);
  }

  toggleOrganizations(): void {
    this.organizationsEnabled = !this.organizationsEnabled;
    this.entitiesService.toggleOrganizations(this.organizationsEnabled);
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
    this.close.emit();
  }
}