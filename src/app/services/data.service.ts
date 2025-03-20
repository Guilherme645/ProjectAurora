import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  name: string;
  email: string;
  avatar: string;
}

export interface Relatorio {
  nome: string;
  criadoPor: string;
  sigla: string;
  corFundo: string;
  corTexto: string;
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

  /** 🔹 Método para obter os dados gerais com suporte a repetição infinita e filtro por usuário */
  getData(page: number = 1, pageSize: number = 10, user?: string): Observable<any> {
    return this.http.get<any>(this.dataJsonUrl).pipe(
      map(data => {
        if (data && data.noticias) {
          // Filtra as notícias pelo usuário, se fornecido
          let filteredNoticias = data.noticias;
          if (user) {
            filteredNoticias = data.noticias.filter((noticia: any) => noticia.usuario === user);
          }

          const totalNoticias = filteredNoticias.length;
          if (totalNoticias === 0) {
            return { noticias: [] }; // Retorna vazio se não houver notícias para o usuário
          }

          const start = ((page - 1) * pageSize) % totalNoticias; // Ciclo baseado no tamanho filtrado
          let paginatedNoticias = [];

          // Garante que até `pageSize` notícias sejam retornadas em cada chamada
          for (let i = 0; i < pageSize; i++) {
            const index = (start + i) % totalNoticias; // Repete as notícias em loop
            paginatedNoticias.push({ ...filteredNoticias[index] }); // Clona o objeto
          }

          return { noticias: paginatedNoticias };
        }
        return { noticias: [] };
      })
    );
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

  /** 🔹 Obtém usuários salvos do JSON */
  getSaveUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.saveUsers);
  }
}