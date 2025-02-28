import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-high-search',
  templateUrl: './high-search.component.html',
  styleUrls: ['./high-search.component.css']
})
export class HighSearchComponent {
  isMobile = window.innerWidth <= 768;
  showCalendar: boolean = false;
  selectedStartDate!: Date;
  selectedEndDate!: Date;
  selectedInput: 'start' | 'end' | null = null;
  @Output() fecharComponente = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>(); // Evento para fechar

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
    this.closeCalendar();
  }

  closeCalendar() {
    this.showCalendar = false;
    this.selectedInput = null;
  }

  clearSearch(): void {
    this.mediaTypes = { audio: false, text: false, video: false };
    this.sentiments = { positive: false, neutral: false, negative: false };
    this.selectedStartDate = null!;
    this.selectedEndDate = null!;
    Object.keys(this.isSectionOpen).forEach((key) => {
      this.isSectionOpen[key as keyof typeof this.isSectionOpen] = false;
    });
  }

  navigateToResults() {
    this.router.navigate(['/resultado']);
  }

  openModal() {
    Object.keys(this.isSectionOpen).forEach((key) => {
      this.isSectionOpen[key as keyof typeof this.isSectionOpen] = false;
    });
    this.isModalOpen = true;
  }



  navigateToSimpleSearch() {
    window.location.href = '/busca'; // Redireciona e recarrega a página
  }
  
  onCloseSection() {
    this.isSectionOpen.location = false;
  }

  close() {
    this.closeModal.emit(); // Emite o evento para o componente pai
  }
  
}