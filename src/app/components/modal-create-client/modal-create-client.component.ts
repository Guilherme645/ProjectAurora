import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface ModalClient {
  fantasyName: string;
  clientType: string;
  clientCpfCnpj: string;
  stateRegistration: string;
  municipalRegistration: string;
  phone: string;
  email: string;
  // campos de endereço (step 2)
  addressType?: string;
  cep?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
}

@Component({
  selector: 'app-modal-create-client',
  templateUrl: './modal-create-client.component.html',
  styleUrls: ['./modal-create-client.component.css'],
  standalone: false
})
export class ModalCreateClientComponent implements OnInit {
  @Input() editMode = false;
  @Input() clientData: ModalClient | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() clientCreated = new EventEmitter<ModalClient>();

  currentStep = 1;
  clientForm!: FormGroup;

  clientTypes = [
    { value: 'publico', label: 'Público' },
    { value: 'privado', label: 'Privado' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      fantasyName: ['', Validators.required],
      clientType: ['', Validators.required],
      clientCpfCnpj: ['', Validators.required],
      stateRegistration: [''],
      municipalRegistration: [''],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],

      // Step 2 (opcional)
      addressType: [''],
      cep: [''],
      street: [''],
      number: [''],
      complement: [''],
      neighborhood: [''],
      city: [''],
    });

    if (this.editMode && this.clientData) {
      this.clientForm.patchValue(this.clientData);
    }
  }

  // navegação
  nextStep(): void {
    if (this.currentStep === 1) {
      if (this.isStep1Valid()) { // Correctly checks only for Step 1 fields
        this.currentStep++;
      } else {
        this.clientForm.markAllAsTouched();
      }
    } else {
      this.onSubmit(); // Submits the form from step 2
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
      const payload = this.clientForm.value as ModalClient;

      if (this.editMode) {
        console.log('Cliente atualizado!', payload);
      } else {
        console.log('Cliente criado!', payload);
        this.clientCreated.emit(payload);
      }
      this.close.emit();
    }
  }

  // getters úteis para o template
  isStep1Valid(): boolean {
    const keys = ['fantasyName', 'clientType', 'clientCpfCnpj', 'phone', 'email'];
    return keys.every(k => this.clientForm.get(k)?.valid);
  }

  get primaryLabel(): string {
    if (this.currentStep === 1) return 'Continuar';
    return this.editMode ? 'Salvar alterações' : 'Criar cliente';
  }

  get showPreviousButton(): boolean {
    return this.currentStep > 1;
  }
}