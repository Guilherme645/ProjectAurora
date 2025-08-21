import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';

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
 @Output() openVehiclesModalRequest = new EventEmitter<void>();
  @Output() openLocationModalRequest = new EventEmitter<void>();

  @ViewChild('modalWrapper') modalWrapperRef!: ElementRef;
  @ViewChild('highSearchDrawer') highSearchDrawerRef!: ElementRef; // Referência ao HighSearch
  isVehiclesModalOpen: boolean = false;
  isLocationModalOpen: boolean = false;

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
  
  // Abre o modal de veículos e fecha o painel de busca avançada
  openVehiclesModal() {
    this.isSearchOpen = false;
    this.isVehiclesModalOpen = true;
  }
  
  // Fecha o modal de veículos e reabre o painel de busca avançada
  closeVehiclesModal() {
    this.isVehiclesModalOpen = false;
    this.isSearchOpen = true;
  }

  // Abre o modal de localização e fecha o painel de busca avançada
  openLocationModal() {
    this.isSearchOpen = false;
    this.isLocationModalOpen = true;
  }

  // Fecha o modal de localização e reabre o painel de busca avançada
  closeLocationModal() {
    this.isLocationModalOpen = false;
    this.isSearchOpen = true;
  }
}