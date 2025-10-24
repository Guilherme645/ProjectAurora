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

  // Texto padrão que deve ser considerado como "sem título"
  readonly defaultTitleText = 'Insira o título da menção';

  constructor() { }

  // --- ALTERADO ---
  ngOnInit() {
    // Verifica se não há título e pré-seleciona 'rascunho'
    if (this.hasNoTitle()) {
      this.opcaoSelecionada = 'rascunho';
    }
  }

  /**
   * Helper privado para centralizar a lógica de verificação de título.
   */
  private hasNoTitle(): boolean {
    return !this.clippingData.titulo ||
           this.clippingData.titulo.trim() === '' ||
           this.clippingData.titulo === this.defaultTitleText;
  }

  /**
   * Define a opção selecionada e esconde qualquer mensagem de erro anterior.
   */
  selecionarOpcao(opcao: 'rascunho' | 'clipping'): void {
    // --- ALTERADO ---
    // Impede a seleção de 'clipping' se não houver título
    if (opcao === 'clipping' && this.hasNoTitle()) {
      return; // Não faz nada se tentar selecionar clipping sem título
    }
    // --- FIM DA ALTERAÇÃO ---

    this.opcaoSelecionada = opcao;
    this.showTitleError = false;
  }
  
  /**
   * Retorna as classes CSS dinâmicas para os cards com base na seleção.
   */
  getCardClasses(cardType: 'rascunho' | 'clipping'): any {
    // --- LÓGICA SUBSTITUÍDA ---
    const isDisabled = (cardType === 'clipping' && this.hasNoTitle());
    const isSelected = (this.opcaoSelecionada === cardType);

    if (isDisabled) {
      // 1. Estado Desabilitado (apenas para 'clipping' sem título)
      return 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed';
    }

    if (isSelected) {
      // 2. Estado Selecionado (borda mais forte para destacar)
      return 'border-gray-800 border-2 bg-white text-gray-900';
    }

    // 3. Estado Padrão (não selecionado, não desabilitado)
    return 'border-gray-200 bg-white text-gray-800 hover:border-gray-300';
  }

  /**
   * Valida o título e avança para a tela de revisão apropriada.
   */
  continuar(): void {
    if (!this.opcaoSelecionada) return;

    // --- LÓGICA SUBSTITUÍDA ---

    // 1. Apenas valide o título se a opção for 'clipping'.
    //    Rascunhos são permitidos sem título.
    if (this.opcaoSelecionada === 'clipping') {
      if (this.hasNoTitle()) {
        this.showTitleError = true;
        return; // Interrompe a função
      }
    }

    // 2. Se a validação passou (ou não foi necessária), esconda o erro e avance
    this.showTitleError = false; 
    
    if (this.opcaoSelecionada === 'rascunho') {
      this.modalState = 'review_draft';
    } else {
      // Se chegou aqui, é 'clipping' E tem um título válido
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