// localizacao.component.ts
import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-localizacao',
  templateUrl: './localizacao.component.html',
  styleUrls: ['./localizacao.component.css']
})
export class LocalizacaoComponent {
  vehiclesList: { [key: string]: string[] } = {};
  selectedCategory: string = 'texto';
  searchQuery: string = '';
  isMobile: boolean = false;
  selectAll: boolean = false;
  isModalOpen: boolean = true;

  // Evento para notificar o pai (HighSearchComponent) quando o modal mobile deve fechar a seção
  @Output() closeSection = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.checkScreenSize();
  }

  // Detecta se está em um dispositivo móvel
  @HostListener('window:resize')
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  estados = [
    { nome: "Acre (AC)", selecionado: false },
    { nome: "Alagoas (AL)", selecionado: false },
    { nome: "Amapá (AP)", selecionado: false },
    { nome: "Amazonas (AM)", selecionado: false },
    { nome: "Bahia (BA)", selecionado: false },
    { nome: "Ceará (CE)", selecionado: false },
    { nome: "Distrito Federal (DF)", selecionado: false },
    { nome: "Espírito Santo (ES)", selecionado: false },
    { nome: "Goiás (GO)", selecionado: false },
    { nome: "Maranhão (MA)", selecionado: false },
    { nome: "Mato Grosso (MT)", selecionado: false },
    { nome: "Mato Grosso do Sul (MS)", selecionado: false },
    { nome: "Minas Gerais (MG)", selecionado: false },
    { nome: "Pará (PA)", selecionado: false },
    { nome: "Paraíba (PB)", selecionado: false },
    { nome: "Paraná (PR)", selecionado: false },
    { nome: "Pernambuco (PE)", selecionado: false },
    { nome: "Piauí (PI)", selecionado: false },
    { nome: "Rio de Janeiro (RJ)", selecionado: false },
    { nome: "Rio Grande do Norte (RN)", selecionado: false },
    { nome: "Rio Grande do Sul (RS)", selecionado: false },
    { nome: "Rondônia (RO)", selecionado: false },
    { nome: "Roraima (RR)", selecionado: false },
    { nome: "Santa Catarina (SC)", selecionado: false },
    { nome: "São Paulo (SP)", selecionado: false },
    { nome: "Sergipe (SE)", selecionado: false },
    { nome: "Tocantins (TO)", selecionado: false }
  ];

  // Função para marcar/desmarcar todos os estados
  toggleAll() {
    this.estados.forEach(estado => estado.selecionado = this.selectAll);
  }

  // Atualiza "Selecionar todos" baseado nos checkboxes individuais
  updateSelectAll() {
    this.selectAll = this.estados.every(estado => estado.selecionado);
  }

  // Método para fechar o modal e notificar o pai
  closeModal() {
    this.isModalOpen = false;
    this.closeSection.emit(); // Emite o evento para fechar a seção no HighSearchComponent
  }

  // Detectar a tecla ESC e fechar o modal
  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    this.closeModal();
  }
}