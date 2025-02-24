import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tag-filter',
  templateUrl: './tag-filter.component.html',
  styleUrls: ['./tag-filter.component.css']
})
export class TagFilterComponent implements OnInit {
  entidades: any = {}; // Dados carregados do JSON
  filteredEntities: any[] = []; // Lista de entidades filtradas
  isMobileModalOpen: boolean = false;
  isMobile: boolean = false;
  selectedCategory: string = 'Data'; // Categoria selecionada
  searchQuery: string = ''; // Texto de busca
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>(); // 🔥 Evento para fechar o modal

  categorias = [
    { nome: 'Data', itens: ['sexta-feira', 'janeiro', '2024'] },
    { nome: 'Profissão', itens: ['ministros', 'advogados', 'juiz'] },
    { nome: 'Pessoa', itens: ['Dias Toffoli', 'Rosa Weber', 'Alexandre de Moraes'] },
    { nome: 'Lugar', itens: ['Rio Grande do Sul', 'Brasília'] },
    { nome: 'Organização', itens: ['STF', 'OAB'] }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadEntidades();
  }

  // Carrega entidades do arquivo JSON
  loadEntidades(): void {
    this.http.get<any>('assets/data.json').subscribe({
      next: (data) => {
        this.entidades = data.entidades;
        this.filterEntities(); // Filtra entidades ao carregar
      },
      error: (err) => {
        console.error('Erro ao carregar entidades:', err);
      }
    });
  }

  // Filtra entidades com base na categoria selecionada e no texto de busca
  filterEntities(): void {
    if (!this.entidades || !this.entidades[this.selectedCategory]) {
      this.filteredEntities = [];
      return;
    }

    this.filteredEntities = this.entidades[this.selectedCategory].filter((entity: string) =>
      entity.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Detecta redimensionamento de tela para verificar se é mobile
  @HostListener('window:resize')
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 480; // Mantém o limite de 480px para mobile
    if (!this.isMobile) {
      this.isMobileModalOpen = false; // Fecha o modal se mudar para desktop
    }
  }

  // Abre o modal mobile
  openMobileModal(): void {
    this.isMobileModalOpen = true;
  }

  closeMobileModal(): void {
    this.closeModal.emit(); // 🔥 Emite o evento para o componente pai
  }

  // Atualiza a categoria selecionada
  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.filterEntities();
  }

  // Fecha o modal ao clicar fora (mantém a versão mobile se isMobile for true)
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const modal = this.getModalElement();
    if (modal && !modal.contains(event.target as Node) && this.isMobileModalOpen) {
      this.closeMobileModal(); // Fecha o modal mobile
    }
  }

  // Obtém o elemento do modal mobile no DOM
  private getModalElement(): HTMLElement | null {
    return document.querySelector('.mobile-modal-container') as HTMLElement;
  }

  // Fecha o modal ao pressionar a tecla Escape (mantém a versão mobile)
  @HostListener('window:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent): void {
    this.closeMobileModal();
  }
}
