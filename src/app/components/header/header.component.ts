import { Component, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isScrolled: boolean = false;
  isDropdownOpen: boolean = false;
  isBuscaOpen: boolean = false;
  isMobile: boolean = false;
  selectedOption: string = 'Mais relevantes';
  selectedTab: string = 'brutos';
  selectAll: boolean = false;

  @Output() selectAllEvent = new EventEmitter<boolean>();
  @Output() filterNewsEvent = new EventEmitter<string>();

  ngOnInit(): void {
    this.checkScreenSize();
  }

  // Detecta rolagem da janela
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    this.isScrolled = scrollTop > 100;  // Esconde o cabeçalho após 100px de rolagem
  }

  // Detecta redimensionamento da janela para ajustar a tela
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }


  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768; 
  }

  // Ações para abrir e fechar a busca
  openBusca() {
    this.isBuscaOpen = true;
    document.querySelector('.mensoes-container')?.classList.add('blurred');
  }

  closeBusca() {
    this.isBuscaOpen = false;
    document.querySelector('.mensoes-container')?.classList.remove('blurred');
  }

  // Alternar seleção de todos
  toggleSelectAll() {
    this.selectAll = !this.selectAll;
    this.selectAllEvent.emit(this.selectAll);  
  }

  // Alternar dropdown de ordenação
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Seleciona uma opção de ordenação
  selectOption(option: string) {
    this.selectedOption = option;
    this.isDropdownOpen = false;
  }

  // Seleciona uma aba (tab) e emite um evento para o NavBarComponent
  selectTab(tab: string) {
    this.selectedTab = tab;
    this.filterNewsEvent.emit(tab);
  }
}
