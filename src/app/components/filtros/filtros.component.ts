import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.css']
})
export class FiltrosComponent {
  modalAberto = false;  // Exemplo de estado para o modal
  isMobile: boolean = false;

  filtros = [
    { nome: 'Hora', aberto: true, itens: ['Manhã (4091)', 'Tarde (3291)', 'Noite (1827)'], mostrarMais: false },
    { nome: 'Data', aberto: true, itens: ['Data Início', 'Data Fim'], mostrarMais: false },
    { nome: 'Tipo de mídia', aberto: true, itens: ['Áudio (4091)', 'Texto (3291)', 'Vídeo (1827)'], mostrarMais: false },
    { nome: 'Veículos', aberto: true, itens: ['G1 (1121)', 'Globo (971)', 'R7 (911)'], mostrarMais: true },
    { nome: 'Sentimento', aberto: true, itens: ['Positivo (442)', 'Negativo (221)', 'Neutro (172)'], mostrarMais: false },
    { nome: 'Localização', aberto: true, itens: ['Distrito Federal (1072)', 'Rio de Janeiro (937)', 'São Paulo (813)'], mostrarMais: true },
  ];

  toggleSection(nome: string) {
    const filtro = this.filtros.find(f => f.nome === nome);
    if (filtro) filtro.aberto = !filtro.aberto; // Alterna a abertura da seção
  }
  @HostListener('window:resize')
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

 
  mostrarMais(filtro: any) {
    filtro.itens.push('Mais opções...');
    filtro.mostrarMais = false;
  }
  openModal() {
    this.modalAberto = true; // Abre o modal
  }

  closeModal() {
    this.modalAberto = false; // Fecha o modal
  }

  fecharModal() {
    this.modalAberto = false;
    console.log('Modal fechado');
  }
}