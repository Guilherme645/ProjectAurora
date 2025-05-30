import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService, User } from 'src/app/services/data.service';

@Component({
  selector: 'app-save-search',
  templateUrl: './save-search.component.html',
  styleUrls: ['./save-search.component.css'],
  standalone: false
})
export class SaveSearchComponent implements OnInit {
  salvarBuscaForm: FormGroup;
  currentStep: number = 1;
  showAddDestinationForm = false;
  newUserName = '';
  newUserEmail = '';
  isAlertActive: boolean = false;
  isNegativeAlertActive: boolean = false;
  userList: User[] = [];

  constructor(private fb: FormBuilder, private dataService: DataService) {
    const hoje = new Date();
    const hojeFormatado = hoje.toISOString().split('T')[0]; // yyyy-MM-dd

    this.salvarBuscaForm = this.fb.group({
      searchName: ['', Validators.required],
      startDate: [hojeFormatado, Validators.required],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    this.dataService.getSaveUsers().subscribe(users => {
      this.userList = users;
    });
  }

  onToggleAlert() {
    console.log('Alerta ativado:', this.isAlertActive);
  }

  onToggleNegativeAlert() {
    console.log('Alerta para menções negativas ativado:', this.isNegativeAlertActive);
  }

  nextStep(): void {
    if (this.salvarBuscaForm.valid) {
      this.currentStep = 2;
    } else {
      this.salvarBuscaForm.markAllAsTouched(); // Marca todos os campos para mostrar erro
    }
  }
  
  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  selectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.userList.forEach(user => user.selected = checked);
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
      const newUser: User = {
        name: this.newUserName,
        email: this.newUserEmail,
        avatar: this.getInitials(this.newUserName),
      };
      this.userList.push(newUser);
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
    this.showAddDestinationForm = false;
  }
}