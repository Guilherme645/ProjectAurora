import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-searchbasicmobile',
  templateUrl: './searchbasicmobile.component.html',
  styleUrls: ['./searchbasicmobile.component.css'],
  standalone: false
})
export class SearchbasicmobileComponent {
  @Output() close = new EventEmitter<void>();
  isAdvancedSearchOpen = false;
  isMobile = window.innerWidth <= 768; // Detecta mobile
  searchQuery: string = '';

  constructor(private router: Router) {}


  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  ngOnInit() {
  }

  toggleAdvancedSearch() {
    this.isAdvancedSearchOpen = !this.isAdvancedSearchOpen;
  }

  closeHighSearch() {
    this.isAdvancedSearchOpen = false;
  }
  onCancel(): void {
    this.close.emit();
  }
  onSearch() {
    if (this.searchQuery.trim()) {
      // Redireciona para a Navbar com o parâmetro da pesquisa
      this.router.navigate(['/navBar'], { queryParams: { search: this.searchQuery } })
        .then(() => {
          window.location.reload(); // Recarrega a página após a navegação
        });
    }
  }
}