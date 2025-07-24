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

    this.vehicleForm = this.fb.group({
      vehicle: ['', Validators.required],
      mediaType: ['', Validators.required],
    });

    if (this.editMode) {
      // Example: this.contractForm.patchValue(existingContractData);
      // Example: this.userForm.patchValue(existingUserData);
      // Example: this.vehicleForm.patchValue(existingVehicleData);
    }
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      this.contractForm.markAllAsTouched();
      const isContractValid = this.contractForm.valid;
      if (isContractValid) this.currentStep = 2;
    } else if (this.currentStep === 2) {
      this.userForm.markAllAsTouched();
      const isUserValid = this.userForm.valid;
      if (isUserValid) this.currentStep = 3;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  onSubmit(): void {
    if (this.currentStep === 3) {
      this.vehicleForm.markAllAsTouched();
      if (this.vehicleForm.valid) {
        const contractData = this.contractForm.value;
        const userData = this.userForm.value;
        const vehicleData = this.vehicleForm.value;
        this.save.emit({ contract: contractData, user: userData, vehicle: vehicleData });
      }
    } else {
      this.nextStep();
    }
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.contractForm.patchValue({ file: event.target.files[0] });
    }
  }
}