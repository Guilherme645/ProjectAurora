import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-entidades-search',
  templateUrl: './view-entidades-search.component.html',
  styleUrls: ['./view-entidades-search.component.css'],
  standalone: false
})
export class ViewEntidadesSearchComponent  {

  verEntidadesExtraidas() {
    // ação: abrir drawer, dialog, navegação etc.
    console.log('Abrindo entidades extraídas');
  }
}
