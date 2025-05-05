// edit-search-basic-information.component.ts
import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService, User } from 'src/app/services/data.service';
import { ModalService } from 'src/app/services/modal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-search-basic-information',
  templateUrl: './edit-search-basic-information.component.html',
  styleUrls: ['./edit-search-basic-information.component.css'],
  standalone: false,
})
export class EditSearchBasicInformationComponent implements OnInit, OnDestroy {
  salvarBuscaForm: FormGroup;
  currentStep: number = 1;
  showAddDestinationForm = false;
  newUserName = '';
  newUserEmail = '';
  isAlertActive: boolean = false;
  isNegativeAlertActive: boolean = false;
  userList: User[] = [];
  @Output() saveEdits = new EventEmitter<void>();
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private modalService: ModalService
  ) {
    this.salvarBuscaForm = this.fb.group({
      searchName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
    });
  }

  ngOnInit(): void {
    // Carrega a lista de usuários
    this.dataService.getSaveUsers().subscribe(users => {
      this.userList = users;
    });

    // Inscreve-se no estado do modal para receber os dados
    this.subscription.add(
      this.modalService.editModalState$.subscribe(state => {
        if (state.open && state.data) {
          this.salvarBuscaForm.patchValue({
            searchName: state.data.title || '',
            startDate: state.data.startDate ? new Date(state.data.startDate).toISOString().split('T')[0] : '',
            endDate: state.data.endDate ? new Date(state.data.endDate).toISOString().split('T')[0] : '',
          });
          this.isAlertActive = state.data.status === 'Ativa';
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onToggleAlert() {
    console.log('Alerta ativado:', this.isAlertActive);
  }

  onToggleNegativeAlert() {
    console.log('Alerta para menções negativas ativado:', this.isNegativeAlertActive);
  }

  nextStep() {
    if (this.salvarBuscaForm.valid) {
      this.currentStep++;
    } else {
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit() {
    if (this.salvarBuscaForm.valid) {
      // Atualiza a busca no backend
      this.dataService.updateSearch({
        ...this.salvarBuscaForm.value,
        status: this.isAlertActive ? 'Ativa' : 'Pendente',
      }).subscribe({
        next: () => {
          this.saveEdits.emit();
        },
        error: (error) => {
          console.error('Erro ao salvar edições:', error);
          alert('Erro ao salvar as edições. Tente novamente.');
        },
      });
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