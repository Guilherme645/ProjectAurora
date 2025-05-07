import { Component, EventEmitter, HostListener, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css'],
  standalone: false
})
export class BuscarComponent implements OnChanges {
  searchQuery: string = '';
  isMobile = window.innerWidth <= 768;
  modoSelecionado: string = 'simples';

  @Input() isSearchOpen: boolean = false; // Recebe o estado do HighSearch do pai
  @Output() toggleAdvancedSearch = new EventEmitter<void>();
  @Output() closeAdvancedSearch = new EventEmitter<void>();

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth <= 768;
  }

  constructor(private router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Detecta mudanças no isSearchOpen
    if (changes['isSearchOpen']) {
      const currentValue = changes['isSearchOpen'].currentValue;
      // Se o HighSearch foi fechado (isSearchOpen mudou para false), muda para modo "simples"
      if (!currentValue) {
        this.modoSelecionado = 'simples';
      }
    }
  }

  onSearch(): void {
    console.log('Buscando por:', this.searchQuery);
    this.router.navigate(['/resultado'], { queryParams: { query: this.searchQuery } });
  }

  selecionarModo(modo: string) {
    this.modoSelecionado = modo;
  }

  onToggleAdvancedSearch(): void {
    this.toggleAdvancedSearch.emit();
  }

  onCloseAdvancedSearch(): void {
    this.closeAdvancedSearch.emit();
  }
}