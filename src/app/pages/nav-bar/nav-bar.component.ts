import { Component, HostListener, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  noticias: any[] = []; // Todas as notícias
  filteredNoticias: any[] = []; // Notícias filtradas para exibição
  isMobile: boolean = false;
  isSidebarOpen = true;
  allSelected: boolean = false;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.dataService.getData().subscribe(
      (data) => {
        this.noticias = data.noticias;
        this.filteredNoticias = [...this.noticias]; // Inicialmente, mostra todas as notícias
      },
      (error) => console.error('Erro ao carregar os dados:', error)
    );
  }

  @HostListener('window:resize', [])
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }


  
  onFilterNews(tab: string) {
    if (tab === 'todos') {
      this.filteredNoticias = [...this.noticias];
    } else if (tab === 'brutos') {
      this.filteredNoticias = this.noticias.filter(noticia => 
        noticia.tipo === 'Vídeo' || noticia.tipo === 'Áudio'
      );
    } else if (tab === 'tratados') {
      this.filteredNoticias = this.noticias.filter(noticia => noticia.tipo === 'Texto');
    }
  }

  onSelectAll(selectAll: boolean) {
    this.allSelected = selectAll;
  }
}
