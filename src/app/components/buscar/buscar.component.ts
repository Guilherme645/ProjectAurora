import { Component, HostListener } from '@angular/core';
import { DrawerService } from 'src/app/services/drawer.service';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css'],
})
export class BuscarComponent {
  searchQuery: string = '';
  isDrawerOpen = false; // Controle do estado do drawer
  isMobile = window.innerWidth <= 768;
  isAdvancedSearchOpen = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth <= 768;
  }
  constructor(private drawerService: DrawerService) {}

  ngOnInit() {
    this.drawerService.drawerState$.subscribe((state) => {
      this.isDrawerOpen = state; // Atualiza o estado com o serviço
    });
  }

  openAdvancedSearch() {
    this.drawerService.openDrawer(); // Abre o drawer
  }

  closeDrawer() {
    this.drawerService.closeDrawer(); // Fecha o drawer
  }

  onSearch(): void {
    console.log('Buscando por:', this.searchQuery);
  }
  
}
