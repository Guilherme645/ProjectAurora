import { Component, ElementRef, HostListener, ViewChild, Output, EventEmitter, OnInit } from '@angular/core';
import { debounce } from 'lodash';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
  standalone: false
})
export class PlayerComponent implements OnInit {
  isFloating = false;
  isPlaying = false;
  posterImage = 'assets/thumb.png'; // Caminho da imagem de miniatura
  videoDescription: string = `
    A entrevista de César Bittencourt foi exibida ao Estúdio I, da GloboNews, quando ele disse que o ex-presidente sabia do plano para executar o presidente Lula, o vice Alckmin e o ministro Alexandre de Moraes, do Supremo Tribunal Federal (STF), e deputados. A entrevista de César Bittencourt foi exibida ao Estúdio I, da GloboNews, quando ele disse que o ex-presidente sabia do plano de assassinato de autoridades, a conexão entre ele, nove minutos depois, o advogado retornou a entrevista e recuou do que havia afirmado.

    Segundo pessoas envolvidas na investigação ouvidas pelo blog, as falas de Bittencourt geraram dúvidas entre os investigadores, e por isso, decidiram ouvir Cid novamente.

    As informações da delação, porém, não são consideradas "bala de prata" pelos agentes porque desde as primeiras atividades, Cid revela mais ou menos o que a polícia já sabe. Alguns detalhes mais importantes, por exemplo, vieram a partir do celular dele, que foi apreendido durante o inquérito dos cartões de vacinação falsos.

    Cid já foi ouvido mais de 10 vezes ao longo das investigações sobre possíveis irregularidades cometidas na gestão Bolsonaro.

    Por isso, pessoas próximas à investigação contam ao blog que a delação de Cid não é limite de não entregar muitos promissores sobre o que os envolvidos na tentativa de golpe de Estado fizeram, fornecendo o mínimo necessário para cumprir a acordo e garantir uma pena mais baixa.
 
    A entrevista de César Bittencourt foi exibida ao Estúdio I, da GloboNews, quando ele disse que o ex-presidente sabia do plano para executar o presidente Lula, o vice Alckmin e o ministro Alexandre de Moraes, do Supremo Tribunal Federal (STF), e deputados. A entrevista de César Bittencourt foi exibida ao Estúdio I, da GloboNews, quando ele disse que o ex-presidente sabia do plano de assassinato de autoridades, a conexão entre ele, nove minutos depois, o advogado retornou a entrevista e recuou do que havia afirmado.

    Segundo pessoas envolvidas na investigação ouvidas pelo blog, as falas de Bittencourt geraram dúvidas entre os investigadores, e por isso, decidiram ouvir Cid novamente.

    As informações da delação, porém, não são consideradas "bala de prata" pelos agentes porque desde as primeiras atividades, Cid revela mais ou menos o que a polícia já sabe. Alguns detalhes mais importantes, por exemplo, vieram a partir do celular dele, que foi apreendido durante o inquérito dos cartões de vacinação falsos.

    Cid já foi ouvido mais de 10 vezes ao longo das investigações sobre possíveis irregularidades cometidas na gestão Bolsonaro.

    Por isso, pessoas próximas à investigação contam ao blog que a delação de Cid não é limite de não entregar muitos promissores sobre o que os envolvidos na tentativa de golpe de Estado fizeram, fornecendo o mínimo necessário para cumprir a acordo e garantir uma pena mais baixa.
  `;

  @Output() descriptionEmitter = new EventEmitter<string>();

  @ViewChild('playerRef') playerRef!: ElementRef;
  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<HTMLVideoElement>;

  constructor(private el: ElementRef) {
    this.onWindowScroll = debounce(this.onWindowScroll.bind(this), 100);
  }

  ngOnInit(): void {
    this.descriptionEmitter.emit(this.videoDescription);
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