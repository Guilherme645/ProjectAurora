import { Component } from '@angular/core';

@Component({
  selector: 'app-modal-account',
  templateUrl: './modal-account.component.html',
  styleUrls: ['./modal-account.component.css']
})
export class ModalAccountComponent {
  isOpen = false;

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  openAccount() {
    console.log('Abrindo configurações da conta...');
  }

  logout() {
    console.log('Saindo da conta...');
    // Adicione a lógica de logout real aqui
  }
}
