import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  name: string;
  email: string;
  avatar: string;
}

export interface Relatorio {
  nome: string;
  criadoPor: string;
  sigla: string;
  cor: string;
  criadoEm: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dataJsonUrl = 'assets/data.json';
  private entidadesUrl = 'assets/entidades.json';
  private estadosJsonUrl = 'assets/estados.json';
  private usersUrl = 'assets/users.json';
  private categoriasUrl = 'assets/categorias.json';
  private veiculosUrl = 'assets/veiculos.json';
  private relatoriosUrl = 'assets/relatorio.json'; 
  private saveUsers = 'assets/SaveUsers.json';
  private filtrosSelecionados: any = {};

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

  /** 🔹 Método para obter as categorias */
  getCategorias(): Observable<any> {
    return this.http.get<any>(this.categoriasUrl);
  }

  /** 🔹 Obtém veículos do JSON */
  getVeiculos(): Observable<{ [key: string]: { nome: string; selecionado: boolean }[] }> {
    return this.http.get<{ [key: string]: { nome: string; selecionado: boolean }[] }>(this.veiculosUrl);
  }

  /** 🔹 Obtém entidades do JSON */
  getEntidades(): Observable<any> {
    return this.http.get<any>(this.entidadesUrl);
  }

  /** 🔹 Obtém relatórios do JSON */
  getRelatorios(): Observable<any[]> {
    return this.http.get<any[]>(this.relatoriosUrl);
  }

  /** 🔹 Método para armazenar filtros selecionados */
  setFiltros(filtros: any): void {
    this.filtrosSelecionados = filtros;
  }

  /** 🔹 Método para recuperar os filtros */
  getFiltros(): any {
    return this.filtrosSelecionados;
  }
  
  getSaveUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.saveUsers);
  }
}
