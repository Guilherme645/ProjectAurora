import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-view-entidades-search',
  templateUrl: './view-entidades-search.component.html',
  styleUrls: ['./view-entidades-search.component.css'],
  standalone: false
})
export class ViewEntidadesSearchComponent  {
  isMobile: boolean = false;
  @Output() click = new EventEmitter<void>(); // Emitir evento para o componente pai

  ngOnInit() {
    this.checkIfMobile();
  }

  @HostListener('window:resize', ['$event'])
  checkIfMobile(): void {
    this.isMobile = window.innerWidth <= 768;
    console.log('isMobile atualizado:', this.isMobile);
  }

  onClick() {
    console.log('Botão "Ver entidades extraídas" clicado');
    this.click.emit(); // Emitir o evento para o componente pai
  }
  verEntidadesExtraidas() {
    // ação: abrir drawer, dialog, navegação etc.
    console.log('Abrindo entidades extraídas');
  }
}
