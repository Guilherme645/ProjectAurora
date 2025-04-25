import { Component, HostListener } from '@angular/core';

@Component({
    selector: 'app-searc-basic',
    templateUrl: './searc-basic.component.html',
    styleUrls: ['./searc-basic.component.css'],
    standalone: false
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
    this.isScrolled = scrollTop > 100;  
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
  selectedTab: string = 'todos';

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