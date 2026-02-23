import { Component, Input } from '@angular/core';

export interface GeoMentionRow {
  name: string;
  mediaType: 'audio' | 'document';
  location: string;
  reach: string;
}

@Component({
  selector: 'app-entities-table',
  templateUrl: './entities-table.component.html',
  standalone: false
})
export class EntitiesTableComponent {
  
 public tableData: GeoMentionRow[] = [
    { name: 'Rádio Itatiaia', mediaType: 'audio', location: 'Brasília - DF', reach: '3M' },
    { name: 'BandNews FM', mediaType: 'audio', location: 'São Paulo - SP', reach: '4M' },
    { name: 'Jovem Pan', mediaType: 'document', location: 'Rio de Janeiro - RJ', reach: '1.5M' },
    { name: 'Rádio Gaúcha', mediaType: 'audio', location: 'São Paulo - SP', reach: '5M' },
    { name: 'CBN', mediaType: 'audio', location: 'Belo Horizonte - MG', reach: '2M' },
    { name: 'Rádio Bandeirantes', mediaType: 'audio', location: 'Salvador - BA', reach: '6M' },
    { name: 'Antena 1', mediaType: 'document', location: 'Curitiba - PR', reach: '7M' },
    { name: 'Kiss FM', mediaType: 'audio', location: 'Fortaleza - CE', reach: '8M' }
  ];

  ngOnInit() {
    // Sua lógica de inicialização aqui
  }

  // Se você estiver usando aquela função de tela cheia que fizemos antes:
  isFullscreen = false;
  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
    // Opcional: disparar evento de resize pro globo
  }
}