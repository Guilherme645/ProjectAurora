import { Component } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent {
  isExpanded: boolean = true;
  menuOpen = false;

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }
  activeTab: string = 'Tab 2'; // Define a aba ativa inicialmente

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  isModalOpen = false;

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}