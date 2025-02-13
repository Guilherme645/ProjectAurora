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

  constructor(private fb: FormBuilder) {
    this.salvarBuscaForm = this.fb.group({
      searchName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['']
    });
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
}