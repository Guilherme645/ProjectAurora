import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-filter',
  templateUrl: './dashboard-filter.component.html',
  styleUrls: ['./dashboard-filter.component.css'],
  standalone: false
})
export class DashboardFilterComponent {
 isMobile = window.innerWidth <= 768;
  showCalendar: boolean = false;

  selectedInput: 'start' | 'end' | null = null;
  dateError: string | null = null;
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>(); 
  
  // O evento que o componente pai irá ouvir para abrir o modal de veículos
  @Output() openVehiclesModalRequest = new EventEmitter<void>();
  @Output() openLocationModalRequest = new EventEmitter<void>();
// Adicione junto com os seus outros @Inputs e @Outputs
  @Input() currentKeywords: string[] = []; 
  @Output() keywordsChanged = new EventEmitter<string[]>();

  activeTags: string[] = [];
  suggestions: string[] = [];
  isSidebarOpen: boolean = false;
  selectedStartDateMobile: string = ''; 
  selectedEndDateMobile: string = '';   
  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
 allAvailableTags: string[] = ['Alexandre de Moraes', 'Dias Toffoli', 'Roberto Barroso', 'Rosa Weber', 'Gilmar Mendes', 'Luiz Fux'];
  etapaSelecionando: 'start' | 'end' = 'start'; 
  
  constructor(private router: Router) {}

isSectionOpen: { 
  keywords: boolean;
  date: boolean;
  media: boolean;
  tier: boolean;    // <--- ADICIONE ESTA LINHA
  vehicles: boolean;
  sentiment: boolean;
  location: boolean;
} = {
  keywords: false,
  date: false,
  media: false,
  tier: false,      // <--- ADICIONE ESTA LINHA
  vehicles: false,
  sentiment: false,
  location: false
};

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

ngOnInit() {
    // Pega as tags ativas que vieram da tela principal
    this.activeTags = [...this.currentKeywords];
    
    // Sugestões são todas as tags que NÃO estão ativas no momento
    this.suggestions = this.allAvailableTags.filter(tag => !this.activeTags.includes(tag));
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth <= 768;
  }

  onClose() {
    this.close.emit(); 
  }

  toggleSection(section: keyof typeof this.isSectionOpen) {
    this.isSectionOpen[section] = !this.isSectionOpen[section];
    this.isLocationModalOpen = false;
  }

  openCalendar(input: 'start' | 'end') {
    this.selectedInput = input;
    this.showCalendar = true;
  }

  // Remove uma tag da lista de ativos e devolve para as sugestões
removeTag(tag: string) {
    this.activeTags = this.activeTags.filter(t => t !== tag);
    if (!this.suggestions.includes(tag)) {
      this.suggestions.push(tag);
    }
    // AVISA O PAI QUE MUDOU
    this.keywordsChanged.emit(this.activeTags);
  }
// Adiciona uma sugestão aos ativos e remove da lista de sugestões
addSuggestion(suggestion: string) {
    if (!this.activeTags.includes(suggestion)) {
      this.activeTags.push(suggestion);
    }
    this.suggestions = this.suggestions.filter(s => s !== suggestion);
    // AVISA O PAI QUE MUDOU
    this.keywordsChanged.emit(this.activeTags);
  }
  onDateSelected(date: Date) {
    if (this.etapaSelecionando === 'start') {
      this.selectedStartDate = date;
      this.selectedEndDate = null;
      this.etapaSelecionando = 'end';
    } else if (this.etapaSelecionando === 'end') {
      if (this.selectedStartDate && date >= this.selectedStartDate) {
        this.selectedEndDate = date;
        this.etapaSelecionando = 'start';
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
    this.isLocationModalOpen = false;
  }

navigateToResults() {
    if (this.isSearchValid()) {
      // Em vez de mudar de página, apenas fecha o filtro para ver o gráfico atualizado
      this.onClose();
    }
  }
 openVehiclesModal() {
  this.onClose(); // ✅ fecha o painel primeiro
  this.openVehiclesModalRequest.emit();
}

openLocationModal() {
  this.onClose(); // ✅ fecha o painel primeiro
  this.openLocationModalRequest.emit();
}


  navigateToSimpleSearch() {
    window.location.href = '/busca';
  }

   onSidebarToggle(isOpen: boolean) {
    this.isSidebarOpen = isOpen;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }


}
