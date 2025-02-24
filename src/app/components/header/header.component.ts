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
  exibirBuscaAvancada: boolean = false;
  isCollapsed: boolean = false; // Novo estado para recolher o cabeçalho




  @Output() selectAllEvent = new EventEmitter<boolean>();
  @Output() filterNewsEvent = new EventEmitter<string>();

  ngOnInit(): void {
    this.checkScreenSize();
  }

  // Detecta rolagem da janela
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    this.isCollapsed = scrollTop > 50; // Recolhe o cabeçalho após 50px de rolagem
  }
  abrirBuscaAvancada() {
    this.exibirBuscaAvancada = !this.exibirBuscaAvancada;
  }
  // Detecta redimensionamento da janela para ajustar a tela
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768; 
  }

  openBusca(): void {
    this.isBuscaOpen = true;
  }

  closeBusca(): void {
    this.isBuscaOpen = false;
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    this.closeBusca();
  }
  
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('app-input-busca') && !target.closest('app-header')) {
      this.closeBusca();
    }
  }

  // Alternar seleção de todos
  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    this.selectAllEvent.emit(this.selectAll);  
  }

  // Alternar dropdown de ordenação
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Seleciona uma opção de ordenação
  selectOption(option: string): void {
    this.selectedOption = option;
    this.isDropdownOpen = false;
  }

  // Seleciona uma aba (tab) e emite um evento para o NavBarComponent
  selectTab(tab: string): void {
    this.selectedTab = tab;
    this.filterNewsEvent.emit(tab);
  }
  





















  
}