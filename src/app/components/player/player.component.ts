import { Component, ElementRef, HostListener, ViewChild, Output, EventEmitter, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { debounce } from 'lodash';
import { TextoEntidadesService } from 'src/app/services/TextoEntidades.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
  standalone: false
})
export class PlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() showEntitiesDrawer: boolean = false;
  isFloating = false;
  isPlaying = false;
  posterImage = 'assets/ultimato.png';
  videoDescription: string = '';
  entities: { dates: string[]; places: string[]; people: string[]; organizations: string[] } = {
    dates: [],
    places: [],
    people: [],
    organizations: []
  };
  showDates: boolean = true;
  showPlaces: boolean = true;
  showPeople: boolean = true;
  showOrganizations: boolean = true;
  highlightedDescription: string = '';
  errorMessage: string | null = null;
  private subscriptions = new Subscription();
  isMobile: boolean = false;

  @Output() descriptionEmitter = new EventEmitter<string>();
  @ViewChild('playerRef') playerRef!: ElementRef;
  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<HTMLVideoElement>;

  constructor(
    private el: ElementRef,
    private textoEntidadesService: TextoEntidadesService
  ) {
    this.onWindowScroll = debounce(this.onWindowScroll.bind(this), 50);
  }

  ngOnInit(): void {
    this.checkIfMobile();
    this.subscriptions.add(
      this.textoEntidadesService.getTextoOriginal().subscribe({
        next: (texto) => {
          this.videoDescription = texto;
          this.updateHighlightedDescription();
          this.descriptionEmitter.emit(this.highlightedDescription);
        },
        error: (error) => {
          console.error('Erro ao carregar descrição do vídeo:', error);
          this.errorMessage = 'Falha ao carregar a descrição do vídeo.';
        }
      })
    );

    this.subscriptions.add(
      this.textoEntidadesService.getEntidades().subscribe({
        next: (entities) => {
          this.entities = {
            dates: entities.datas || [],
            places: entities.lugares || [],
            people: entities.pessoas || [],
            organizations: entities.organizacoes || []
          };
          this.updateHighlightedDescription();
          this.descriptionEmitter.emit(this.highlightedDescription);
        },
        error: (error) => {
          console.error('Erro ao carregar entidades:', error);
          this.errorMessage = 'Falha ao carregar as entidades.';
        }
      })
    );
  }

  ngAfterViewInit(): void {
    // Verificar o vídeo após a view estar inicializada
    this.checkVideoAvailability();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  checkVideoAvailability(): void {
    if (!this.videoPlayer || !this.videoPlayer.nativeElement) {
      console.warn('videoPlayer não está disponível ainda.');
      return;
    }

    const videoElement = this.videoPlayer.nativeElement;
    videoElement.load();
    videoElement.onloadeddata = () => {
      console.log('Vídeo carregado com sucesso.');
    };
    videoElement.onerror = () => {
      console.error('Erro ao carregar o vídeo.');
      this.errorMessage = 'Falha ao carregar o vídeo. Verifique o arquivo em assets/avengers.mp4.';
    };
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkIfMobile();
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth < 768;
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const tolerance = 20;
    const header = document.querySelector('.header-wrapper .header-inner');
    const headerHeight = header ? header.getBoundingClientRect().height : 64;

    if (rect.top < -tolerance - headerHeight && !this.isFloating) {
      this.isFloating = true;
      this.resetPosition();
    } else if (rect.top >= -tolerance - headerHeight && this.isFloating) {
      this.isFloating = false;
      this.resetPosition();
    }
  }

  getFloatingStyles(): { [key: string]: string } {
    const styles: { [key: string]: string } = {
      ['bottom']: '16px',
      ['zIndex']: '40'
    };

    if (this.isMobile) {
      if (this.showEntitiesDrawer) {
        styles['right'] = '16px';
      } else {
        styles['right'] = '16px';
      }
    } else {
      if (this.showEntitiesDrawer) {
        styles['right'] = '400px';
      } else {
        styles['right'] = '16px';
      }
    }

    return styles;
  }

  togglePlay(): void {
    if (!this.videoPlayer || !this.videoPlayer.nativeElement) {
      console.warn('videoPlayer não está disponível para reprodução.');
      return;
    }

    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    if (this.isPlaying) {
      video.pause();
    } else {
      video.play().catch(error => {
        console.error('Erro ao reproduzir o vídeo:', error);
        this.errorMessage = 'Erro ao reproduzir o vídeo. Tente novamente.';
      });
    }
    this.isPlaying = !this.isPlaying;
  }

  private highlightEntities(text: string): string {
    if (!text) return '';
    let highlightedText = text;
    const highlight = (entity: string, className: string) => {
      const escapedEntity = entity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedEntity}\\b(?![^<]*>)`, 'gi');
      highlightedText = highlightedText.replace(regex, (match) => `<span class="${className}">${match}</span>`);
    };
    const allEntities: { entity: string; className: string }[] = [];
    if (this.showDates && this.entities.dates) {
      this.entities.dates.forEach(date => allEntities.push({ entity: date, className: 'highlight-date' }));
    }
    if (this.showPlaces && this.entities.places) {
      this.entities.places.forEach(place => allEntities.push({ entity: place, className: 'highlight-place' }));
    }
    if (this.showPeople && this.entities.people) {
      this.entities.people.forEach(person => allEntities.push({ entity: person, className: 'highlight-person' }));
    }
    if (this.showOrganizations && this.entities.organizations) {
      this.entities.organizations.forEach(org => allEntities.push({ entity: org, className: 'highlight-organization' }));
    }
    allEntities.sort((a, b) => b.entity.length - a.entity.length);
    allEntities.forEach(({ entity, className }) => highlight(entity, className));
    return highlightedText;
  }

  private updateHighlightedDescription(): void {
    this.highlightedDescription = this.highlightEntities(this.videoDescription);
    this.descriptionEmitter.emit(this.highlightedDescription);
  }

  private resetPosition(): void {
    const element = this.playerRef?.nativeElement;
    if (element?.style) {
      element.style.transform = 'translate3d(0px, 0px, 0px)';
      element.style.left = '';
      element.style.top = '';
    }
  }
}