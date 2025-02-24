import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-input-busca',
  templateUrl: './input-busca.component.html',
  styleUrls: ['./input-busca.component.css']
})
export class InputBuscaComponent {
  @Input() isModalOpen: boolean = false; // Recebe estado do HeaderComponent


  
  constructor(private router: Router) {}
  openModal(): void {
    this.isModalOpen = true;
    console.log('Modal aberto:', this.isModalOpen);
  }
  
  closeModal(): void {
    this.isModalOpen = false;
    console.log('Modal fechado:', this.isModalOpen);
  }
  search() {
    console.log("Fazendo busca...");
    this.closeModal();

    // Redirecionar para /navBar
    this.router.navigate(['/navBar']).then(success => {
      console.log("Navegação bem-sucedida:", success);
    }).catch(err => {
      console.error("Erro ao navegar:", err);
    });
  }
  reloadPage() {
    window.location.href = '/navBar'; // Redireciona e recarrega a página
  }
  
}
