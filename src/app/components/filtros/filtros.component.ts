import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';

interface Filtro {
  nome: string;
  aberto: boolean;
  itens: string[];
  mostrarMais: boolean;
}

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.css'],
  standalone: false,
})
export class FiltrosComponent implements OnInit {
  modalAberto = false; // Used only for mobile modal
  isMobile = window.innerWidth <= 768;
  dataInicio: Date | null = null;
  dataFim: Date | null = null;
  @Output() closeModal = new EventEmitter<void>(); // For mobile filters overlay
  @Output() openSaveSearchModal = new EventEmitter<void>(); // For desktop modal open
  @Output() closeSaveSearchModal = new EventEmitter<void>(); // For desktop modal close

  filtros: Filtro[] = [
    { nome: 'Hora', aberto: true, itens: ['Manhã (4091)', 'Tarde (3291)', 'Noite (1827)'], mostrarMais: false },
    { nome: 'Data', aberto: true, itens: [], mostrarMais: false },
    { nome: 'Tipo de mídia', aberto: true, itens: ['Áudio (4091)', 'Texto (3291)', 'Vídeo (1827)'], mostrarMais: false },
    { nome: 'Veículos', aberto: true, itens: ['G1 (1121)', 'Globo (971)', 'R7 (911)'], mostrarMais: true },
    { nome: 'Sentimento', aberto: true, itens: ['Positivo (442)', 'Negativo (221)', 'Neutro (172)'], mostrarMais: false },
    {
      nome: 'Localização',
      aberto: true,
      itens: ['Distrito Federal (1072)', 'Rio de Janeiro (937)', 'São Paulo (813)'],
      mostrarMais: true,
    },
  ];

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleSection(nome: string | undefined): void {
    if (!nome) return; // Guard against undefined
    const filtro = this.filtros.find((f) => f.nome === nome);
    if (filtro) filtro.aberto = !filtro.aberto;
  }

  mostrarMais(filtro: Filtro): void {
    filtro.itens.push(...['Mais 1', 'Mais 2', 'Mais 3']);
    filtro.mostrarMais = false;
  }

  openModal(): void {
    if (this.isMobile) {
      this.modalAberto = true; // Open mobile modal locally
    } else {
      this.openSaveSearchModal.emit(); // Emit event for desktop modal
    }
  }

  fecharModal(): void {
    if (this.isMobile) {
      this.modalAberto = false; // Close mobile modal locally
    }
    this.closeSaveSearchModal.emit(); // Emit event for desktop modal
  }

  closeMobileModal(): void {
    this.closeModal.emit(); // Close mobile filters overlay
  }

  trackByFilter(index: number, filtro: Filtro): string {
    return filtro.nome;
  }
}