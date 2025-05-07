import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  name: string;
  email: string;
  avatar: string;
  selected?: boolean; // Add this property
}

export interface Relatorio {
  nome: string;
  criadoPor: string;
  sigla: string;
  corFundo: string;
  corTexto: string;
  criadoEm: string;
}

export interface MonitorCard {
  title: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface MentionDetails {
  veiculo: string;
  local: string;
  sentimento: string;
  intervalo: string;
  horario: string;
  dataFixa: string;
  titulo: string;
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
  private monitorCardsUrl = 'assets/monitor-card.json'; // Corrected URL (was monitor-card.json)
  private mentionDetailsUrl = 'assets/mention-details.json'; // Added URL for mention details
  private filtrosSelecionados: any = {};

  constructor(private http: HttpClient) {}

  /** Método para obter os dados gerais com suporte a repetição infinita e filtro por usuário */
  getData(page: number = 1, pageSize: number = 10, user?: string): Observable<any> {
    return this.http.get<any>(this.dataJsonUrl).pipe(
      map(data => {
        if (data && data.noticias) {
          let filteredNoticias = data.noticias;
          if (user) {
            filteredNoticias = data.noticias.filter((noticia: any) => noticia.usuario === user);
          }

          const totalNoticias = filteredNoticias.length;
          if (totalNoticias === 0) {
            return { noticias: [] };
          }

          const start = ((page - 1) * pageSize) % totalNoticias;
          let paginatedNoticias = [];

          for (let i = 0; i < pageSize; i++) {
            const index = (start + i) % totalNoticias;
            paginatedNoticias.push({ ...filteredNoticias[index] });
          }

          return { noticias: paginatedNoticias };
        }
        return { noticias: [] };
      })
    );
  }

  /** Obtém os usuários do JSON */
  getUsers(): Observable<{ [key: string]: string }> {
    return this.http.get<{ [key: string]: string }>(this.usersUrl);
  }

  /** Método para obter os estados */
  getEstados(): Observable<any[]> {
    return this.http.get<any[]>(this.estadosJsonUrl);
  }

  /** Método para obter as categorias */
  getCategorias(): Observable<any> {
    return this.http.get<any>(this.categoriasUrl);
  }

  /** Obtém veículos do JSON */
  getVeiculos(): Observable<{ [key: string]: { nome: string; selecionado: boolean }[] }> {
    return this.http.get<{ [key: string]: { nome: string; selecionado: boolean }[] }>(this.veiculosUrl);
  }

  /** Obtém entidades do JSON */
  getEntidades(): Observable<any> {
    return this.http.get<any>(this.entidadesUrl);
  }

  /** Obtém relatórios do JSON */
  getRelatorios(): Observable<any[]> {
    return this.http.get<any[]>(this.relatoriosUrl);
  }

  /** Método para obter os monitorCards */
  getMonitorCards(): Observable<MonitorCard[]> {
    return this.http.get<MonitorCard[]>(this.monitorCardsUrl);
  }

  /** Método para obter os detalhes da menção */
  getMentionDetails(): Observable<MentionDetails> {
    return this.http.get<MentionDetails>(this.mentionDetailsUrl);
  }

  /** Método para armazenar filtros selecionados */
  setFiltros(filtros: any): void {
    this.filtrosSelecionados = filtros;
  }

  /** Método para recuperar os filtros */
  getFiltros(): any {
    return this.filtrosSelecionados;
  }

  /** Obtém usuários salvos do JSON */
  getSaveUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.saveUsers);
  }
}