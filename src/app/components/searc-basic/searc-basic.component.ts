import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-searc-basic',
  templateUrl: './searc-basic.component.html',
  styleUrls: ['./searc-basic.component.css']
})
export class SearcBasicComponent {
isScrolled = false;
searchQuery: string = '';

  isDropdownOpen = false;
  selectedOption = 'Mais relevantes';
  isBuscaOpen = false;
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    this.isScrolled = scrollTop > 100;  // Esconde o cabeçalho após 100px de rolagem
  }

  openAdvancedSearch(): void {
    console.log('Buscando por:', this.searchQuery);
  }
  openBusca() {
    this.isBuscaOpen = true;
  }

  closeBusca() {
    this.isBuscaOpen = false;
  }
  selectedTab: string = 'brutos';

selectTab(tab: string) {
  this.selectedTab = tab;
}
toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
}

selectOption(option: string) {
  this.selectedOption = option;
  this.isDropdownOpen = false;
}
onSearch(){}
}
