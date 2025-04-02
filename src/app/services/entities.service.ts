import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface Entities {
  dates: string[];
  places: string[];
  people: string[];
  organizations: string[];
}

interface ToggleState {
  showDates: boolean;
  showPlaces: boolean;
  showPeople: boolean;
  showOrganizations: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EntitiesService {
  private entities: Entities = {
    dates: ['Janeiro', 'Dezembro', '2024', 'Sexta-feira', 'nove minutos', '10 vezes'],
    places: [
      'Brasil', 'Esplanada dos Ministérios', 'Praça dos Três Poderes', 'Palácio da Alvorada',
      'União', 'Estúdio I'
    ],
    people: [
      'Jair Bolsonaro', 'Mauro Cid', 'Cid', 'Diles Tofolli', 'Rosa Weber',
      'Alexandre de Moraes', 'Braga Netto', 'César Bittencourt', 'Lula', 'Alckmin'
    ],
    organizations: [
      'Ministério da Defesa', 'GloboNews', 'STF', 'Força Aérea Brasileira',
      'Exército', 'Marinha', 'Estado-Maior', 'ONU', 'Supremo Tribunal Federal',
      'Polícia Federal'
    ]
  };

  private toggleState: ToggleState = {
    showDates: true,
    showPlaces: true,
    showPeople: true,
    showOrganizations: true
  };

  private entitiesSubject = new BehaviorSubject<Entities>(this.entities);
  private toggleStateSubject = new BehaviorSubject<ToggleState>(this.toggleState);

  entities$: Observable<Entities> = this.entitiesSubject.asObservable();
  toggleState$: Observable<ToggleState> = this.toggleStateSubject.asObservable();

  constructor() {
    console.log('EntitiesService inicializado com toggles:', this.toggleState);
  }

  updateEntities(entities: Entities): void {
    this.entities = { ...entities };
    this.entitiesSubject.next(this.entities);
  }

  toggleDates(enabled: boolean): void {
    console.log('Atualizando showDates para:', enabled);
    this.toggleState.showDates = enabled;
    this.toggleStateSubject.next({ ...this.toggleState });
  }

  togglePlaces(enabled: boolean): void {
    console.log('Atualizando showPlaces para:', enabled);
    this.toggleState.showPlaces = enabled;
    this.toggleStateSubject.next({ ...this.toggleState });
  }

  togglePeople(enabled: boolean): void {
    console.log('Atualizando showPeople para:', enabled);
    this.toggleState.showPeople = enabled;
    this.toggleStateSubject.next({ ...this.toggleState });
  }

  toggleOrganizations(enabled: boolean): void {
    console.log('Atualizando showOrganizations para:', enabled);
    this.toggleState.showOrganizations = enabled;
    this.toggleStateSubject.next({ ...this.toggleState });
  }

  getInitialEntities(): Entities {
    return { ...this.entities };
  }

  getInitialToggleState(): ToggleState {
    return { ...this.toggleState };
  }
}