import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

interface TextoEntidadesData {
  texto: string;
  entidades: Entidades;
}

interface Entidades {
  pessoas: string[];
  lugares: string[];
  organizacoes: string[];
  datas: string[];
  profissoes: string[];

}

@Injectable({
  providedIn: 'root'
})
export class TextoEntidadesService {
  private textoOriginalSubject = new BehaviorSubject<string>('');
  private entidadesSubject = new BehaviorSubject<Entidades>({ pessoas: [], lugares: [], organizacoes: [], datas: [], profissoes: [] });

  constructor(private http: HttpClient) {
    this.loadData();
  }

  private loadData(): void {
    this.http.get<TextoEntidadesData>('assets/texto-entidades.json').pipe(
      tap(data => {
        this.textoOriginalSubject.next(data.texto);
        this.entidadesSubject.next(data.entidades);
      })
    ).subscribe({
      error: (error) => {
        console.error('Erro ao carregar texto-entidades.json:', error);
      }
    });
  }

  carregarTexto(): Observable<string> {
    return this.textoOriginalSubject.asObservable();
  }

  carregarEntidades(): Observable<Entidades> {
    return this.entidadesSubject.asObservable();
  }

  getTextoOriginal(): Observable<string> {
    return this.textoOriginalSubject.asObservable();
  }

  getEntidades(): Observable<Entidades> {
    return this.entidadesSubject.asObservable();
  }

  substituirEntidades(opcoes: { pessoas?: boolean, lugares?: boolean, organizacoes?: boolean, datas?: boolean, profissoes?:boolean}): Observable<string> {
    return this.textoOriginalSubject.asObservable().pipe(
      map(textoOriginal => {
        let textoMarcado = textoOriginal;
        const escaparRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const currentEntidades = this.entidadesSubject.getValue();

        if (opcoes.pessoas && currentEntidades.pessoas) {
          currentEntidades.pessoas.forEach(pessoa => {
            const regex = new RegExp(escaparRegex(pessoa), 'g');
            textoMarcado = textoMarcado.replace(regex, `<span class="entity-person">${pessoa}</span>`);
          });
        }
        if (opcoes.lugares && currentEntidades.lugares) {
          currentEntidades.lugares.forEach(lugar => {
            const regex = new RegExp(escaparRegex(lugar), 'g');
            textoMarcado = textoMarcado.replace(regex, `<span class="entity-location">${lugar}</span>`);
          });
        }
        if (opcoes.organizacoes && currentEntidades.organizacoes) {
          currentEntidades.organizacoes.forEach(org => {
            const regex = new RegExp(escaparRegex(org), 'g');
            textoMarcado = textoMarcado.replace(regex, `<span class="entity-organization">${org}</span>`);
          });
        }
        if (opcoes.datas && currentEntidades.datas) {
          currentEntidades.datas.forEach(data => {
            const regex = new RegExp(escaparRegex(data), 'g');
            textoMarcado = textoMarcado.replace(regex, `<span class="entity-date">${data}</span>`);
          });
        }
        if (opcoes.profissoes && currentEntidades.profissoes) {
          currentEntidades.profissoes.forEach(profissoes => {
            const regex = new RegExp(escaparRegex(profissoes), 'g');
            textoMarcado = textoMarcado.replace(regex, `<span class="entity-profissoes">${profissoes}</span>`);
          });
        }

        textoMarcado = textoMarcado.replace(/<span class="entity-person">(.+?)<\/span>/g,
          '<span style="background-color: #FEF9C3; color: #854D0E;  padding: 0 5px; border-radius: 4px;">$1</span>');
        textoMarcado = textoMarcado.replace(/<span class="entity-location">(.+?)<\/span>/g,
          '<span style="background-color: #CCFBF1; color: #115E59;  padding: 0 5px; border-radius: 4px;">$1</span>');
        textoMarcado = textoMarcado.replace(/<span class="entity-organization">(.+?)<\/span>/g,
          '<span style="background-color: #F3F4F6; color: #1F2937;  padding: 0 5px; border-radius: 4px;">$1</span>');
        textoMarcado = textoMarcado.replace(/<span class="entity-date">(.+?)<\/span>/g,
          '<span style="background-color: #DBEAFE; color: #1E40AF;  padding: 0 5px; border-radius: 4px;">$1</span>');
          textoMarcado = textoMarcado.replace(/<span class="entity-profissoes">(.+?)<\/span>/g,
            '<span style="background-color: #FEE2E2; color: #991B1B;  padding: 0 5px; border-radius: 4px;">$1</span>');
        return textoMarcado;
      })
    );
  }
}