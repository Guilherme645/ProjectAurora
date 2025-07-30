import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// 👇 Interface de dados que o formulário do modal usa. Deve ser exportada.
export interface ModalClient {
  fantasyName: string;
  clientType: string;
  clientCpfCnpj: string;
  stateRegistration: string;
  municipalRegistration: string;
  phone: string;
  email: string;
}

@Component({
  selector: 'app-modal-create-client',
  templateUrl: './modal-create-client.component.html',
  styleUrls: ['./modal-create-client.component.css'],
  standalone: false
})
export class ModalCreateClientComponent implements OnInit {
  // 👇 Recebe 'true' se for para editar, 'false' se for para criar
  @Input() editMode: boolean = false;
  // 👇 Recebe os dados do cliente quando editMode for true
  @Input() clientData: ModalClient | null = null;
  
  @Output() close = new EventEmitter<void>();
  @Output() clientCreated = new EventEmitter<any>();

  currentStep: number = 1;
  clientForm!: FormGroup;
  clientTypes = [
    { value: 'publico', label: 'Público' },
    { value: 'privado', label: 'Privado' },
    { value: 'notas', label: 'Notas' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Define a estrutura do formulário
    this.clientForm = this.fb.group({
      fantasyName: ['', Validators.required],
      clientType: ['', Validators.required],
      clientCpfCnpj: ['', Validators.required],
      stateRegistration: [''],
      municipalRegistration: [''],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // Adicione aqui os campos do Passo 2 (Endereço) se houver
    });

    // 👇 Se estiver no modo de edição, preenche o formulário com os dados recebidos
    if (this.editMode && this.clientData) {
      this.clientForm.patchValue(this.clientData);
    }
  }

  onSubmit(): void {
    this.clientForm.markAllAsTouched();
    if (this.clientForm.valid) {
      if (this.editMode) {
        console.log('Cliente atualizado!', this.clientForm.value);
        // Aqui você emitiria um evento para salvar as alterações
        // this.save.emit(this.clientForm.value);
      } else {
        console.log('Cliente criado!', this.clientForm.value);
        this.clientCreated.emit(this.clientForm.value);
      }
      this.close.emit(); // Fecha o modal após o sucesso
    } else {
      console.log('Formulário inválido');
    }
  }
  
 // ✅ Lógica para avançar para a próxima etapa
  nextStep(): void {
    if (this.currentStep < 2) {
      this.currentStep++;
    }
  }

  // ✅ Lógica para voltar para a etapa anterior
  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
}