import { Component, ElementRef, HostListener, ViewChild, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { debounce } from 'lodash';
import { TextoEntidadesService } from 'src/app/services/TextoEntidades.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
  standalone: false
})
export class PlayerComponent implements OnInit, OnDestroy {
  isFloating = false;
  isPlaying = false;
  posterImage = 'assets/thumb.png';
  videoDescription: string = ''; // Inicialmente vazio, será preenchido pelo serviço

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

  @Output() descriptionEmitter = new EventEmitter<string>();

  @ViewChild('playerRef') playerRef!: ElementRef;
  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<HTMLVideoElement>;

  constructor(
    private el: ElementRef,
    private textoEntidadesService: TextoEntidadesService
  ) {
    this.onWindowScroll = debounce(this.onWindowScroll.bind(this), 100);
  }

  ngOnInit(): void {
    // Obtém o texto original do serviço, como o DescricaoComponent fazia
    this.videoDescription = this.textoEntidadesService.getTextoOriginal();

    // Obtém as entidades do serviço

    // Inicializa a descrição destacada
    this.updateHighlightedDescription();
    this.descriptionEmitter.emit(this.highlightedDescription);
  }

  ngOnDestroy(): void {
    // Não há subscrições para desinscrever, mas mantive o método por consistência
  }

  private highlightEntities(text: string): string {
    if (!text) return '';

    let highlightedText = text;

    // Função de destaque
    const highlight = (entity: string, className: string) => {
      const escapedEntity = entity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escapar caracteres especiais
      const regex = new RegExp(`\\b${escapedEntity}\\b(?![^<]*>)`, 'gi'); // Evitar marcar dentro de outras tags
      highlightedText = highlightedText.replace(regex, (match) => `<span class="${className}">${match}</span>`);
    };

    // Definir as entidades a serem destacadas
    const allEntities: { entity: string; className: string }[] = [];

    if (this.showDates && this.entities.dates) {
      this.entities.dates.forEach(date => {
        allEntities.push({ entity: date, className: 'highlight-date' });
      });
    }
    if (this.showPlaces && this.entities.places) {
      this.entities.places.forEach(place => {
        allEntities.push({ entity: place, className: 'highlight-place' });
      });
    }
    if (this.showPeople && this.entities.people) {
      this.entities.people.forEach(person => {
        allEntities.push({ entity: person, className: 'highlight-person' });
      });
    }
    if (this.showOrganizations && this.entities.organizations) {
      this.entities.organizations.forEach(org => {
        allEntities.push({ entity: org, className: 'highlight-organization' });
      });
    }

    // Ordenar entidades por comprimento (para destacar primeiro as maiores)
    allEntities.sort((a, b) => b.entity.length - a.entity.length);

    // Aplicar o destaque nas entidades
    allEntities.forEach(({ entity, className }) => {
      highlight(entity, className);
    });

    return highlightedText;
  }

  private updateHighlightedDescription(): void {
    this.highlightedDescription = this.highlightEntities(this.videoDescription);
    this.descriptionEmitter.emit(this.highlightedDescription); // Emitir a descrição atualizada com destaque
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const tolerance = 50;
    const headerHeight = 64;

    if (rect.top < -tolerance - headerHeight && !this.isFloating) {
      this.isFloating = true;
      this.resetPosition();
    } else if (rect.top >= -tolerance - headerHeight && this.isFloating) {
      this.isFloating = false;
      this.resetPosition();
    }
  }

  togglePlay(): void {
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    if (this.isPlaying) {
      video.pause();
    } else {
      video.play().catch(error => {
        console.error('Erro ao reproduzir o vídeo:', error);
      });
    }
    this.isPlaying = !this.isPlaying;
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