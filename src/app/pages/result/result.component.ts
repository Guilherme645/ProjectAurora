import { Component, HostListener, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  noticias: any[] = []; 
  isMobile: boolean = false;
  isSidebarOpen = true;  
  selectedTab: string = 'todos';
  isDropdownOpen: boolean = false;
  selectedOption: string = 'Mais relevantes';
  filtrosAbertos: boolean = false;
  isScrolled = false;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.checkScreenSize();  // Verifica o tamanho da tela ao carregar a página

    this.dataService.getData().subscribe(
      (data) => {
        this.noticias = data.noticias;
      },
      (error) => console.error('Erro ao carregar os dados:', error)
    );
  }  

  // Detecta mudanças no tamanho da tela e ajusta `isMobile`
  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  setSelectedTab(tab: string): void {
    this.selectedTab = tab;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option: string): void {
    this.selectedOption = option;
    this.isDropdownOpen = false;
  }

  toggleFiltros(): void {
    this.filtrosAbertos = !this.filtrosAbertos;
  }

  // Detecta rolagem e altera estado do cabeçalho
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 100;
  }
  
}
