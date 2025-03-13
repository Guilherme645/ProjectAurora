import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-high-search',
  templateUrl: './high-search.component.html',
  styleUrls: ['./high-search.component.css'],
  standalone: false
})
export class HighSearchComponent {
  isMobile = window.innerWidth <= 768;
  showCalendar: boolean = false;
  selectedStartDate: Date | null = null; // Alterado para permitir null
  selectedEndDate: Date | null = null;   // Alterado para permitir null
  selectedInput: 'start' | 'end' | null = null;
  dateError: string | null = null;       // Mensagem de erro para datas inválidas
  @Input() isVisible: boolean = false; // Controla se o componente está visível
  @Output() close = new EventEmitter<void>(); // Evento emitido ao fechar
  constructor(private router: Router) {}

  isSectionOpen: { 
    keywords: boolean;
    date: boolean;
    media: boolean;
    vehicles: boolean;
    sentiment: boolean;
    location: boolean;
  } = {
    keywords: false,
    date: false,
    media: false,
    vehicles: false,
    sentiment: false,
    location: false
  };

  isModalOpen = false;

  mediaTypes = {
    audio: false,
    text: false,
    video: false
  };

  sentiments = {
    positive: false,
    neutral: false,
    negative: false
  };

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth <= 768;
  }

  onClose() {
    this.close.emit();
  }

  toggleSection(section: keyof typeof this.isSectionOpen) {
    this.isSectionOpen[section] = !this.isSectionOpen[section];
    this.isModalOpen = false;
  }

  openCalendar(input: 'start' | 'end') {
    this.selectedInput = input;
    this.showCalendar = true;
  }

  onDateSelected(date: Date) {
    if (this.selectedInput === 'start') {
      this.selectedStartDate = date;
    } else if (this.selectedInput === 'end') {
      this.selectedEndDate = date;
    }
    this.validateDates(); // Validar após selecionar uma data
    this.closeCalendar();
  }

  closeCalendar() {
    this.showCalendar = false;
    this.selectedInput = null;
  }

  // Método para validar as datas
  validateDates() {
    if (this.selectedStartDate && this.selectedEndDate) {
      if (this.selectedEndDate < this.selectedStartDate) {
        this.dateError = 'A data de fim deve ser posterior à data de início.';
      } else {
        this.dateError = null;
      }
    } else {
      this.dateError = null;
    }
  }

  // Verifica se o botão "Fazer busca" deve estar habilitado
  isSearchValid(): boolean {
    return !this.dateError; // Retorna true se não houver erro
  }

  clearSearch(): void {
    this.mediaTypes = { audio: false, text: false, video: false };
    this.sentiments = { positive: false, neutral: false, negative: false };
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.dateError = null; // Limpar erro ao limpar busca
    Object.keys(this.isSectionOpen).forEach((key) => {
      this.isSectionOpen[key as keyof typeof this.isSectionOpen] = false;
    });
  }

  navigateToResults() {
    if (this.isSearchValid()) {
      this.router.navigate(['/resultado']);
    }
  }

  openModal() {
    Object.keys(this.isSectionOpen).forEach((key) => {
      this.isSectionOpen[key as keyof typeof this.isSectionOpen] = false;
    });
    this.isModalOpen = true;
  }

  navigateToSimpleSearch() {
    window.location.href = '/busca';
  }
  
  onCloseSection() {
    this.isSectionOpen.location = false;
  }
}