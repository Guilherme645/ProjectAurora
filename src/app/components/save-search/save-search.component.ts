import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-save-search',
  templateUrl: './save-search.component.html',
  styleUrls: ['./save-search.component.css']
})
export class SaveSearchComponent {
  salvarBuscaForm: FormGroup;
  currentStep: number = 1; // Controla a etapa atual
  showAddDestinationForm = false;
  newUserName = '';
  isChecked: boolean = false;
  newUserEmail = '';
  isAlertActive: boolean = false;
  isNegativeAlertActive: boolean = false;
  userList: Array<{ name: string; email: string; avatar: string }> = [
    { name: 'Guilherme Sousa', email: 'guilhermesousa@stf.org', avatar: 'GS' },
    { name: 'Marina Campos', email: 'marinacampos@stf.org', avatar: 'MC' },
  ];
  
  constructor(private fb: FormBuilder) {
    this.salvarBuscaForm = this.fb.group({
      searchName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['']
    });
  }
  onToggleAlert() {
    console.log('Alerta ativado:', this.isAlertActive);
  }

  onToggleNegativeAlert() {
    console.log('Alerta para menções negativas ativado:', this.isNegativeAlertActive);
  }
  nextStep() {
    this.currentStep++;
  }

  prevStep() {
    this.currentStep--;
  }

  onSubmit() {
    console.log('Form Submitted:', this.salvarBuscaForm.value);
  }
  toggleAddDestinationForm(event: Event) {
    event.preventDefault();
    this.showAddDestinationForm = !this.showAddDestinationForm;
  }
  
  addDestination() {
    if (this.newUserName && this.newUserEmail) {
      const newUser = {
        name: this.newUserName,
        email: this.newUserEmail,
        avatar: this.getInitials(this.newUserName),
      };
  
      // Adiciona o novo usuário à lista existente
      this.userList.push(newUser);
  
      // Limpa o formulário e oculta a área de adicionar destinatário
      this.newUserName = '';
      this.newUserEmail = '';
      this.showAddDestinationForm = false;
    } else {
      alert('Por favor, preencha o nome e o e-mail.');
    }
  }
  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  cancelAddDestination(): void {
    this.newUserName = '';
    this.newUserEmail = '';
    this.showAddDestinationForm = false; // Fecha o formulário e mostra o link novamente
  }
  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
}
}