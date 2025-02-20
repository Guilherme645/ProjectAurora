import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-veiculos',
  templateUrl: './veiculos.component.html',
  styleUrls: ['./veiculos.component.css']
})
export class VeiculosComponent implements OnInit {
  isMobile: boolean = false; // Verifica se está em um dispositivo móvel
  selectAll: boolean = false;
  selectAllText: boolean = false;
  selectAllVideo: boolean = false;
  selectAllAudio: boolean = false;
  selectedCategory: string = '';
  isModalOpen: boolean = true; // Controla a visibilidade do modal
  categorias: string[] = ['Texto', 'Vídeo', 'Áudio']; // Adiciona a propriedade correta

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.checkScreenSize();
    }


  @HostListener('window:resize')
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

// Listas de veículos
textVehicles = [
  { nome: "O Dia", selecionado: false },
  { nome: "O Globo", selecionado: false },
  { nome: "Jornal do Brasil", selecionado: false },
  { nome: "Jornal do Comércio", selecionado: false },
  { nome: "A Tribuna da Imprensa", selecionado: false },
  { nome: "Folha Dirigida", selecionado: false },
  { nome: "A Voz da Serra", selecionado: false },
  { nome: "Tribuna de Petrópolis", selecionado: false },
  { nome: "Inverta - Jornal para Ver...", selecionado: false },
  { nome: "Correio Brasiliense", selecionado: false }
];

videoVehicles = [
  { nome: "Agência Brasil", selecionado: false },
  { nome: "Diário Oficial", selecionado: false },
  { nome: "Globo - Ideal TV", selecionado: false },
  { nome: "Amazonas", selecionado: false },
  { nome: "Bahia Video", selecionado: false },
  { nome: "Ceará Video", selecionado: false },
  { nome: "Distrito Federal Video", selecionado: false },
  { nome: "Espírito Santo Video", selecionado: false },
  { nome: "Goiás Video", selecionado: false },
  { nome: "Minas Gerais Video", selecionado: false }
];

audioVehicles = [
  { nome: "Acre Audio", selecionado: false },
  { nome: "Alagoas Audio", selecionado: false },
  { nome: "Amapá Audio", selecionado: false },
  { nome: "Amazonas Audio", selecionado: false },
  { nome: "Bahia Audio", selecionado: false },
  { nome: "Ceará Audio", selecionado: false },
  { nome: "Distrito Federal Audio", selecionado: false },
  { nome: "Espírito Santo Audio", selecionado: false },
  { nome: "Goiás Audio", selecionado: false },
  { nome: "Minas Gerais Audio", selecionado: false }
];


 // Método para selecionar todos os veículos de uma categoria
  toggleAll(category: string): void {
    if (category === 'text') {
      this.selectAllText = !this.selectAllText;
      this.textVehicles.forEach(v => v.selecionado = this.selectAllText);
    } else if (category === 'video') {
      this.selectAllVideo = !this.selectAllVideo;
      this.videoVehicles.forEach(v => v.selecionado = this.selectAllVideo);
    } else if (category === 'audio') {
      this.selectAllAudio = !this.selectAllAudio;
      this.audioVehicles.forEach(v => v.selecionado = this.selectAllAudio);
    }
  }

  // Método para atualizar "Selecionar todos" quando um checkbox individual for marcado
  updateSelectAll(): void {
    this.selectAllText = this.textVehicles.every(v => v.selecionado);
    this.selectAllVideo = this.videoVehicles.every(v => v.selecionado);
    this.selectAllAudio = this.audioVehicles.every(v => v.selecionado);
  }

    // Método para fechar o modal
    closeModal() {
      this.isModalOpen = false;
    }
  
    // Detectar a tecla ESC e fechar o modal
    @HostListener('document:keydown.escape', ['$event'])
    handleEscapeKey(event: KeyboardEvent) {
      this.closeModal();
    }
    getVehiclesByCategory(category: string) {
      switch (category) {
        case 'Texto': return this.textVehicles;
        case 'Vídeo': return this.videoVehicles;
        case 'Áudio': return this.audioVehicles;
        default: return [];
      }
    }
    
  
  
}