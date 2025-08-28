import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Interface para os dados do formulário do modal
export interface Collaborator {
  fullName: string;
  email: string;
  password?: string;
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
    uf?: string;
    state?: string;
  };
}

@Component({
  selector: 'app-modal-create-collaborator',
  templateUrl: './modal-create-collaborator.component.html',
  styleUrls: ['./modal-create-collaborator.component.css'],
  standalone: false,
})
export class ModalCreateCollaboratorComponent implements OnInit {
  @Input() editMode: boolean = false;
  @Input() collaboratorData: Collaborator | null = null;
  passwordVisible = false;
  @Output() close = new EventEmitter<void>();
  @Output() collaboratorSaved = new EventEmitter<Collaborator>();

  collaboratorForm!: FormGroup;
  currentStep: number = 1;
  collaboratorTypes = [
    { value: 'admin', label: 'Administrador' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Visualizador' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.collaboratorForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      collaboratorType: ['', Validators.required],
      cpfCnpj: ['', Validators.required],
      addressType: [''],
      cep: [''],
      street: [''],
      number: [''],
      complement: [''],
      neighborhood: [''],
      uf: [''],
      city: [''],
      state: [''],
    });

    if (this.editMode && this.collaboratorData) {
      this.collaboratorForm.patchValue(this.collaboratorData);
      if (this.collaboratorData.address) {
        this.collaboratorForm.patchValue(this.collaboratorData.address);
      }
      // Senha não é obrigatória na edição
      this.collaboratorForm.get('password')?.clearValidators();
      this.collaboratorForm.get('password')?.updateValueAndValidity();
    } else {
      // Senha é obrigatória na criação
      this.collaboratorForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.collaboratorForm.get('password')?.updateValueAndValidity();
    }
  }

  // Função para alternar a visibilidade da senha
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
  nextStep(): void {
    const step1Controls = ['fullName', 'email', 'password', 'collaboratorType', 'cpfCnpj'];
    let isStep1Valid = true;
    step1Controls.forEach((controlName) => {
      const control = this.collaboratorForm.get(controlName);
      control?.markAsTouched();
      if (control?.invalid) {
        isStep1Valid = false;
      }
    });

    if (isStep1Valid) {
      this.currentStep = 2;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit(): void {
    if (this.collaboratorForm.valid) {
      const formData: Collaborator = {
        fullName: this.collaboratorForm.get('fullName')?.value,
        email: this.collaboratorForm.get('email')?.value,
        collaboratorType: this.collaboratorForm.get('collaboratorType')?.value,
        cpfCnpj: this.collaboratorForm.get('cpfCnpj')?.value,
        address: {
          addressType: this.collaboratorForm.get('addressType')?.value || undefined,
          cep: this.collaboratorForm.get('cep')?.value || undefined,
          street: this.collaboratorForm.get('street')?.value || undefined,
          number: this.collaboratorForm.get('number')?.value || undefined,
          complement: this.collaboratorForm.get('complement')?.value || undefined,
          neighborhood: this.collaboratorForm.get('neighborhood')?.value || undefined,
          city: this.collaboratorForm.get('city')?.value || undefined,
          state: this.collaboratorForm.get('state')?.value || undefined,
        },
      };

      // Adiciona a senha apenas se não estiver em modo de edição ou se um novo valor for digitado
      const passwordValue = this.collaboratorForm.get('password')?.value;
      if (!this.editMode || (this.editMode && passwordValue)) {
        formData.password = passwordValue;
      }

      this.collaboratorSaved.emit(formData);
      this.close.emit();
    } else {
      this.collaboratorForm.markAllAsTouched();
      console.log('Formulário inválido');
    }
  }
}