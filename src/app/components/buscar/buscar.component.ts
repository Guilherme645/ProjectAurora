import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css'],
})
export class BuscarComponent {
  searchQuery: string = '';
  isMobile = window.innerWidth <= 768;
  isAdvancedSearchOpen = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth <= 768;
  }

  constructor(private router: Router) {}

  onSearch(): void {
    console.log('Buscando por:', this.searchQuery);
    this.router.navigate(['/navBar'], { queryParams: { query: this.searchQuery } });
  }

  toggleAdvancedSearch(): void {
    this.isAdvancedSearchOpen = !this.isAdvancedSearchOpen;
  }
}
