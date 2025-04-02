import { Component, ElementRef, HostListener, ViewChild, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { debounce } from 'lodash';
import { Subscription } from 'rxjs';
import { EntitiesService } from 'src/app/services/entities.service';

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
  videoDescription: string = `A entrevista de <span class="highlight-person">César Bittencourt</span> foi exibida ao <span class="highlight-place">Estúdio I</span>, da <span class="highlight-organization">GloboNews</span>, quando ele disse que <span class="highlight-person">Jair Bolsonaro</span> sabia do plano para executar o presidente <span class="highlight-person">Lula</span>, o vice <span class="highlight-person">Alckmin</span> e o ministro <span class="highlight-person">Alexandre de Moraes</span>, do <span class="highlight-organization">Supremo Tribunal Federal</span> (<span class="highlight-organization">STF</span>), e deputados. A entrevista de <span class="highlight-person">César Bittencourt</span> foi exibida ao <span class="highlight-place">Estúdio I</span>, da <span class="highlight-organization">GloboNews</span>, quando ele disse que <span class="highlight-person">Jair Bolsonaro</span> sabia do plano de assassinato de autoridades, a conexão entre ele, <span class="highlight-date">nove minutos</span> depois, o advogado retornou a entrevista e recuou do que havia afirmado.

Segundo pessoas envolvidas na investigação ouvidas pelo blog, as falas de Bittencourt geraram dúvidas entre os investigadores, e por isso, decidiram ouvir <span class="highlight-person">Cid</span> novamente.

As informações da delação, porém, não são consideradas "bala de prata" pelos agentes porque desde as primeiras atividades, <span class="highlight-person">Cid</span> revela mais ou menos o que a <span class="highlight-organization">Polícia Federal</span> já sabe. Alguns detalhes mais importantes, por exemplo, vieram a partir do celular dele, que foi apreendido durante o inquérito dos cartões de vacinação falsos.

<span class="highlight-person">Cid</span> já foi ouvido mais de <span class="highlight-date">10 vezes</span> ao longo das investigações sobre possíveis irregularidades cometidas na gestão Bolsonaro.

Por isso, pessoas próximas à investigação contam ao blog que a delação de <span class="highlight-person">Cid</span> não é limite de não entregar muitos promissores sobre o que os envolvidos na tentativa de golpe de Estado fizeram, fornecendo o mínimo necessário para cumprir a acordo e garantir uma pena mais baixa.A entrevista de <span class="highlight-person">César Bittencourt</span> foi exibida ao <span class="highlight-place">Estúdio I</span>, da <span class="highlight-organization">GloboNews</span>, quando ele disse que <span class="highlight-person">Jair Bolsonaro</span> sabia do plano para executar o presidente <span class="highlight-person">Lula</span>, o vice <span class="highlight-person">Alckmin</span> e o ministro <span class="highlight-person">Alexandre de Moraes</span>, do <span class="highlight-organization">Supremo Tribunal Federal</span> (<span class="highlight-organization">STF</span>), e deputados. A entrevista de <span class="highlight-person">César Bittencourt</span> foi exibida ao <span class="highlight-place">Estúdio I</span>, da <span class="highlight-organization">GloboNews</span>, quando ele disse que <span class="highlight-person">Jair Bolsonaro</span> sabia do plano de assassinato de autoridades, a conexão entre ele, <span class="highlight-date">nove minutos</span> depois, o advogado retornou a entrevista e recuou do que havia afirmado.

Segundo pessoas envolvidas na investigação ouvidas pelo blog, as falas de Bittencourt geraram dúvidas entre os investigadores, e por isso, decidiram ouvir <span class="highlight-person">Cid</span> novamente.

As informações da delação, porém, não são consideradas "bala de prata" pelos agentes porque desde as primeiras atividades, <span class="highlight-person">Cid</span> revela mais ou menos o que a <span class="highlight-organization">Polícia Federal</span> já sabe. Alguns detalhes mais importantes, por exemplo, vieram a partir do celular dele, que foi apreendido durante o inquérito dos cartões de vacinação falsos.

<span class="highlight-person">Cid</span> já foi ouvido mais de <span class="highlight-date">10 vezes</span> ao longo das investigações sobre possíveis irregularidades cometidas na gestão Bolsonaro.

Por isso, pessoas próximas à investigação contam ao blog que a delação de <span class="highlight-person">Cid</span> não é limite de não entregar muitos promissores sobre o que os envolvidos na tentativa de golpe de Estado fizeram, fornecendo o mínimo necessário para cumprir a acordo e garantir uma pena mais baixa.`;

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

  private entitiesSubscription: Subscription | undefined;
  private toggleStateSubscription: Subscription | undefined;

  constructor(
    private el: ElementRef,
    private entitiesService: EntitiesService
  ) {
    this.onWindowScroll = debounce(this.onWindowScroll.bind(this), 100);
  }

  ngOnInit(): void {
    this.entitiesSubscription = this.entitiesService.entities$.subscribe(entities => {
      console.log('Entidades recebidas no PlayerComponent:', entities);
      this.entities = entities;
      this.updateHighlightedDescription();
      this.descriptionEmitter.emit(this.highlightedDescription);
    });

    this.toggleStateSubscription = this.entitiesService.toggleState$.subscribe(toggleState => {
      console.log('Toggles recebidos no PlayerComponent:', JSON.stringify(toggleState));
      this.showDates = toggleState.showDates;
      this.showPlaces = toggleState.showPlaces;
      this.showPeople = toggleState.showPeople;
      this.showOrganizations = toggleState.showOrganizations;
      this.updateHighlightedDescription();
      this.descriptionEmitter.emit(this.highlightedDescription);
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