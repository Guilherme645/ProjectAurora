import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
  standalone: false
})
export class ClientsComponent  {
  isModalOpen: boolean = false;

  onUserChange(user: any): void {
    console.log('Usuário alterado:', user);
    // Lógica para lidar com a mudança de usuário
  }

  toggleModal(): void {
    this.isModalOpen = !this.isModalOpen;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
}