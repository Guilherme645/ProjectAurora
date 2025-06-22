import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-header-clipping',
  templateUrl: './header-clipping.component.html',
  standalone: false,
})
export class HeaderClippingComponent implements OnInit {
  
  // --- Entradas e Saídas (Inputs/Outputs) ---
  @Output() saveClicked = new EventEmitter<void>();
  
  @Input() tituloMencao: string = '';
  @Output() tituloMencaoChange = new EventEmitter<string>();

  @Input() descricaoClipping: string = '';
  @Output() descricaoClippingChange = new EventEmitter<string>();

  @Output() sentimentoChange = new EventEmitter<string>();

  // NOVO: Limites de caracteres configuráveis
  @Input() titleCharLimit: number = 100;
  @Input() descriptionCharLimit: number = 250;

  // --- Propriedades do Componente ---
  opcoesSentimento: string[] = ['Automático', 'Positivo', 'Neutro', 'Negativo'];
  sentimentoSelecionado: string = 'Automático';

  readonly defaultTitleText = 'Insira o título da menção';
  readonly defaultDescriptionText = 'Adicione uma descrição ao clipping';

  constructor() { }

  ngOnInit(): void { }

  // --- Lógica de Eventos ---
  onSaveEditionsClick(): void {
    this.saveClicked.emit();
  }

  selecionarSentimento(sentimento: string): void {
    this.sentimentoSelecionado = sentimento;
    this.sentimentoChange.emit(this.sentimentoSelecionado);
  }

  onTituloChange(): void {
    this.tituloMencaoChange.emit(this.tituloMencao);
  }

  onDescricaoChange(): void {
    this.descricaoClippingChange.emit(this.descricaoClipping);
  }

  // NOVO: Limpa o campo de título se ele contiver o texto padrão
  onTitleFocus(): void {
    if (this.tituloMencao === this.defaultTitleText) {
      this.tituloMencao = '';
      this.onTituloChange();
    }
  }

  // NOVO: Limpa o campo de descrição se ele contiver o texto padrão
 onDescriptionFocus(): void {
    if (this.descricaoClipping === this.defaultDescriptionText) {
      this.descricaoClipping = '';
      this.onDescricaoChange();
    }
  }
  
 onTitleBlur(): void {
    // Se o campo estiver vazio, restaura o texto padrão
    if (!this.tituloMencao || this.tituloMencao.trim() === '') {
      this.tituloMencao = this.defaultTitleText;
      this.onTituloChange();
    }
  }

  onDescriptionBlur(): void {
    // Se o campo estiver vazio, restaura o texto padrão
    if (!this.descricaoClipping || this.descricaoClipping.trim() === '') {
      this.descricaoClipping = this.defaultDescriptionText;
      this.onDescricaoChange();
    }
  }

  // NOVO: Faz o textarea crescer com o conteúdo
  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Reseta a altura
    textarea.style.height = `${textarea.scrollHeight}px`; // Define a altura com base no conteúdo
  }
  
}