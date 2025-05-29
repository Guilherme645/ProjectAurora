import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-clipping',
  templateUrl: './header-clipping.component.html',
  styleUrls: ['./header-clipping.component.css'],
  standalone: false
})
export class HeaderClippingComponent implements OnInit {
tituloMencao: string = '';
  descricaoClipping: string = '';

  opcoesSentimento: string[] = ['Automático', 'Positivo', 'Neutro', 'Negativo'];
  sentimentoSelecionado: string = 'Automático';

  constructor(private elRef: ElementRef) { }

  ngOnInit(): void {
    if (!this.tituloMencao) {
      this.tituloMencao = "";
    }
    if (!this.descricaoClipping) {
      this.descricaoClipping = "";
    }
  }

  ngAfterViewInit(): void {
    // Este é um bom lugar para qualquer lógica que precise ser executada
    // após a view do componente ter sido completamente inicializada.
    // Se a inicialização global do Preline (via script em angular.json ou index.html)
    // for suficiente, você pode não precisar de código específico aqui.
  }

  selecionarSentimento(sentimento: string): void {
    this.sentimentoSelecionado = sentimento;
    // A lógica para fechar o dropdown do Preline agora dependerá
    // principalmente do atributo 'data-hs-dropdown-auto-close="inside"'
    // no elemento HTML do dropdown, que instrui o Preline a fechar
    // o menu quando um item interno é clicado.
  }

  onTituloChange(): void {
    // Você pode adicionar lógica aqui se algo precisar acontecer
    // imediatamente quando o título é alterado.
  }

  onDescricaoChange(): void {
    // Você pode adicionar lógica aqui se algo precisar acontecer
    // imediatamente quando a descrição é alterada.
  }
}