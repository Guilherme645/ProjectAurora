import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-contract', // This selector remains, but the component's purpose changes
  templateUrl: './modal-contract.component.html', // This will now point to the HTML above
  styleUrls: ['./modal-contract.component.css'],
  standalone: false // or true, depending on your setup
})
export class ModalContractComponent implements OnInit {
  // Input property to receive the client's name from the parent component
  // This replaces the previous 'clientData' as the HTML now expects 'clientName' directly
  @Input() clientName: string | undefined;

  // Output event emitters to communicate actions back to the parent component
  // These are updated to match the new HTML's event bindings
  @Output() cancel = new EventEmitter<void>(); // Emits when the close button is clicked
  @Output() continueRegistration = new EventEmitter<void>(); // Emits when "Continuar cadastro" is clicked
  @Output() registerLater = new EventEmitter<void>(); // Emits when "Cadastrar mais tarde" is clicked

  constructor() {}

  ngOnInit(): void {
    // The ngOnInit logic is simplified as 'clientData' is no longer directly used for logging
    if (this.clientName) {
      console.log('ModalContractComponent (now a client registration prompt) received client name:', this.clientName);
    }
  }

  // Getter for the modal title, as it's static in this case
  get title(): string {
    return 'Cadastrar Contratos e Usuários';
  }

  // Getter for the text of the "Continuar cadastro" button
  get continueButtonText(): string {
    return 'Continuar cadastro';
  }

  // Getter for the text of the "Cadastrar mais tarde" button
  get registerLaterButtonText(): string {
    return 'Cadastrar mais tarde';
  }

  // The original onClose and onSaveContract methods are removed
  // as they are not present in the new HTML's event bindings.
  // The new HTML uses 'cancel.emit()', 'continueRegistration.emit()', and 'registerLater.emit()'.
}
