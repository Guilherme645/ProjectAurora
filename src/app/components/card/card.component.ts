import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  showTagFilter: boolean = false; // Controla a visibilidade do TagFilterComponent

  @Input() noticias: any; // Recebe os dados de uma única notícia

  // Abre o componente TagFilter
  openTagFilter(event: Event) {
    event.preventDefault(); // Previne o comportamento padrão do link
    this.showTagFilter = true;
  }

  // Fecha o componente TagFilter
  closeTagFilter() {
    this.showTagFilter = false;
  }
}
