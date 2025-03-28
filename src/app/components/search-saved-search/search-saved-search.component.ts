import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-saved-search',
  templateUrl: './search-saved-search.component.html',
  styleUrls: ['./search-saved-search.component.css'],
  standalone: false
})
export class SearchSavedSearchComponent  {

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
