import { Component } from '@angular/core';
import { TextoEntidadesService } from '../services/TextoEntidades.service';

@Component({
  selector: 'app-descricao-container',
  template: `
    <div class="container">
      <h1>Descrição e Entidades</h1>
      <app-descricao></app-descricao>
      <app-texto-entidades [textoOriginal]="textoOriginal"></app-texto-entidades>
    </div>
  `,
  styleUrls: ['./descricao-container.component.css'],
  standalone: false,
})
export class DescricaoContainerComponent {
  textoOriginal: string;

  constructor(private textoEntidadesService: TextoEntidadesService) {
    this.textoOriginal = this.textoEntidadesService.getTextoOriginal();
  }
}