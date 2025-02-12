import { Component, HostListener, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  noticias: any[] = []; // Armazena o array de notícias
  isMobile: boolean = false; // Flag para identificar se a tela é mobile
  isSidebarOpen = true;  // O sidebar começa aberto

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.checkScreenSize(); // Verifica o tamanho da tela no carregamento
    this.dataService.getData().subscribe(
      (data) => {
        this.noticias = data.noticias; // Certifique-se de usar a chave correta do JSON
      },
      (error) => console.error('Erro ao carregar os dados:', error)
    );
  }

  // Método que verifica o tamanho da tela para definir se é mobile
  @HostListener('window:resize', [])
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768; // Define como mobile se a largura for menor ou igual a 768px
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
