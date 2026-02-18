import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { MediaData } from '../../service/dashboard.service';

@Component({
  selector: 'app-media-chart',
  templateUrl: './media-chart.component.html',
  standalone: false
})
export class MediaChartComponent implements OnChanges {
  @Input() data?: MediaData;
  @Input() isLoading: boolean = false;

  // CORREÇÃO: Mude 'static: true' para 'static: false'
  // Isso permite que o Angular encontre o elemento mesmo se ele estiver dentro de um *ngIf
  @ViewChild('pieChart', { static: false }) private chartContainer!: ElementRef;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.data && !this.isLoading) {
      // Pequeno delay para garantir que o *ngIf renderizou o HTML antes de desenhar
      setTimeout(() => this.createChart(), 100);
    }
  }

  private createChart(): void {
    // CORREÇÃO: Verificação de segurança
    if (!this.chartContainer) return;

    const element = this.chartContainer.nativeElement;
    d3.select(element).select('svg').remove(); // Limpa gráfico anterior

    if (!this.data) return;

    const width = 248;
    const height = 248;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal()
      .domain(this.data.data.map(d => d.label))
      .range(this.data.data.map(d => d.color));

    // Pie generator
    const pie = d3.pie<any>()
      .value((d: any) => d.value)
      .sort(null); // Mantém a ordem do JSON

    // Arc generator
    const arc = d3.arc()
      .innerRadius(0) 
      .outerRadius(radius);

    // Renderiza as fatias
    svg.selectAll('path')
      .data(pie(this.data.data))
      .enter()
      .append('path')
      .attr('d', arc as any)
      .attr('fill', (d: any) => color(d.data.label) as string)
      .attr('stroke', 'white')
      .style('stroke-width', '1px'); // Adicionei uma borda fina para separar as fatias
  }
}