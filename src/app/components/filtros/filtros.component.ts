import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';

interface Filtro {
  nome: string;
  aberto: boolean;
  itens: string[];
  mostrarMais: boolean;
}

interface Badge {
  id: number;
  nome: string;
  width: number;
  textWidth: number;
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

  badges: Badge[] = [
    { id: 1, nome: 'Manhã', width: 75, textWidth: 47 },
    { id: 2, nome: 'Texto', width: 68, textWidth: 40 }
  ];

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
    const baseItems: { [key: string]: { name: string; baseCount: number }[] } = {
      'Hora': [
        { name: 'Madrugada', baseCount: 1000 },
        { name: 'Tarde Tardia', baseCount: 1500 },
        { name: 'Noite Tardia', baseCount: 800 }
      ],
      'Tipo de mídia': [
        { name: 'Imagem', baseCount: 2000 },
        { name: 'Documento', baseCount: 1200 },
        { name: 'Live', baseCount: 900 }
      ],
      'Veículos': [
        { name: 'UOL', baseCount: 850 },
        { name: 'Estadão', baseCount: 700 },
        { name: 'Folha', baseCount: 600 }
      ],
      'Sentimento': [
        { name: 'Muito Positivo', baseCount: 300 },
        { name: 'Muito Negativo', baseCount: 150 },
        { name: 'Indiferente', baseCount: 100 }
      ],
      'Localização': [
        { name: 'Minas Gerais', baseCount: 700 },
        { name: 'Bahia', baseCount: 550 },
        { name: 'Paraná', baseCount: 400 }
      ]
    };

    const additionalItems = baseItems[filtro.nome] || [
      { name: 'Item Extra 1', baseCount: 500 },
      { name: 'Item Extra 2', baseCount: 400 },
      { name: 'Item Extra 3', baseCount: 300 }
    ];

    const newItems = additionalItems.map((item, index) => {
      const existingCounts = filtro.itens.map(i => parseInt(i.match(/\d+/)?.[0] || '0'));
      const nextCount = Math.max(...existingCounts, item.baseCount) + (index * 100);
      return `${item.name} (${nextCount})`;
    });

    filtro.itens.push(...newItems);
    filtro.mostrarMais = false;
  }

  removerBadge(id: number): void {
    this.badges = this.badges.filter(badge => badge.id !== id);
  }

  openModal(): void {
    if (this.isMobile) {
      this.modalAberto = true; // Open mobile modal locally
    } else {
      this.openSaveSearchModal.emit(); // Emit event for desktop modal
    }
  }

  checkDates(): void {
    if (this.dataInicio && this.dataFim && this.dataFim < this.dataInicio) {
      alert('A data final não pode ser anterior à data inicial.');
      this.dataFim = this.dataInicio;
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