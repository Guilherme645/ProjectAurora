import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

interface Collaborator {
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
  selector: 'app-modal-create-contract-users',
  templateUrl: './modal-create-contract-users.component.html',
  styleUrls: ['./modal-create-contract-users.component.css'],
  standalone: false
})
export class ModalCreateContractUsersComponent implements OnInit {
 @Input() editMode: boolean = false;
  @Input() collaboratorData: Collaborator | null = null;
  collaboratorForm: FormGroup;
  currentStep: number = 1;
  collaboratorTypes = [
    { value: 'admin', label: 'Administrador' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Visualizador' }
  ];

  constructor(private fb: FormBuilder) {
    this.collaboratorForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.editMode ? [] : [Validators.required, Validators.minLength(6)]],
      collaboratorType: ['', Validators.required],
      cpfCnpj: ['', Validators.required],
      addressType: [''],
      cep: [''],
      street: [''],
      number: [''],
      complement: [''],
      neighborhood: [''],
      city: [''],
      state: ['']
    });
  }

  ngOnInit(): void {
    if (this.editMode && this.collaboratorData) {
      this.collaboratorForm.patchValue({
        fullName: this.collaboratorData.fullName,
        email: this.collaboratorData.email,
        collaboratorType: this.collaboratorData.collaboratorType,
        cpfCnpj: this.collaboratorData.cpfCnpj,
        addressType: this.collaboratorData.address?.addressType || '',
        cep: this.collaboratorData.address?.cep || '',
        street: this.collaboratorData.address?.street || '',
        number: this.collaboratorData.address?.number || '',
        complement: this.collaboratorData.address?.complement || '',
        neighborhood: this.collaboratorData.address?.neighborhood || '',
        city: this.collaboratorData.address?.city || '',
        state: this.collaboratorData.address?.state || ''
      });
      this.collaboratorForm.get('password')?.clearValidators();
      this.collaboratorForm.get('password')?.updateValueAndValidity();
    }
  }

  nextStep(): void {
    if (this.currentStep === 1 && this.collaboratorForm.valid) {
      this.currentStep = 2;
    } else {
      this.collaboratorForm.markAllAsTouched();
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
        password: this.collaboratorForm.get('password')?.value,
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
          state: this.collaboratorForm.get('state')?.value || undefined
        }
      };
      if (this.editMode) {
        console.log('Colaborador atualizado:', formData);
        // Adicione aqui a lógica para atualizar o colaborador (ex.: chamada de API)
      } else {
        console.log('Colaborador criado:', formData);
        // Adicione aqui a lógica para criar o colaborador (ex.: chamada de API)
      }
    } else {
      this.collaboratorForm.markAllAsTouched();
      console.log('Formulário inválido');
    }
  }
}
