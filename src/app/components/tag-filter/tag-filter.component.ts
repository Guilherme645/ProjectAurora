import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tag-filter',
  templateUrl: './tag-filter.component.html',
  styleUrls: ['./tag-filter.component.css']
})
export class TagFilterComponent implements OnInit {
  entidades: any = {}; 
  filteredEntities: any[] = []; 
  isMobileModalOpen: boolean = false;
  isMobile: boolean = false;
  selectedCategory: string = 'Data'; 
  searchQuery: string = ''; 
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

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

  loadEntidades(): void {
    this.http.get<any>('assets/data.json').subscribe({
      next: (data) => {
        this.entidades = data.entidades;
        this.filterEntities(); 
      },
      error: (err) => {
        console.error('Erro ao carregar entidades:', err);
      }
    });
  }

  filterEntities(): void {
    if (!this.entidades || !this.entidades[this.selectedCategory]) {
      this.filteredEntities = [];
      return;
    }

    this.filteredEntities = this.entidades[this.selectedCategory].filter((entity: string) =>
      entity.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  @HostListener('window:resize')
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 480; 
    if (!this.isMobile) {
      this.isMobileModalOpen = false; 
    }
  }

  openMobileModal(): void {
    this.isMobileModalOpen = true;
  }

  closeMobileModal(): void {
    this.closeModal.emit(); 
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.filterEntities();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const modal = this.getModalElement();
    if (modal && !modal.contains(event.target as Node) && this.isMobileModalOpen) {
      this.closeMobileModal(); // Fecha o modal mobile
    }
  }

  private getModalElement(): HTMLElement | null {
    return document.querySelector('.mobile-modal-container') as HTMLElement;
  }

  @HostListener('window:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent): void {
    this.closeMobileModal();
  }
}
