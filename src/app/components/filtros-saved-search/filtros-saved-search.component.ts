import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filtros-saved-search',
  templateUrl: './filtros-saved-search.component.html',
  styleUrls: ['./filtros-saved-search.component.css'],
  standalone: false
})
export class FiltrosSavedSearchComponent implements OnInit {
  modalAberto = false; // Controla o modal de "Salvar Busca"
  filtrosAbertos = false; // Controla o modal de filtros na versão mobile
  isMobile = window.innerWidth <= 768;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  isActive: boolean = true; // Controla o estado do botão "Ativa"
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
    if (this.isMobile) {
      this.filtrosAbertos = true; // Abre o modal de filtros automaticamente na versão mobile
    }
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
    this.modalAberto = true; // Abre o modal de "Salvar Busca"
  }

  fecharModal(): void {
    this.modalAberto = false; // Fecha o modal de "Salvar Busca"
    console.log('Modal de salvar busca fechado');
  }

  fecharFiltros(): void {
    this.filtrosAbertos = false; // Fecha o modal de filtros
    this.closeModal.emit(); // Notifica o componente pai
    console.log('Modal de filtros fechado');
  }
}