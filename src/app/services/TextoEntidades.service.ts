import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface Entidades {
  pessoas: string[];
  lugares: string[];
  organizacoes: string[];
  datas: string[];
  profissoes: string[];
}

export interface TextoEntidadesData {
  texto: string;
  entidades: Entidades;
}

interface TranscriptItemJson {
  timestamp: number;
  end: number;
  text: string;
  entidades: {
    pessoas?: string[];
    lugares?: string[];
    organizacoes?: string[];
    datas?: string[];
    profissoes?: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class TextoEntidadesService {
  private textoOriginalSubject = new BehaviorSubject<string>('');
  private entidadesSubject = new BehaviorSubject<Entidades>({
    pessoas: [],
    lugares: [],
    organizacoes: [],
    datas: [],
    profissoes: []
  });

  private transcriptItemsSubject = new BehaviorSubject<TranscriptItemJson[]>([]);

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
      error: (error) => console.error('Erro ao carregar texto-entidades.json:', error)
    });
  }

  carregarTextoEntidadesAlternativo(): Observable<TextoEntidadesData> {
    return this.http.get<TranscriptItemJson[]>('assets/transcricao_completa.json').pipe(
      map((transcriptItems: TranscriptItemJson[]) => {
        let fullText = '';
        const aggregatedEntidades: Entidades = {
          pessoas: [],
          lugares: [],
          organizacoes: [],
          datas: [],
          profissoes: []
        };

        for (const item of transcriptItems) {
          fullText += item.text + ' ';
          if (item.entidades) {
            if (item.entidades.pessoas) aggregatedEntidades.pessoas.push(...item.entidades.pessoas);
            if (item.entidades.lugares) aggregatedEntidades.lugares.push(...item.entidades.lugares);
            if (item.entidades.organizacoes) aggregatedEntidades.organizacoes.push(...item.entidades.organizacoes);
            if (item.entidades.datas) aggregatedEntidades.datas.push(...item.entidades.datas);
            if (item.entidades.profissoes) aggregatedEntidades.profissoes.push(...item.entidades.profissoes);
          }
        }

        aggregatedEntidades.pessoas = [...new Set(aggregatedEntidades.pessoas)];
        aggregatedEntidades.lugares = [...new Set(aggregatedEntidades.lugares)];
        aggregatedEntidades.organizacoes = [...new Set(aggregatedEntidades.organizacoes)];
        aggregatedEntidades.datas = [...new Set(aggregatedEntidades.datas)];
        aggregatedEntidades.profissoes = [...new Set(aggregatedEntidades.profissoes)];

        this.transcriptItemsSubject.next(transcriptItems);

        return {
          texto: fullText.trim(),
          entidades: aggregatedEntidades
        };
      }),
      tap(processedData => {
        this.textoOriginalSubject.next(processedData.texto);
        this.entidadesSubject.next(processedData.entidades);
        console.log('JSON alternativo processado. Texto:', processedData.texto.substring(0, 100) + "...", "Entidades:", processedData.entidades);
      })
    );
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

  substituirEntidadesPorSegmento(opcoes: {
    pessoas?: boolean;
    lugares?: boolean;
    organizacoes?: boolean;
    datas?: boolean;
    profissoes?: boolean;
  }): Observable<string[]> {
    return this.transcriptItemsSubject.asObservable().pipe(
      map(transcriptItems => {
        const currentEntidades = this.entidadesSubject.getValue();
        const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Criar uma lista de todas as entidades com suas categorias e estilos
        const allEntities: { entity: string; type: string; className: string; tagColor: string; textColor: string }[] = [];

        if (opcoes.pessoas && currentEntidades.pessoas?.length) {
          currentEntidades.pessoas.forEach(entity => allEntities.push({
            entity,
            type: 'pessoa',
            className: 'entity-person',
            tagColor: '#FEF9C3',
            textColor: '#854D0E'
          }));
        }
        if (opcoes.lugares && currentEntidades.lugares?.length) {
          currentEntidades.lugares.forEach(entity => allEntities.push({
            entity,
            type: 'lugar',
            className: 'entity-location',
            tagColor: '#CCFBF1',
            textColor: '#115E59'
          }));
        }
        if (opcoes.organizacoes && currentEntidades.organizacoes?.length) {
          currentEntidades.organizacoes.forEach(entity => allEntities.push({
            entity,
            type: 'organizacao',
            className: 'entity-organization',
            tagColor: '#F3F4F6',
            textColor: '#1F2937'
          }));
        }
        if (opcoes.datas && currentEntidades.datas?.length) {
          currentEntidades.datas.forEach(entity => allEntities.push({
            entity,
            type: 'data',
            className: 'entity-date',
            tagColor: '#DBEAFE',
            textColor: '#1E40AF'
          }));
        }
        if (opcoes.profissoes && currentEntidades.profissoes?.length) {
          currentEntidades.profissoes.forEach(entity => allEntities.push({
            entity,
            type: 'profissao',
            className: 'entity-profissoes',
            tagColor: '#FEE2E2',
            textColor: '#991B1B'
          }));
        }

        // Ordenar entidades por tamanho (maior para menor) para evitar substituições parciais
        allEntities.sort((a, b) => b.entity.length - a.entity.length);

        return transcriptItems.map(item => {
          let textoMarcado = item.text;

          // Substituir todas as entidades de uma vez
          allEntities.forEach(({ entity, className, tagColor, textColor }) => {
            const regex = new RegExp(`(?<!<span[^>]*>)${escapeRegex(entity)}(?!</span>)`, 'gi');
            textoMarcado = textoMarcado.replace(regex, `<span class="${className}" style="background-color: ${tagColor}; color: ${textColor}; padding: 0 5px; border-radius: 4px;">${entity}</span>`);
          });

          return textoMarcado;
        });
      })
    );
  }

  substituirEntidades(opcoes: {
    pessoas?: boolean;
    lugares?: boolean;
    organizacoes?: boolean;
    datas?: boolean;
    profissoes?: boolean;
  }): Observable<string> {
    return this.textoOriginalSubject.asObservable().pipe(
      map(textoOriginal => {
        let textoMarcado = textoOriginal;
        const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const currentEntidades = this.entidadesSubject.getValue();

        const allEntities: { entity: string; className: string; tagColor: string; textColor: string }[] = [];

        if (opcoes.pessoas && currentEntidades.pessoas?.length) {
          currentEntidades.pessoas.forEach(entity => allEntities.push({
            entity,
            className: 'entity-person',
            tagColor: '#FEF9C3',
            textColor: '#854D0E'
          }));
        }
        if (opcoes.lugares && currentEntidades.lugares?.length) {
          currentEntidades.lugares.forEach(entity => allEntities.push({
            entity,
            className: 'entity-location',
            tagColor: '#CCFBF1',
            textColor: '#115E59'
          }));
        }
        if (opcoes.organizacoes && currentEntidades.organizacoes?.length) {
          currentEntidades.organizacoes.forEach(entity => allEntities.push({
            entity,
            className: 'entity-organization',
            tagColor: '#F3F4F6',
            textColor: '#1F2937'
          }));
        }
        if (opcoes.datas && currentEntidades.datas?.length) {
          currentEntidades.datas.forEach(entity => allEntities.push({
            entity,
            className: 'entity-date',
            tagColor: '#DBEAFE',
            textColor: '#1E40AF'
          }));
        }
        if (opcoes.profissoes && currentEntidades.profissoes?.length) {
          currentEntidades.profissoes.forEach(entity => allEntities.push({
            entity,
            className: 'entity-profissoes',
            tagColor: '#FEE2E2',
            textColor: '#991B1B'
          }));
        }

        allEntities.sort((a, b) => b.entity.length - a.entity.length);

        allEntities.forEach(({ entity, className, tagColor, textColor }) => {
          const regex = new RegExp(`(?<!<span[^>]*>)${escapeRegex(entity)}(?!</span>)`, 'gi');
          textoMarcado = textoMarcado.replace(regex, `<span class="${className}" style="background-color: ${tagColor}; color: ${textColor}; padding: 0 5px; border-radius: 4px;">${entity}</span>`);
        });

        return textoMarcado;
      })
    );
  }
}