import { Component, Input } from '@angular/core';
import { StatsData } from '../../service/dashboard.service';

@Component({
  selector: 'app-VerticalStatsCard',
  templateUrl: './VerticalStatsCard.component.html',
  styleUrls: ['./VerticalStatsCard.component.css'],
  standalone: false
})
export class VerticalStatsCardComponent {
  @Input() statsData?: StatsData;
  @Input() isLoading: boolean = false;

  // Detecta automaticamente se é o card de Tiers (3 itens)
  get isTiers(): boolean {
    return this.statsData?.items?.length === 3;
  }

  getValueColor(index: number): string {
    if (this.isTiers) {
      switch (index) {
        case 0: return 'text-[#15803D]'; // Tier 1: Verde
        case 1: return 'text-[#1D4ED8]'; // Tier 2: Azul
        case 2: return 'text-[#CA8A04]'; // Tier 3: Amarelo/Ouro
        default: return 'text-[#1F2937]';
      }
    }

    // Padrão (4 itens)
    switch (index) {
      case 0: return 'text-[#1F2937]'; // Total: Cinza
      case 1: return 'text-[#15803D]'; // Positivo: Verde
      case 2: return 'text-[#1D4ED8]'; // Neutro: Azul
      case 3: return 'text-[#B91C1C]'; // Negativo: Vermelho
      default: return 'text-[#1F2937]';
    }
  }

  getLabelColor(index: number): string {
    if (this.isTiers) {
      // Nos Tiers, o label segue a mesma cor do valor
      return this.getValueColor(index);
    }

    // Padrão
    switch (index) {
      case 0: return 'text-[#6B7280]';
      case 1: return 'text-[#15803D]';
      case 2: return 'text-[#1D4ED8]';
      case 3: return 'text-[#B91C1C]';
      default: return 'text-[#6B7280]';
    }
  }
}