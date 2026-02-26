import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobeComponent } from '../globe/globe.component'; // ⚠️ Ajuste o caminho se necessário

export interface GeoMentionRow {
  name: string;
  mediaType: 'audio' | 'document';
  location: string;
  reach: string;
  region: string; // Adicionado para facilitar o filtro da tabela
}

@Component({
  selector: 'app-entities-table',
  templateUrl: './entities-table.component.html',
  standalone: false
})
export class EntitiesTableComponent implements OnInit {
  
  // Busca o componente do Globo na tela com segurança
  @ViewChild(GlobeComponent) globeComponent!: GlobeComponent;

  // Lista original intocável
  private allTableData: GeoMentionRow[] = [
    { name: 'Rádio Itatiaia', mediaType: 'audio', location: 'Brasília - DF', reach: '3M', region: 'centro-oeste' },
    { name: 'BandNews FM', mediaType: 'audio', location: 'São Paulo - SP', reach: '4M', region: 'sudeste' },
    { name: 'Jovem Pan', mediaType: 'document', location: 'Rio de Janeiro - RJ', reach: '1.5M', region: 'sudeste' },
    { name: 'Rádio Gaúcha', mediaType: 'audio', location: 'Porto Alegre - RS', reach: '5M', region: 'sul' },
    { name: 'CBN', mediaType: 'audio', location: 'Belo Horizonte - MG', reach: '2M', region: 'sudeste' },
    { name: 'Rádio Bandeirantes', mediaType: 'audio', location: 'Salvador - BA', reach: '6M', region: 'nordeste' },
    { name: 'Antena 1', mediaType: 'document', location: 'Curitiba - PR', reach: '7M', region: 'sul' },
    { name: 'Kiss FM', mediaType: 'audio', location: 'Fortaleza - CE', reach: '8M', region: 'nordeste' }
  ];

  // Lista que aparece na tela
  public tableData: GeoMentionRow[] = [];

  ngOnInit() {
    // Começa mostrando tudo
    this.tableData = [...this.allTableData];
  }

  // 👇 Quando o usuário escolhe uma região no <select> do HTML
  onRegionChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const regionName = selectElement.value;
    
    // 1. Filtra os dados da tabela lateral
    if (regionName === 'all') {
      this.tableData = [...this.allTableData];
    } else {
      this.tableData = this.allTableData.filter(item => item.region === regionName);
    }

    // 2. Dispara o voo e o filtro lá no componente do Mapa/Globo
    if (this.globeComponent) {
      this.globeComponent.applyRegionFilter(regionName);
    }
  }

  // Tela cheia
  isFullscreen = false;
  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
  }
}