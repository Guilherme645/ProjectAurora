import { Component, OnInit, HostBinding, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EntitiesService } from 'src/app/services/entities.service';

interface Entities {
  dates: string[];
  places: string[];
  people: string[];
  organizations: string[];
}

@Component({
  selector: 'app-page-mention-detail',
  templateUrl: './page-mention-detail.component.html',
  styleUrls: ['./page-mention-detail.component.css'],
  standalone: false
})
export class PageMentionDetailComponent implements OnInit, OnDestroy {
  noticias: any[] = [];
  filteredNoticias: any[] = [];
  isMobile: boolean = false;
  isSidebarOpen: boolean = true;
  allSelected: boolean = false;
  currentUser: string = 'Superior Tribunal Federal';
  selectedTab: string = 'todos';
  selectedOption: string = 'Mais relevantes';
  isDropdownOpen: boolean = false;
  selectedMentionsCount: number = 0;
  showScrollTop: boolean = false;
  showScrollTopButton: boolean = false;
  isSearchOpen = false;
  page: number = 1;
  pageSize: number = 10;
  isLoading: boolean = false;
  hasMoreData: boolean = true;
  videoDescription: SafeHtml = '';
  showEntitiesDrawer: boolean = false;

  // Estado dos toggles
  showDates: boolean = true;
  showPlaces: boolean = true;
  showPeople: boolean = true;
  showOrganizations: boolean = true;

  // Entidades
  entities: Entities = {
    dates: [],
    places: [],
    people: [],
    organizations: []
  };

  // Subscriptions para gerenciar unsubscribes
  private entitiesSubscription: Subscription | undefined;
  private toggleStateSubscription: Subscription | undefined;

  @HostBinding('class.show-entities-drawer')
  get isEntitiesDrawerOpen() {
    return this.showEntitiesDrawer;
  }

  constructor(
    private entitiesService: EntitiesService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();

    // Inscrever-se nas entidades
    this.entitiesSubscription = this.entitiesService.entities$.subscribe(entities => {
      this.entities = entities;
      console.log('Entidades atualizadas no PageMentionDetailComponent:', this.entities);
    });

    // Inscrever-se nos estados dos toggles
    this.toggleStateSubscription = this.entitiesService.toggleState$.subscribe(toggleState => {
      this.showDates = toggleState.showDates;
      this.showPlaces = toggleState.showPlaces;
      this.showPeople = toggleState.showPeople;
      this.showOrganizations = toggleState.showOrganizations;
      console.log('Toggles atualizados:', toggleState);
    });
  }

  ngOnDestroy(): void {
    if (this.entitiesSubscription) {
      this.entitiesSubscription.unsubscribe();
    }
    if (this.toggleStateSubscription) {
      this.toggleStateSubscription.unsubscribe();
    }
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  onDescriptionReceived(description: string): void {
    console.log('Descrição recebida (já marcada):', description);
    this.videoDescription = this.sanitizer.bypassSecurityTrustHtml(description);
  }
  

  onUserChange(user: string) {
    this.currentUser = user;
  }

  onSidebarToggled(isOpen: boolean): void {
    this.isSidebarOpen = isOpen;
  }

  verEntidadesExtraidas(): void {
    this.showEntitiesDrawer = !this.showEntitiesDrawer;
    if (this.showEntitiesDrawer) {
      this.isSidebarOpen = false;
    } else {
      this.isSidebarOpen = true;
    }
  }
}