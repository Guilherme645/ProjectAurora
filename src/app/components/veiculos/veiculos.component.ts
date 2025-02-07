import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-veiculos',
  templateUrl: './veiculos.component.html',
  styleUrls: ['./veiculos.component.css']
})
export class VeiculosComponent {
  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
    document.body.classList.add("modal-open");
  }
  
  closeModal() {
    this.isModalOpen = false;
    document.body.classList.remove("modal-open");
  }
}