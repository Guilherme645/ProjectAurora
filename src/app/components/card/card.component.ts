import { Component, Input, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input() noticias: any;
  showTagFilter: boolean = false;
  isMobile: boolean = false; // Flag para identificar se é mobile

  ngOnInit(): void {
    this.checkScreenSize(); // Verifica o tamanho da tela ao carregar
  }

  @HostListener('window:resize')
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768; // Define mobile se for menor ou igual a 768px
  }

  openTagFilter(event: Event): void {
    event.preventDefault();
    this.showTagFilter = true;
  }

  closeTagFilter(): void {
    this.showTagFilter = false;
  }
}
