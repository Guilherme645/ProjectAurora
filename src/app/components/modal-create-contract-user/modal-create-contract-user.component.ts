import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// Suas interfaces existentes
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
  desiredPassword: boolean;
  addressType?: string;
  cep?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  state?: string;
}

interface Vehicle {
  vehicle: string;
  mediaType: string;
}

@Component({
  selector: 'app-modal-create-contract-user',
  templateUrl: './modal-create-contract-user.component.html',
  styleUrls: ['./modal-create-contract-user.component.css'],
  standalone: false
})
// >>> MUDANÇA: Implementa o AfterViewInit
export class ModalCreateContractUserComponent implements OnInit, AfterViewInit {
  @Input() editMode: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  passwordVisible = false;

  currentStep: number = 1;
  contractForm!: FormGroup;
  userForm!: FormGroup;
  vehicleForm!: FormGroup;

  userTypes = [
    { value: 'collaborator', label: 'Colaborador' },
    { value: 'admin', label: 'Administrador' },
  ];

  mediaTypes = [
    { value: 'all', label: 'Todos' },
    { value: 'vehicle', label: 'Veículo' },
    { value: 'tvGlobo', label: 'TV Globo (Vídeo)' },
    { value: 'folhaSP', label: 'Folha de São Paulo (Texto)' },
    { value: 'g1', label: 'G1 (Texto)' },
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
      file: [null, Validators.required], // Adicionado validador para o ficheiro
    });

    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userType: ['', Validators.required],
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
      vehicle: ['', Validators.required],
      mediaType: ['', Validators.required],
    });

    if (this.editMode) {
      // Lógica de edição
    }
  }

  // >>> MUDANÇA: Adiciona o ngAfterViewInit para inicializar a Preline UI
  ngAfterViewInit(): void {
    // A inicialização é feita dentro de um setTimeout para garantir que o HTML foi renderizado
    setTimeout(() => {
      if (window.HSStaticMethods) {
        window.HSStaticMethods.autoInit();
      }
    }, 100);
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      this.contractForm.markAllAsTouched();
      if (this.contractForm.valid) this.currentStep = 2;
    } else if (this.currentStep === 2) {
      this.userForm.markAllAsTouched();
      if (this.userForm.valid) this.currentStep = 3;
    }
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  previousStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  onSubmit(): void {
    if (this.currentStep === 3) {
      const contractData = this.contractForm.value;
      const userData = this.userForm.value;
      
      this.save.emit({ contract: contractData, user: userData });
      this.close.emit();
    } else {
      this.nextStep();
    }
  }

  onFileChange(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.contractForm.patchValue({ file: file });
      // Força a revalidação do formulário
      this.contractForm.get('file')?.updateValueAndValidity();
    }
  }
}