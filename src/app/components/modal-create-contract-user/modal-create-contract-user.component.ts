// src/app/components/modal-create-contract-user/modal-create-contract-user.component.ts
import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

interface Contract {
  number: string;
  startDate: string;
  endDate: string;
  situation: string;
  responsibleWorkspace: string;
  workspaceName: string;
  file?: File;
}

interface User {
  fullName: string;
  email: string;
  userType: string;
  password: string;
  desiredPassword: boolean;
  addressType?: string;
  cep?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  state?: string;
}

@Component({
  selector: 'app-modal-create-contract-user',
  templateUrl: './modal-create-contract-user.component.html',
  styleUrls: ['./modal-create-contract-user.component.css'],
  standalone: false
})
export class ModalCreateContractUserComponent implements OnInit, AfterViewInit {
  @Input() editMode: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ contract: Contract; user: User }>();

  currentStep = 1;
  passwordVisible = false;

  contractForm!: FormGroup;
  userForm!: FormGroup;
  vehicleForm!: FormGroup;

  userTypes = [
    { value: 'collaborator', label: 'Colaborador' },
    { value: 'admin', label: 'Administrador' },
  ];

  constructor(private fb: FormBuilder) {}

 ngOnInit(): void {
  this.contractForm = this.fb.group({
    number: ['', Validators.required],
    signature_date: ['', Validators.required], // Add this line
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    situation: ['', Validators.required],
    responsibleWorkspace: ['', Validators.required],
    workspaceName: [''],
    file: [null, Validators.required]
  });

  this.userForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    userType: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    desiredPassword: [false],
    addressType: [''],
    cep: [''],
    street: [''],
    number: [''],
    complement: [''],
    neighborhood: [''],
    state: [''],
  });

  this.vehicleForm = this.fb.group({
    vehicle: [''],
    mediaType: [''],
  });

  if (this.editMode) {
    // carregar dados de edição aqui se necessário
  }
}

  ngAfterViewInit(): void {
    setTimeout(() => {
      if ((window as any).HSStaticMethods?.autoInit) {
        (window as any).HSStaticMethods.autoInit();
      }
    }, 0);
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  // Método para avançar ou submeter
nextStep(): void {
  if (this.currentStep === 1) {
    this.contractForm.markAllAsTouched();
    if (this.contractForm.valid) {
      this.currentStep = 2; // Move to the next step
    }
  } else if (this.currentStep === 2) {
    this.userForm.markAllAsTouched();
    if (this.userForm.valid) {
      this.currentStep = 3; // Move to the final step
    }
  }
}

  // Método para retroceder
  previousStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  onSubmit(): void {
    // Validação final de ambos os formulários antes de salvar
    this.contractForm.markAllAsTouched();
    this.userForm.markAllAsTouched();

    if (this.contractForm.valid && this.userForm.valid) {
      const contractData: Contract = this.contractForm.value;
      const userData: User = this.userForm.value;
      this.save.emit({ contract: contractData, user: userData });
      this.close.emit();
    } else {
      // Se houver erros, retorna para a primeira etapa com erro
      if (this.contractForm.invalid) this.currentStep = 1;
      else if (this.userForm.invalid) this.currentStep = 2;
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.contractForm.get('file')?.setValue(file);
    } else {
      this.contractForm.get('file')?.setValue(null);
    }
  }

  // Getter para o texto do botão principal
  get primaryButtonLabel(): string {
    return this.currentStep < 3 ? 'Continuar' : 'Salvar Informações';
  }

  // Getter para verificar se a etapa atual é válida
  get isCurrentStepValid(): boolean {
    if (this.currentStep === 1) return this.contractForm.valid;
    if (this.currentStep === 2) return this.userForm.valid;
    return true; // Etapa 3 não tem campos obrigatórios para avançar
  }

  // Helper para estilizar campos
  ctrl(control: string, form: 'contract' | 'user' | 'vehicle'): { [klass: string]: boolean } {
    const fg = form === 'contract' ? this.contractForm : form === 'user' ? this.userForm : this.vehicleForm;
    const c = fg.get(control);
    const isValid = !(c?.touched && c?.invalid);
    return {
      'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200': isValid,
      'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200': !isValid,
    };
  }
}
