import { Component, Input } from '@angular/core';
import { IndexData } from '../../service/dashboard.service';
import { IndexExplainType } from '../index-explain-modal/index-explain-modal.component'; // ajuste o path

@Component({
  selector: 'app-index-chart',
  templateUrl: './index-chart.component.html',
  standalone: false
})
export class IndexChartComponent {
  @Input() data?: IndexData;
  @Input() isLoading: boolean = false;

  explainOpen = false;

  // modal
  modalType: IndexExplainType = 'relevance';
  modalDescription = '';
  modalFormula = '';

  getMarkerTopPosition(score: number): string {
    const positions: { [key: number]: string } = {
      5: '15px',
      4: '62px',
      3: '112px',
      2: '158px',
      1: '205px'
    };
    return positions[score] || '112px';
  }

  private resolveTypeFromTitle(title?: string): IndexExplainType {
    const t = (title || '').toLowerCase();
    // Ajusta conforme teus títulos reais:
    if (t.includes('qualidade')) return 'quality';
    return 'relevance';
  }

  openExplainModal() {
    if (!this.data) return;

    this.modalType = this.resolveTypeFromTitle(this.data.title);

    if (this.modalType === 'relevance') {
      this.modalDescription =
        'O resultado varia em uma escala de 1 a 5, onde quanto mais próximo de 5, maior a presença em veículos relevantes, e quanto mais próximo de 1, menor essa presença.';
      this.modalFormula =
        'IRV = (((Ocorrências Tier 1 × 3) + (Ocorrências Tier 2 × 2) + (Ocorrências Tier 3 × 1)) ÷ Total de ocorrências − 1) × 2 + 1';
    } else {
      this.modalDescription =
        'O resultado considera uma escala de 1 a 5 em que, quanto mais próximo de 5, mais o cenário é favorável, e quanto mais perto de 1 mais o cenário é desfavorável.';
      this.modalFormula =
        'IQ = (((Volume de ocorrências positivas − Volume de ocorrências negativas) + (Volume de ocorrências neutras × 0,5)) ÷ Volume total de ocorrências + 1) × 2 + 1';
    }

    this.explainOpen = true;
  }

  closeExplainModal() {
    this.explainOpen = false;
  }
  private clampScore(score: number | undefined): 1 | 2 | 3 | 4 | 5 {
  const s = Number(score);
  if (s >= 5) return 5;
  if (s <= 1) return 1;
  // arredonda só pra garantir inteiro
  const r = Math.round(s);
  if (r === 2) return 2;
  if (r === 3) return 3;
  if (r === 4) return 4;
  return 3;
}

get scoreSafe(): 1 | 2 | 3 | 4 | 5 {
  return this.clampScore(this.data?.score);
}

}
