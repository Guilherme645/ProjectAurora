import { Component, EventEmitter, HostListener, OnInit, Output, Renderer2 } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
    selector: 'app-tag-filter',
    templateUrl: './tag-filter.component.html',
    styleUrls: ['./tag-filter.component.css'],
    standalone: false
})
export class TagFilterComponent implements OnInit {
  entidades: { [key: string]: string[] } = {};
  filteredEntities: string[] = [];
  isMobile: boolean = false;
  selectedCategory: string = 'Data';
  searchQuery: string = '';
  isMobileModalOpen: boolean = false;
  
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  constructor(private dataservice: DataService, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadEntidades();
  }

  /** 🔹 Carrega as entidades do Service */
  loadEntidades(): void {
    this.dataservice.getEntidades().subscribe({
      next: (data) => {
        this.entidades = data.entidades;
        this.filterEntities();
      },
      error: (err) => {
        console.error('Erro ao carregar entidades:', err);
      }
    });
  }


  @HostListener('window:resize')
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 480;
    if (!this.isMobile) {
      this.isMobileModalOpen = false;
    }
  }

  /** 🔹 Abre o modal e adiciona fundo borrado */
  openMobileModal(): void {
    this.isMobileModalOpen = true;
    this.renderer.addClass(document.body, 'backdrop-blur');
  }

  /** 🔹 Fecha o modal e remove o fundo borrado */
  closeMobileModal(): void {
    this.renderer.removeClass(document.body, 'backdrop-blur');
    this.isMobileModalOpen = false;
    this.closeModal.emit();
  }
  filterEntities(): void {
    if (!this.entidades || !this.entidades[this.selectedCategory]) {
      this.filteredEntities = [];
      return;
    }
    this.filteredEntities = this.entidades[this.selectedCategory];
  }

  /** 🔹 Seleciona uma categoria e atualiza os itens */
  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.filterEntities();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const modal = this.getModalElement();
    if (modal && !modal.contains(event.target as Node) && this.isMobileModalOpen) {
      this.closeMobileModal();
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
