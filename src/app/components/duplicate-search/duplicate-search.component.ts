import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User, DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-duplicate-search',
  templateUrl: './duplicate-search.component.html',
  styleUrls: ['./duplicate-search.component.css'],
  standalone: false
})
export class DuplicateSearchComponent implements OnInit {
  salvarBuscaForm: FormGroup;
  currentStep: number = 1;
  showAddDestinationForm = false;
  newUserName = '';
  newUserEmail = '';
  isAlertActive: boolean = false;
  isNegativeAlertActive: boolean = false;
  userList: User[] = [];
  @Output() saveDuplicate = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private dataService: DataService) {
    this.salvarBuscaForm = this.fb.group({
      searchName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
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

  nextStep() {
    // Valida o formulário antes de prosseguir
    if (this.salvarBuscaForm.valid) {
      this.currentStep++;
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit() {
    if (this.salvarBuscaForm.valid) {
      console.log('Form Submitted:', this.salvarBuscaForm.value);
      // Emite o evento para o componente pai para fechar a modal
      this.saveDuplicate.emit();
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
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
