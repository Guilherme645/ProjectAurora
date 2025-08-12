// tag-filter.component.ts
import { Component, EventEmitter, HostListener, OnInit, Output, Renderer2 } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-tag-filter',
  templateUrl: './tag-filter.component.html',
  styleUrls: ['./tag-filter.component.css'],
  standalone: false,
  animations: [
    trigger('slideInOut', [
      state('in', style({ transform: 'translateY(0)', opacity: 1 })),
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateY(20px)', opacity: 0 }))
      ])
    ])
  ]
})
export class TagFilterComponent implements OnInit {
  public Object = Object; 

  entidades: { [key: string]: string[] } = {};
  filteredEntidades: { [key: string]: string[] } = {};
  selectedTags: { [key: string]: string[] } = {};
  
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

  loadEntidades(): void {
    this.dataservice.getEntidades().subscribe({
      next: (data) => {
        this.entidades = data.entidades;
        this.filteredEntidades = { ...this.entidades };
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

  openMobileModal(): void {
    this.isMobileModalOpen = true;
    this.renderer.addClass(document.body, 'backdrop-blur');
  }

  closeMobileModal(): void {
    this.renderer.removeClass(document.body, 'backdrop-blur');
    this.isMobileModalOpen = false;
    this.closeModal.emit();
  }

  filterEntities(): void {
    if (!this.searchQuery) {
      this.filteredEntidades = { ...this.entidades };
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredEntidades = {};
    for (const category of Object.keys(this.entidades)) {
      const filtered = this.entidades[category].filter(item => 
        item.toLowerCase().includes(query)
      );
      if (filtered.length > 0) {
        this.filteredEntidades[category] = filtered;
      }
    }
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    
    const element = document.getElementById(category);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  
  toggleTag(category: string, tag: string): void {
    if (!this.selectedTags[category]) {
      this.selectedTags[category] = [];
    }
    const index = this.selectedTags[category].indexOf(tag);
    if (index > -1) {
      this.selectedTags[category].splice(index, 1);
    } else {
      this.selectedTags[category].push(tag);
    }
  }

  isSelected(category: string, tag: string): boolean {
    return this.selectedTags[category] && this.selectedTags[category].includes(tag);
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