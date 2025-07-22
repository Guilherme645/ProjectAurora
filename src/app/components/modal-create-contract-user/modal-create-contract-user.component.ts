import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

interface client {
  fantasyName: string; // Changed from fullName
  email: string;
  // password: string; // Not in form
  clientType: string; // Changed from collaboratorType
  clientCpfCnpj: string; // Changed from cpfCnpj
  stateRegistration: string; // New
  municipalRegistration: string; // New
  phone: string; // New
  address?: {
    addressType?: string;
    cep?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
  };
}


@Component({
  selector: 'app-modal-create-contract-user',
  templateUrl: './modal-create-contract-user.component.html',
  styleUrls: ['./modal-create-contract-user.component.css'],
  standalone: false
})
export class ModalCreateContractUserComponent implements OnInit {
 @Input() editMode: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  @Output() clientCreated = new EventEmitter<any>(); // NEW EVENT EMITTER

  currentStep: number = 1;
  clientForm!: FormGroup;

  clientTypes = [
    { value: 'publico', label: 'Público' },
    { value: 'privado', label: 'Privado' },
    { value: 'notas', label: 'Notas' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      fantasyName: ['', Validators.required],
      clientType: ['', Validators.required],
      clientCpfCnpj: ['', Validators.required],
      stateRegistration: ['', Validators.required],
      municipalRegistration: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // Address fields (from step 2)
      addressType: [''],
      cep: [''],
      street: [''],
      number: [''],
      complement: [''],
      neighborhood: [''],
      city: [''],
      state: [''],
    });

    if (this.editMode) {
      // Example: this.clientForm.patchValue(existingClientData);
    }
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      this.clientForm.markAllAsTouched();
      const basicInfoControls = ['fantasyName', 'clientType', 'clientCpfCnpj', 'stateRegistration', 'municipalRegistration', 'phone', 'email'];
      const isStep1Valid = basicInfoControls.every(controlName => this.clientForm.get(controlName)?.valid);

      if (isStep1Valid) {
        this.currentStep = 2;
      } else {
        console.log('Form is invalid at step 1:', this.clientForm.controls);
      }
    } else if (this.currentStep < 2) { // Ensure it doesn't go beyond max step (which is 2 in this case)
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit(): void {
    this.clientForm.markAllAsTouched();

    if (this.clientForm.valid) {
      console.log('Form Submitted!', this.clientForm.value);
      this.save.emit(this.clientForm.value);
      this.clientCreated.emit(this.clientForm.value); // NEW: Emit data when client is successfully created
      // this.close.emit(); // Remove this, as the parent will now close it after receiving clientCreated event
    } else {
      console.log('Form is invalid:', this.clientForm.controls);
    }
  }
}