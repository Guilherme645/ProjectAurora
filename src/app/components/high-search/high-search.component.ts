import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-high-search',
  templateUrl: './high-search.component.html',
  styleUrls: ['./high-search.component.css']
})
export class HighSearchComponent {
  isMobile = window.innerWidth <= 768;

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
  

  isModalOpen = false; // Controle do modal

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
  
  toggleSection(section: keyof typeof this.isSectionOpen) {
    this.isSectionOpen[section] = !this.isSectionOpen[section];
  }

 @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth <= 768;
  }
  

  clearSearch(): void {
    console.log('Busca limpa!');
  }

  performSearch(): void {
    console.log('Busca realizada!');
  }

  changeToDate(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.type = 'date';
  }
  ngAfterViewInit(): void {
    (window as any).HSDatepicker?.init();
  }
  resetPlaceholder(event: Event, placeholder: string): void {
    const input = event.target as HTMLInputElement;
    if (!input.value) {
      input.type = 'text';
      input.placeholder = placeholder;
    }
  }
  openModal() {
    this.isModalOpen = true;
  }

  // Fecha o modal
  closeModal() {
    this.isModalOpen = false;
  }
  navigateToResults() {
    this.router.navigate(['/resultado']); // Substitua pelo caminho correto da página de resultados
  }
}
