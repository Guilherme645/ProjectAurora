import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';

// Interface para garantir que os dados recebidos tenham o formato correto
interface ClippingData {
  titulo: string;
  descricao: string;
  sentimento: string;
}

@Component({
  selector: 'app-save-clipping-modal',
  templateUrl: './save-clipping-modal.component.html',
  standalone: false,
})
export class SaveClippingModalComponent implements OnInit {

  /**
   * Recebe o objeto completo com os dados do clipping do componente pai.
   */
  @Input() clippingData: ClippingData = { titulo: '', descricao: '', sentimento: 'Automático' };
  
  /**
   * Evento para notificar o componente pai que o modal deve ser fechado.
   */
  @Output() close = new EventEmitter<void>();

  /**
   * Controla qual das três telas do modal é exibida.
   * Inicia na tela de 'selection'.
   */
  modalState: 'selection' | 'review_draft' | 'review_clipping' = 'selection';
  
  // Armazena a opção que o usuário selecionou ('rascunho' ou 'clipping')
  opcaoSelecionada: 'rascunho' | 'clipping' | null = null;
  
  // Controla a exibição da mensagem de erro de título
  showTitleError = false;

  constructor() { }

  ngOnInit() { }

  /**
   * Define a opção selecionada e esconde qualquer mensagem de erro anterior.
   */
  selecionarOpcao(opcao: 'rascunho' | 'clipping'): void {
    this.opcaoSelecionada = opcao;
    this.showTitleError = false;
  }
  
  /**
   * Retorna as classes CSS dinâmicas para os cards com base na seleção.
   */
  getCardClasses(cardType: 'rascunho' | 'clipping'): any {
    if (!this.opcaoSelecionada) {
      return 'border-gray-200 bg-white text-gray-800 hover:border-gray-300';
    }
    if (this.opcaoSelecionada === cardType) {
      return 'border-gray-200 border-2 bg-white text-gray-900 ';
    }
    else {
      return 'border-gray-200 bg-white text-gray-400 hover:border-gray-300';
    }
  }
readonly defaultTitleText = 'Insira o título da menção';

  /**
   * Valida o título e avança para a tela de revisão apropriada.
   */
continuar(): void {
  if (!this.opcaoSelecionada) return;

  // --- CONDIÇÃO CORRIGIDA ---
  // Verifica se o título é nulo, vazio, só tem espaços OU se ainda é o texto padrão.
  if (
    !this.clippingData.titulo ||
    this.clippingData.titulo.trim() === '' ||
    this.clippingData.titulo === this.defaultTitleText // <-- ADICIONE ESTA LINHA
  ) {
    this.showTitleError = true;
    return; // Interrompe a função aqui
  }

  // Se a validação passar, continua para a próxima tela
  this.showTitleError = false; // Garante que o erro seja escondido se o usuário corrigir
  if (this.opcaoSelecionada === 'rascunho') {
    this.modalState = 'review_draft';
  } else {
    this.modalState = 'review_clipping';
  }
}
  /**
   * Ação final para salvar o clipping e fechar o modal.
   */
  finalSubmitClipping(): void {
    console.log('Subindo Clipping final...', this.clippingData);
    this.closeModal();
  }

  /**
   * Ação final para salvar o rascunho e fechar o modal.
   */
  finalSaveDraft(): void {
    console.log('Salvando como Rascunho...', this.clippingData);
    this.closeModal();
  }

  /**
   * Retorna o modal para a tela inicial de seleção.
   */
  goBackToSelection(): void {
    this.modalState = 'selection';
  }

  /**
   * Emite o evento para fechar o modal.
   */
  closeModal(): void {
    this.close.emit();
  }
}