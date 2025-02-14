import { Component, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isScrolled = false;
  isDropdownOpen = false;
  selectedOption = 'Mais relevantes';
  isBuscaOpen = false;
  @Output() selectAllEvent = new EventEmitter<boolean>(); // Emite evento para selecionar todos
  selectAll: boolean = false; // Controle de seleção
  @Output() filterNewsEvent = new EventEmitter<string>();

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    this.isScrolled = scrollTop > 100;  // Esconde o cabeçalho após 100px de rolagem
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
    this.filterNewsEvent.emit(tab); // Emite o tipo de filtro para o NavBarComponent
  }
  openBusca() {
    this.isBuscaOpen = true;
  }

  closeBusca() {
    this.isBuscaOpen = false;
  }
  selectedTab: string = 'brutos';

  toggleSelectAll() {
    this.selectAll = !this.selectAll;
    this.selectAllEvent.emit(this.selectAll); // Envia o estado de seleção para o pai
  }

toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
}

selectOption(option: string) {
  this.selectedOption = option;
  this.isDropdownOpen = false;
}
isMobile: boolean = false;

@HostListener('window:resize', ['$event'])
onResize() {
  this.checkScreenSize();
}

ngOnInit(): void {
  this.checkScreenSize();
}

private checkScreenSize(): void {
  this.isMobile = window.innerWidth <= 768; // Mobile para telas <= 768px
}
}
