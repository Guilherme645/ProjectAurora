import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-buscar',
    templateUrl: './buscar.component.html',
    styleUrls: ['./buscar.component.css'],
    standalone: false
})
export class BuscarComponent {
  searchQuery: string = '';
  isMobile = window.innerWidth <= 768;
  isAdvancedSearchOpen = false;
  modoSelecionado: string = 'simples'; 
  isHighSearchVisible = true; 
  isSearchOpen: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth <= 768;
  }

  constructor(private router: Router) {}

  onSearch(): void {
    console.log('Buscando por:', this.searchQuery);
    this.router.navigate(['/navBar'], { queryParams: { query: this.searchQuery } });
  }

  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
  }

  selecionarModo(modo: string) {
    this.modoSelecionado = modo;
  }

  toggleAdvancedSearch(): void {
    this.isAdvancedSearchOpen = !this.isAdvancedSearchOpen;
  }

  
}
