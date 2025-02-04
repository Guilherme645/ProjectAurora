import { Component } from '@angular/core';
import { DrawerService } from 'src/app/services/drawer.service';

@Component({
  selector: 'app-high-search',
  templateUrl: './high-search.component.html',
  styleUrls: ['./high-search.component.css'],
})
export class HighSearchComponent {
  sections = [
    { title: 'Palavras-chave', open: false, type: 'text' },
    { title: 'Data', open: false, type: 'text' },
    { title: 'Tipos de mídia', open: false, type: 'checkbox', options: ['Áudio', 'Texto', 'Vídeo'] },
    { title: 'Veículos', open: false, type: 'text' },
    { title: 'Sentimento', open: false, type: 'checkbox', options: ['Positivo', 'Neutro', 'Negativo'] },
    { title: 'Localização', open: false, type: 'text' }
  ];

  toggleSection(item: any) {
    item.open = !item.open;
  }

  clearSearch() {
    console.log('Busca limpa');
  }

  performSearch() {
    console.log('Busca realizada');
  }
}