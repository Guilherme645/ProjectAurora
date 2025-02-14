import { Component, HostListener, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  noticias: any[] = []; 
  isMobile: boolean = false;
  isSidebarOpen = true;  

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.checkScreenSize();  // Verifica o tamanho da tela no carregamento inicial

    this.dataService.getData().subscribe(
      (data) => {
        this.noticias = data.noticias;
      },
      (error) => console.error('Erro ao carregar os dados:', error)
    );
  }  
  
  // Método para verificar o tamanho da tela e definir o estado de `isMobile`
  @HostListener('window:resize', [])
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
