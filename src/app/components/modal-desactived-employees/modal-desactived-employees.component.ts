import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChipColor } from '../chips/chips.component';

@Component({
  selector: 'app-modal-desactived-employees',
  templateUrl: './modal-desactived-employees.component.html',
  styleUrls: ['./modal-desactived-employees.component.css'],
  standalone: false,
})
export class ModalDesactivedEmployeesComponent {
  @Input() collaboratorName: string | undefined;
  @Input() collaboratorEmail: string | undefined;
  @Input() collaboratorUserType: string | undefined;

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  get title(): string {
    return 'Desativar colaborador';
  }

  get confirmText(): string {
    return 'Desativar colaborador';
  }

  /**
   * 👇 2. ADICIONE ESTA FUNÇÃO
   * Converte o tipo de usuário para a cor correspondente do chip.
   * @param type O tipo de usuário ('Owner', 'Analista Interno', etc.)
   * @returns A cor do chip (ex: 'green', 'blue')
   */
  getChipColor(type: string | undefined): ChipColor {
    if (!type) {
      return 'gray'; // Retorna uma cor padrão se o tipo não for definido
    }
    switch (type) {
      case 'Owner':
        return 'green';
      case 'Analista Interno':
        return 'blue';
      default:
        return 'gray';
    }
  }
}