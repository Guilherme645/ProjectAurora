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
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      situation: ['', Validators.required],
      responsibleWorkspace: ['', Validators.required],
      workspaceName: [''],
      file: []  // <— obrigatório para liberar o step
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

    // Veículos (se for usar depois)
    this.vehicleForm = this.fb.group({
      vehicle: [''],
      mediaType: [''],
    });

    if (this.editMode) {
      // carregar dados de edição aqui se necessário
    }
  }

  ngAfterViewInit(): void {
    // garante Preline ativo (quando presente)
    setTimeout(() => {
      if ((window as any).HSStaticMethods?.autoInit) {
        (window as any).HSStaticMethods.autoInit();
      }
    }, 0);
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      this.contractForm.markAllAsTouched();
      // console.log('contractForm.valid?', this.contractForm.valid, this.contractForm.value);
      if (this.contractForm.valid) this.currentStep = 2;
    } else if (this.currentStep === 2) {
      this.userForm.markAllAsTouched();
      // console.log('userForm.valid?', this.userForm.valid, this.userForm.value);
      if (this.userForm.valid) this.currentStep = 3;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  onSubmit(): void {
    if (this.currentStep === 3) {
      if (!this.contractForm.valid || !this.userForm.valid) {
        this.contractForm.markAllAsTouched();
        this.userForm.markAllAsTouched();
        return;
      }
      const contractData: Contract = this.contractForm.value;
      const userData: User = this.userForm.value;
      this.save.emit({ contract: contractData, user: userData });
      this.close.emit();
    } else {
      this.nextStep();
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      // Atribua o arquivo ao controle de formulário 'file'
      this.contractForm.get('file')?.setValue(file);
      // Oculta a área de upload e exibe a visualização (se houver)
      const uploadArea = document.querySelector('[data-hs-file-upload-trigger]') as HTMLElement;
      if (uploadArea) {
        uploadArea.style.display = 'none';
      }
    } else {
      this.contractForm.get('file')?.setValue(null);
      // Exibe a área de upload novamente se nenhum arquivo foi selecionado
      const uploadArea = document.querySelector('[data-hs-file-upload-trigger]') as HTMLElement;
      if (uploadArea) {
        uploadArea.style.display = 'flex';
      }
    }
  }
  /** util p/ estilizar campos inválidos */
  ctrl(control: string, form: 'contract' | 'user'): { [klass: string]: boolean } {
    const fg = form === 'contract' ? this.contractForm : this.userForm;
    const c = fg.get(control);
    return {
      'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200': !(c?.touched && c?.invalid),
      'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200': !!(c?.touched && c?.invalid),
    };
  }
}
