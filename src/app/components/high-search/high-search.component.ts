import { Component } from '@angular/core';

@Component({
  selector: 'app-high-search',
  templateUrl: './high-search.component.html',
  styleUrls: ['./high-search.component.css']
})
export class HighSearchComponent {
  isSectionOpen = {
    keywords: false,
    date: false,
    media: false,
    location: false,
    sentiment: false
  };
  
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
  
  toggleSection(section: keyof typeof this.isSectionOpen): void {
    this.isSectionOpen[section] = !this.isSectionOpen[section];
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
}
