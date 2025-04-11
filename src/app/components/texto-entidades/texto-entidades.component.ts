import { Component, Input } from '@angular/core';
import { TextoEntidadesService } from 'src/app/services/TextoEntidades.service';

@Component({
  selector: 'app-texto-entidades',
  templateUrl: './texto-entidades.component.html',
  styleUrls: ['./texto-entidades.component.css'],
  standalone: false,
})
export class TextoEntidadesComponent {
  @Input() textoOriginal: string = ''; // Recebe o texto do componente pai
  textoMarcado: string;

  entidades: { pessoas: string[], lugares: string[], organizacoes: string[], datas: string[] };

  datesEnabled = false;
  placesEnabled = false;
  peopleEnabled = false;
  organizationsEnabled = false;

  displayedDates: string[] = [];
  displayedPlaces: string[] = [];
  displayedPeople: string[] = [];
  displayedOrganizations: string[] = [];

  constructor(private textoEntidadesService: TextoEntidadesService) {
    this.textoMarcado = this.textoOriginal;
    this.entidades = this.textoEntidadesService.getEntidades();
    this.displayedDates = this.entidades.datas;
    this.displayedPlaces = this.entidades.lugares;
    this.displayedPeople = this.entidades.pessoas;
    this.displayedOrganizations = this.entidades.organizacoes;
  }

  ngOnChanges(): void {
    this.textoMarcado = this.textoOriginal; // Atualiza textoMarcado quando o input muda
    this.atualizarTextoMarcado(); // Reaplica as substituições
  }

  atualizarTextoMarcado(): void {
    this.textoMarcado = this.textoEntidadesService.substituirEntidades({
      pessoas: this.peopleEnabled,
      lugares: this.placesEnabled,
      organizacoes: this.organizationsEnabled,
      datas: this.datesEnabled
    });
  }

  toggleDates(): void {
    this.datesEnabled = !this.datesEnabled;
    this.atualizarTextoMarcado();
  }

  togglePlaces(): void {
    this.placesEnabled = !this.placesEnabled;
    this.atualizarTextoMarcado();
  }

  togglePeople(): void {
    this.peopleEnabled = !this.peopleEnabled;
    this.atualizarTextoMarcado();
  }

  toggleOrganizations(): void {
    this.organizationsEnabled = !this.organizationsEnabled;
    this.atualizarTextoMarcado();
  }
}