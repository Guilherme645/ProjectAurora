// src/app/components/header-clipping/header-clipping.component.ts
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core'; // Adicione Input

@Component({
  selector: 'app-header-clipping',
  templateUrl: './header-clipping.component.html',
  standalone: false,
})
export class HeaderClippingComponent implements OnInit {
 
  @Output() saveClicked = new EventEmitter<void>();
  
  @Input() tituloMencao: string = '';
  @Output() tituloMencaoChange = new EventEmitter<string>();

  @Input() descricaoClipping: string = '';
  @Output() descricaoClippingChange = new EventEmitter<string>();

  @Output() sentimentoChange = new EventEmitter<string>();

  opcoesSentimento: string[] = ['Automático', 'Positivo', 'Neutro', 'Negativo'];
  sentimentoSelecionado: string = 'Automático';

  constructor() { }

  ngOnInit(): void { }

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
}