import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

interface client {
  fullName: string;
  email: string;
  password: string;
  collaboratorType: string;
  cpfCnpj: string;
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
  selector: 'app-modal-create-client',
  templateUrl: './modal-create-client.component.html',
  styleUrls: ['./modal-create-client.component.css'],
  standalone: false
})
export class ModalCreateClientComponent implements OnInit {
 @Input() editMode: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>(); // Assuming you'll emit form data on save

  currentStep: number = 1;
  clientForm!: FormGroup; // Changed from collaboratorForm

  // Define clientTypes property
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

    // If in edit mode, you might want to patch the form with existing data
    if (this.editMode) {
      // Example: this.clientForm.patchValue(existingClientData);
    }
  }

  nextStep(): void {
    // Validate current step's fields before proceeding
    if (this.currentStep === 1) {
      this.clientForm.markAllAsTouched(); // Mark all controls as touched to show validation errors
      const basicInfoControls = ['fantasyName', 'clientType', 'clientCpfCnpj', 'stateRegistration', 'municipalRegistration', 'phone', 'email'];
      const isStep1Valid = basicInfoControls.every(controlName => this.clientForm.get(controlName)?.valid);

      if (isStep1Valid) {
        this.currentStep = 2;
      } else {
        console.log('Form is invalid at step 1:', this.clientForm.controls);
      }
    } else if (this.currentStep < 2) { // Ensure it doesn't go beyond max step
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit(): void {
    this.clientForm.markAllAsTouched(); // Mark all controls as touched for final validation

    if (this.clientForm.valid) {
      console.log('Form Submitted!', this.clientForm.value);
      this.save.emit(this.clientForm.value);
      this.close.emit();
    } else {
      console.log('Form is invalid:', this.clientForm.controls);
      // Optionally, you can find the first invalid control and scroll to it
    }
  }
}
