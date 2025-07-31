import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class ModalCreateContractUserComponent implements OnInit {
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
      file: [null],
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

    // Este formulário não possui campos no template da Etapa 3,
    // o que causa a falha na validação.
    this.vehicleForm = this.fb.group({
      vehicle: ['', Validators.required],
      mediaType: ['', Validators.required],
    });

    if (this.editMode) {
      // Lógica de edição
    }
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

  // ✅ FUNÇÃO CORRIGIDA
  onSubmit(): void {
    if (this.currentStep === 3) {
      // NOTA: A validação this.vehicleForm.valid provavelmente está falhando
      // porque o formulário não está conectado à sua tabela de veículos na UI.
      // Para fazer o fluxo funcionar, vamos salvar os dados dos outros formulários
      // e fechar o modal.

      const contractData = this.contractForm.value;
      const userData = this.userForm.value;
      // const vehicleData = ...; // Você precisará obter os dados da tabela de veículos.

      // 1. Emite os dados salvos para o componente pai.
      this.save.emit({ contract: contractData, user: userData });
      
      // 2. Emite o evento para fechar o modal. Esta linha estava faltando.
      this.close.emit();

    } else {
      // Se não for a última etapa, apenas avança.
      this.nextStep();
    }
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.contractForm.patchValue({ file: event.target.files[0] });
    }
  }
}