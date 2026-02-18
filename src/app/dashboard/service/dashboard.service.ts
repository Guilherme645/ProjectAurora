import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Interface genérica para itens de tabela (Entidades ou Veículos)
 */
export interface TableItem {
  name: string;
  negative: number;
  neutral: number;
  positive: number;
  // Campos opcionais para Entidades
  type?: string; 
  // Campos opcionais para Veículos
  logoUrl?: string;
  mediaType?: 'text' | 'video' | 'audio';
  tier?: string;
  quantity?: number;
}

export interface TableData {
  title: string;
  subtitle: string;
  data: TableItem[];
}

/**
 * Interfaces para os Cards de Estatísticas (Vertical)
 */
export interface StatItem {
  value: number;
  label: string;
  colorClass: string;
}

export interface StatsData {
  items: StatItem[];
}

/**
 * Interfaces para os Gráficos de Volume (D3)
 */
export interface VolumeSeries {
  name: string;
  color: string;
  values: number[];
}

/**
 * Interfaces para Protagonismo, Mídia e Índices
 */
export interface ProtagonismItem {
  title?: string;
  name?: string;
  value: number;
  positive: number;
  negative: number;
  dotColorClass?: string;
}


export interface ProtagonismData {
  main: ProtagonismItem;
  people: ProtagonismItem[];
}

export interface MediaItem {
  label: string;
  value: number;
  color: string;
}
export interface EntityMentionItem {
  name: string;
  negative: number;
  neutral: number;
  positive: number;
  // Campos opcionais para permitir o reuso entre Pessoas e Veículos
  type?: string;        // Usado para "Pessoa", "Organização"
  tier?: string;        // Usado para "Tier 1", "Tier 2"
  logoUrl?: string;     // Usado para a logo do veículo
  mediaType?: string;   // Usado para ícones de texto/vídeo
  quantity?: number;    // Usado para o total de notícias do veículo
}

export interface EntityMentionsData {
  title: string;
  subtitle: string;
  data: EntityMentionItem[];
}

export interface MediaData {
  title: string;
  subtitle: string;
  data: MediaItem[];
}

export interface IndexData {
  title: string;
  subtitle: string;
  score: number;
  scoreLabel: string;
  description: string;
  linkText: string;
  gradientStart: string;
  gradientEnd: string;
}

/**
 * Interface Principal que mapeia o arquivo dashboard.json
 */
export interface DashboardData {
  stats: StatsData;              // Card de Sentimentos (4 itens)
  statsTiers: StatsData;         // Card de Tiers (3 itens)
  volume: VolumeSeries[];        // Gráfico de Volume Geral
  volumeTiers: VolumeSeries[];   // Gráfico de Volume por Tiers
  protagonism: ProtagonismData;
  mediaData: MediaData;
  relevanceData: IndexData;
  qualityData: IndexData;
  entityMentions: TableData;     // Tabela de Entidades (Pessoas/Cargos)
  vehicleMentions: TableData;    // Tabela de Veículos (A da imagem com logo)
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  
  private dataUrl = 'assets/dashboard.json';

  constructor(private http: HttpClient) { }

  /**
   * Busca os dados consolidados do dashboard
   */
  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(this.dataUrl);
  }
}