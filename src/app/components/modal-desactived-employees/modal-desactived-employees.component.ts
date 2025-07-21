import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-desactived-employees',
  templateUrl: './modal-desactived-employees.component.html',
  styleUrls: ['./modal-desactived-employees.component.css'],
  standalone: false,
})
export class ModalDesactivedEmployeesComponent {
  @Input() collaboratorName: string | undefined;
  @Input() collaboratorEmail: string | undefined;
  @Input() collaboratorUserType: string | undefined; // To display the user type if needed, though not explicitly in the image's text area

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  get title(): string {
    return 'Desativar colaborador';
  }

  // This getter will now be used to construct the dynamic content within the modal body
  // based on the inputs. The HTML will need to be updated to use these properties directly.
  get confirmText(): string {
    return 'Desativar colaborador';
  }
}
