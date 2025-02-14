import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
  selector: 'app-tag-filter',
  templateUrl: './tag-filter.component.html',
  styleUrls: ['./tag-filter.component.css']
})
export class TagFilterComponent {
  entidades: any = {};  // Dados carregados do JSON
  isMobileModalOpen = false;
  isMobile = true; // Supondo que já tenha a lógica para detectar dispositivo

  constructor(private http: HttpClient) {}

  openMobileModal() {
    this.isMobileModalOpen = true;
  }
  
  closeMobileModal() {
    this.isMobileModalOpen = false;
  }
  
   @HostListener('window:resize')
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 480; // Define mobile se for menor ou igual a 768px
  }


  ngOnInit(): void {
    this.loadEntidades();
  }

  loadEntidades(): void {
    this.http.get<any>('assets/data.json').subscribe((data) => {
      this.entidades = data.entidades;
    });
  }
}