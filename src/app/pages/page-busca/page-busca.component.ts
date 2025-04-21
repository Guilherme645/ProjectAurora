import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
    selector: 'app-page-busca',
    templateUrl: './page-busca.component.html',
    styleUrls: ['./page-busca.component.css'],
    standalone: false
})
export class PageBuscaComponent {
  isMobile = window.innerWidth <= 768;
  isMobileSidebarOpen = false;
  isModalVisible: boolean = false;
  @ViewChild('modalWrapper') modalWrapperRef!: ElementRef;
  constructor() {}

  ngOnInit(): void {
    this.checkScreenSize();
  }
  toggleModal() {
    this.isModalVisible = !this.isModalVisible;
    console.log('Estado do modal:', this.isModalVisible);
  }
  

  onSidebarToggled(isOpen: boolean): void {
    this.isMobileSidebarOpen = isOpen;
  }

  @HostListener('window:resize')
  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.isMobileSidebarOpen = true;
    } else {
      this.isMobileSidebarOpen = false;
    }
  }

  
}