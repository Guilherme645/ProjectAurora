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

  selectedInput: 'start' | 'end' | null = null;
  dateError: string | null = null;
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>(); 
  isSidebarOpen: boolean = false;
  selectedStartDateMobile: string = ''; 
  selectedEndDateMobile: string = '';   
  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  
  etapaSelecionando: 'start' | 'end' = 'start'; // controla qual data está sendo selecionada
  
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

  isVehiclesModalOpen = false;
  isLocationModalOpen = false;

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

  onSidebarToggle(isOpen: boolean) {
    this.isSidebarOpen = isOpen;
    console.log('Sidebar foi', isOpen ? 'aberto' : 'fechado');
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleSection(section: keyof typeof this.isSectionOpen) {
    this.isSectionOpen[section] = !this.isSectionOpen[section];
    this.isVehiclesModalOpen = false;
    this.isLocationModalOpen = false;
  }

  openCalendar(input: 'start' | 'end') {
    this.selectedInput = input;
    this.showCalendar = true;
  }

  onDateSelected(date: Date) {
    if (this.etapaSelecionando === 'start') {
      this.selectedStartDate = date;
      this.selectedEndDate = null; // limpa a data de fim, caso exista
      this.etapaSelecionando = 'end'; // agora o próximo clique será para selecionar a data de fim
    } else if (this.etapaSelecionando === 'end') {
      if (this.selectedStartDate && date >= this.selectedStartDate) {
        this.selectedEndDate = date;
        this.etapaSelecionando = 'start'; // reinicia o processo, caso o usuário queira escolher outro intervalo
      } else {
        alert('A data final deve ser posterior ou igual à data inicial.');
      }
    }
  }

  closeCalendar() {
    this.showCalendar = false;
    this.selectedInput = null;
  }

  onMobileDateChange(type: 'start' | 'end', event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const date = value ? new Date(value) : null;
    if (type === 'start') {
      this.selectedStartDate = date;
      this.selectedStartDateMobile = value; 
    } else {
      this.selectedEndDate = date;
      this.selectedEndDateMobile = value; 
    }
    this.validateDates();
  }

  private formatDateToInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

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

  isSearchValid(): boolean {
    return !this.dateError;
  }

  clearSearch(): void {
    this.mediaTypes = { audio: false, text: false, video: false };
    this.sentiments = { positive: false, neutral: false, negative: false };
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.selectedStartDateMobile = ''; 
    this.selectedEndDateMobile = '';  
    this.dateError = null;
    Object.keys(this.isSectionOpen).forEach((key) => {
      this.isSectionOpen[key as keyof typeof this.isSectionOpen] = false;
    });
    this.isVehiclesModalOpen = false;
    this.isLocationModalOpen = false;
  }

  navigateToResults() {
    if (this.isSearchValid()) {
      this.router.navigate(['/resultado']);
    }
  }

  openVehiclesModal() {
    Object.keys(this.isSectionOpen).forEach((key) => {
      this.isSectionOpen[key as keyof typeof this.isSectionOpen] = false;
    });
    this.isVehiclesModalOpen = true;
    this.isLocationModalOpen = false;
  }

  openLocationModal() {
    Object.keys(this.isSectionOpen).forEach((key) => {
      this.isSectionOpen[key as keyof typeof this.isSectionOpen] = false;
    });
    this.isVehiclesModalOpen = false;
    this.isLocationModalOpen = true;
  }

  navigateToSimpleSearch() {
    window.location.href = '/busca';
  }
  
  onCloseSection() {
    this.isVehiclesModalOpen = false;
    this.isLocationModalOpen = false;
  }
}