import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private jsonUrl = 'assets/data.json'; // Caminho para o arquivo JSON
  private filtrosSelecionados: any = {}; // Armazena os filtros selecionados

  constructor(private http: HttpClient) {}

  // Método para obter os dados do JSON
  getData(): Observable<any> {
    return this.http.get<any>(this.jsonUrl);
  }
  // Método para definir os filtros
  setFiltros(filtros: any): void {
    this.filtrosSelecionados = filtros;
  }

  // Método para recuperar os filtros
  getFiltros(): any {
    return this.filtrosSelecionados;
  }
}
