import { Component, OnInit } from '@angular/core';
import { TextoEntidadesService } from '../services/TextoEntidades.service';

@Component({
  selector: 'app-descricao',
  template: `<p>{{ descricao }}</p>`,
  standalone: false,
})
export class DescricaoComponent implements OnInit {
  descricao: string;

  constructor(private textoEntidadesService: TextoEntidadesService) {
    this.descricao = '';
  }

  ngOnInit(): void {
    this.descricao = this.textoEntidadesService.getTextoOriginal();
  }
}