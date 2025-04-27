import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-input-busca',
  templateUrl: './input-busca.component.html',
  styleUrls: ['./input-busca.component.css'],
  standalone: false
})
export class InputBuscaComponent {
  @Input() isModalOpen: boolean = false;
  @Output() closeBusca = new EventEmitter<void>(); // <-- adicionado

  isMobile: boolean = window.innerWidth <= 768;

  constructor(private router: Router) {}

  @HostListener('window:resize')
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.closeBusca.emit(); // <-- emitir para o pai (NavBarComponent)
  }

  search(): void {
    this.closeModal();
    this.router.navigateByUrl('/navBar');
  }

  reloadPage(): void {
    this.router.navigateByUrl('/navBar').then(() => window.location.reload());
  }
}
