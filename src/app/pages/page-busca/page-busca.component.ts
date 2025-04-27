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
  isSearchOpen: boolean = false; // Controla o estado do HighSearch

  @ViewChild('modalWrapper') modalWrapperRef!: ElementRef;
  @ViewChild('highSearchDrawer') highSearchDrawerRef!: ElementRef; // Referência ao HighSearch

  constructor() {}

  ngOnInit(): void {
    this.checkScreenSize();
  }

  toggleModal() {
    this.isModalVisible = !this.isModalVisible;
    console.log('Estado do modal:', this.isModalVisible);
  }

  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
  }

  closeHighSearch() {
    this.isSearchOpen = false;
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Fechar o modal de conta se clicar fora
    if (this.isModalVisible && this.modalWrapperRef && !this.modalWrapperRef.nativeElement.contains(target)) {
      this.isModalVisible = false;
    }

    // Fechar o HighSearch se clicar fora
    if (this.isSearchOpen && this.highSearchDrawerRef && !this.highSearchDrawerRef.nativeElement.contains(target)) {
      this.closeHighSearch();
    }
  }
}