
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-base-modal',
  templateUrl: './base-modal.component.html',
  styleUrls: ['./base-modal.component.css'],
  standalone: false,
})
export class BaseModalComponent {
  @Input() showDefaultActions = true;
  @Input() confirmLabel = 'Criar cliente'; 
  @Input() loadingLabel = 'Carregando...';
  @Input() confirmDisabled = false;
  @Input() loading = false;
  
  // Evento para a ação de cancelar
  @Output() cancel = new EventEmitter<void>();

  // Evento para o próximo passo no formulário (ex: Continuar)
  @Output() nextStep = new EventEmitter<void>();

  // Adicionado: Evento para a ação final de confirmação (ex: Criar colaborador)
  @Output() confirm = new EventEmitter<void>(); 

  // Novo método que decide qual evento emitir com base no rótulo do botão
  onButtonClick(): void {
    if (this.confirmLabel === 'Continuar') {
      this.nextStep.emit();
    } else {
      this.confirm.emit();
    }
  }
}
