import { Component, HostListener } from '@angular/core';

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
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    this.isScrolled = scrollTop > 100;  // Esconde o cabeçalho após 100px de rolagem
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
