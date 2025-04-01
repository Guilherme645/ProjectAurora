import { Component, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-option-search',
  templateUrl: './option-search.component.html',
  styleUrls: ['./option-search.component.css'],
  standalone: false,
})
export class OptionSearchComponent {
  isMenuOpen: boolean = false;
  modalAberto = false;
  duplicateModalAberto = false;  // Modal de Duplicação de Busca
  removeModalAberto = false;

  dropdownPosition: { top: number; left: number } = { top: 0, left: 0 };

  constructor(private elementRef: ElementRef) {}

  // Toggle the dropdown menu
  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;

    if (this.isMenuOpen) {
      const button = (event.target as HTMLElement).closest('button');
      if (button) {
        const rect = button.getBoundingClientRect();
        const dropdownWidth = 187; // Largura do dropdown
        this.dropdownPosition = {
          top: rect.bottom + window.scrollY + 5, // 5px abaixo do botão
          left: rect.right + window.scrollX - dropdownWidth, // Alinha o lado direito do dropdown com o lado direito do botão
        };
      }
    }
  }

  // Método para salvar edições no modal de Edição
  saveEdits() {
    console.log('Edições salvas pelo componente pai!');
    this.modalAberto = false; // Fecha a modal de edição
    this.isMenuOpen = false; // Fecha o menu suspenso
  }

  // Close the menu and modal if clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const clickedInsideMenu = this.elementRef.nativeElement.contains(target);
    const clickedInsideRemoveModal = target.closest('.remove-modal');
    const clickedInsideDuplicateModal = target.closest('.modal-overlay');

    if (!clickedInsideMenu && !clickedInsideRemoveModal && !clickedInsideDuplicateModal) {
      this.isMenuOpen = false;
      this.removeModalAberto = false;
      this.duplicateModalAberto = false;  // Fecha o modal de duplicação ao clicar fora
    }
  }

  // Métodos de ação para o menu
  editSearch(): void {
    console.log('Edit search clicked');
    this.modalAberto = true; // Abre o modal de edição
    this.isMenuOpen = false;
  }

  // Método para abrir o modal de duplicação
  duplicateSearch(): void {
    console.log('Duplicate search clicked');
    this.duplicateModalAberto = true;  // Exibe o modal de duplicação
  }



  // Método para abrir o modal de remoção
  removeSearch(): void {
    this.removeModalAberto = true; // Abre o modal de remoção
    this.isMenuOpen = false;
  }

  // Métodos para lidar com os eventos da modal de remoção
  onCancelRemove(): void {
    this.removeModalAberto = false; // Fecha o modal de remoção
  }

  closeDuplicateModal() {
    this.duplicateModalAberto = false;  // Fecha o modal de duplicação
  }


  onConfirmRemove(): void {
    console.log('Busca removida!');
    this.removeModalAberto = false; // Fecha o modal de remoção
  }
}
