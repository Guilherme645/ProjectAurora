import { Component, EventEmitter, HostListener, Output, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
    selector: 'app-localizacao',
    templateUrl: './localizacao.component.html',
    styleUrls: ['./localizacao.component.css'],
    standalone: false
})
export class LocalizacaoComponent implements OnInit {
  @Output() closeSection = new EventEmitter<void>(); // Evento para fechar modal

  isMobile: boolean = false;
  selectAll: boolean = false;
  isModalOpen: boolean = true;
  estados: { nome: string; selecionado: boolean }[] = [];
  estadosFiltrados: { nome: string; selecionado: boolean }[] = []; 

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadEstados();
  }

  @HostListener('window:resize')
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  /** 🔹 Carrega os estados do serviço */
  private loadEstados(): void {
    this.dataService.getEstados().subscribe(
      (estados) => {
        if (Array.isArray(estados)) {
          this.estados = estados.map(estado => ({
            nome: estado.nome,
            selecionado: estado.selecionado || false
          }));
          this.estadosFiltrados = [...this.estados]; 
        } else {
          console.error('Erro: Os estados retornados não são um array válido', estados);
        }
      },
      (error) => {
        console.error('Erro ao carregar estados:', error);
      }
    );
  }

  filtrarEstados(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.estadosFiltrados = this.estados.filter(estado =>
      estado.nome.toLowerCase().includes(query)
    );
  }

  toggleAll(): void {
    this.estadosFiltrados.forEach(estado => estado.selecionado = this.selectAll);
    this.syncSelection();
  }

  updateSelectAll(): void {
    this.selectAll = this.estadosFiltrados.every(estado => estado.selecionado);
    this.syncSelection();
  }

  private syncSelection(): void {
    this.estados.forEach(estado => {
      const match = this.estadosFiltrados.find(f => f.nome === estado.nome);
      if (match) estado.selecionado = match.selecionado;
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.closeSection.emit();
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey(): void {
    this.closeModal();
  }
}
