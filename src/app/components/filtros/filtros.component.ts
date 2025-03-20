import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-filtros',
    templateUrl: './filtros.component.html',
    styleUrls: ['./filtros.component.css'],
    standalone: false
})
export class FiltrosComponent implements OnInit {
  modalAberto = false;
  isMobile = window.innerWidth <= 768;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  filtros = [
    { nome: 'Hora', aberto: true, itens: ['Manhã (4091)', 'Tarde (3291)', 'Noite (1827)'], mostrarMais: false },
    { nome: 'Data', aberto: true, itens: [], mostrarMais: false },
    { nome: 'Tipo de mídia', aberto: true, itens: ['Áudio (4091)', 'Texto (3291)', 'Vídeo (1827)'], mostrarMais: false },
    { nome: 'Veículos', aberto: true, itens: ['G1 (1121)', 'Globo (971)', 'R7 (911)'], mostrarMais: true },
    { nome: 'Sentimento', aberto: true, itens: ['Positivo (442)', 'Negativo (221)', 'Neutro (172)'], mostrarMais: false },
    { nome: 'Localização', aberto: true, itens: ['Distrito Federal (1072)', 'Rio de Janeiro (937)', 'São Paulo (813)'], mostrarMais: true }
  ];

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleSection(nome: string): void {
    const filtro = this.filtros.find(f => f.nome === nome);
    if (filtro) filtro.aberto = !filtro.aberto;
  }

  mostrarMais(filtro: any): void {
    filtro.itens.push(...['Mais 1', 'Mais 2', 'Mais 3']);
    filtro.mostrarMais = false;
  }

  openModal(): void {
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
    console.log('Modal fechado');
  }

  closeMobileModal(): void {
    this.closeModal.emit();
  }

  
}
