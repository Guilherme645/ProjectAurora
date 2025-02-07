import { Component } from '@angular/core';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.css']
})
export class FiltrosComponent {

  filtros = [
    { nome: 'Hora', aberto: false, itens: ['Manhã (4091)', 'Tarde (3291)', 'Noite (1827)'], mostrarMais: false },
    { nome: 'Data', aberto: false, itens: ['Data Início', 'Data Fim'], mostrarMais: false },
    { nome: 'Tipo de mídia', aberto: false, itens: ['Áudio (4091)', 'Texto (3291)', 'Vídeo (1827)'], mostrarMais: false },
    { nome: 'Veículos', aberto: false, itens: ['G1 (1121)', 'Globo (971)', 'R7 (911)'], mostrarMais: true },
    { nome: 'Sentimento', aberto: false, itens: ['Positivo (442)', 'Negativo (221)', 'Neutro (172)'], mostrarMais: false },
    { nome: 'Localização', aberto: false, itens: ['Distrito Federal (1072)', 'Rio de Janeiro (937)', 'São Paulo (813)'], mostrarMais: true },
  ];

  toggleSection(nome: string) {
    const filtro = this.filtros.find(f => f.nome === nome);
    if (filtro) {
      filtro.aberto = !filtro.aberto;
    }
  }

  mostrarMais(filtro: any) {
    filtro.itens.push('Mais opções...');
    filtro.mostrarMais = false;
  }
}