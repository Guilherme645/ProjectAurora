import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dataJsonUrl = 'assets/data.json'; // Caminho para data.json
  private estadosJsonUrl = 'assets/estados.json'; // Caminho para estados.json
  private usersUrl = 'assets/users.json'; // Caminho do JSON
  private categoriasUrl = 'assets/categorias.json'; // Caminho do JSON
  private jsonUrl = 'assets/veiculos.json'; // Caminho do JSON
  private filtrosSelecionados: any = {}; // Armazena os filtros selecionados

  constructor(private http: HttpClient) {}

  /** 🔹 Método para obter os dados gerais */
  getData(): Observable<any> {
    return this.http.get<any>(this.dataJsonUrl);
  }

  /** 🔹 Obtém os usuários do JSON */
  getUsers(): Observable<{ [key: string]: string }> {
    return this.http.get<{ [key: string]: string }>(this.usersUrl);
  }

  /** 🔹 Método para obter os estados */
  getEstados(): Observable<any[]> {
    return this.http.get<any[]>(this.estadosJsonUrl);
  }

  /** 🔹 Método para armazenar filtros selecionados */
  setFiltros(filtros: any): void {
    this.filtrosSelecionados = filtros;
  }

  /** 🔹 Método para recuperar os filtros */
  getFiltros(): any {
    return this.filtrosSelecionados;
  }

  getCategorias(): Observable<any> {
    return this.http.get<any>(this.categoriasUrl);
  }

  getVeiculos(): Observable<{ [key: string]: { nome: string; selecionado: boolean }[] }> {
    return this.http.get<{ [key: string]: { nome: string; selecionado: boolean }[] }>(this.jsonUrl);
  }
}
