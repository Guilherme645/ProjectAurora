import { Component, ElementRef, HostListener, Input, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-volume-chart',
  templateUrl: './volume-chart.component.html',
  styleUrls: ['./volume-chart.component.css'],
  standalone: false
})
export class VolumeChartComponent implements OnInit, OnChanges {
  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;
  
  @Input() volumeDataRaw?: any[];
  @Input() chartTitle: string = '';
  @Input() chartSubtitle: string = '';
  @Input() isLoading: boolean = false;

  chartData: any[] = [];
  private tooltip: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['volumeDataRaw'] && this.volumeDataRaw) {
      this.render();
    }
  }

  ngOnInit(): void { 
    this.render(); 
  }

  @HostListener('window:resize')
  onResize() { 
    this.createChart(); 
  }

  private render() {
    if (!this.volumeDataRaw || this.volumeDataRaw.length === 0) return;

    // 1. FORÇA AS CORES CORRETAS (Azul, Teal, Amarelo)
    const colorPalette = ['#2563EB', '#14B8A6', '#EBD725'];

    this.chartData = this.volumeDataRaw.map((s, i) => ({
      ...s,
      // Se não vier cor do back, usa a paleta na ordem fixa
      color: s.color || colorPalette[i % colorPalette.length],
      values: s.values.map((v: any, index: number) => ({ x: index, y: v }))
    }));

    // Pequeno delay para garantir que o container HTML exista
    setTimeout(() => this.createChart(), 0);
  }

  private createChart(): void {
    const element = this.chartContainer.nativeElement;
    d3.select(element).selectAll('*').remove(); // Limpa gráfico anterior

    // --- DIMENSÕES ---
    const containerWidth = element.getBoundingClientRect().width;
    const containerHeight = 300;
    // Ajustei a margem esquerda para alinhar melhor com o título visualmente
    const margin = { top: 20, right: 20, bottom: 30, left: 30 }; 
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    d3.select(element).style('position', 'relative');

    // Tooltip
    this.tooltip = d3.select(element)
      .append('div')
      .attr('class', 'chart-tooltip')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    const svg = d3.select(element)
      .append('svg')
      .attr('width', '100%')
      .attr('height', containerHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // --- ESCALAS ---
    const x = d3.scaleLinear().domain([0, 11]).range([0, width]);
    const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

    // --- GRADIENTES ---
    const uniqueId = (this.chartTitle || 'chart').replace(/\s+/g, '-').toLowerCase();
    const defs = svg.append('defs');
    
    this.chartData.forEach((series, i) => {
      const gradientId = `grad-${uniqueId}-${i}`;
      const grad = defs.append('linearGradient')
        .attr('id', gradientId)
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '0%').attr('y2', '100%');

      // Cor com opacidade no topo e transparente embaixo
      grad.append('stop').attr('offset', '0%').attr('stop-color', series.color).attr('stop-opacity', 0.2);
      grad.append('stop').attr('offset', '100%').attr('stop-color', '#FFFFFF').attr('stop-opacity', 0);
    });

    // --- GRID (Linhas horizontais) ---
    svg.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(() => ''))
      .call(g => g.select('.domain').remove()) // Remove linha vertical do eixo
      .call(g => g.selectAll('line').attr('stroke', '#E5E7EB')); // Cor da linha do grid

    // --- LINHAS E ÁREAS ---
    const area = d3.area<any>().curve(d3.curveMonotoneX).x(d => x(d.x)).y0(height).y1(d => y(d.y));
    const line = d3.line<any>().curve(d3.curveMonotoneX).x(d => x(d.x)).y(d => y(d.y));

    this.chartData.forEach((series, i) => {
      const gradientId = `grad-${uniqueId}-${i}`;
      // Área preenchida
      svg.append('path')
         .datum(series.values)
         .attr('d', area)
         .style('fill', `url(#${gradientId})`);
      
      // Linha sólida
      svg.append('path')
         .datum(series.values)
         .attr('fill', 'none')
         .attr('d', line)
         .style('stroke', series.color)
         .style('stroke-width', 2);
    });

    // --- EIXO X (Customizado para bater com o print) ---
    const xAxis = svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x)
        .ticks(width < 400 ? 5 : 11) // Menos ticks se a tela for pequena
        .tickFormat((d) => {
          const val = Number(d);
          // Mapeamento dos meses (ajuste conforme seus dados reais)
          const labelMap: { [key: number]: string } = { 
            0: 'Outubro', 3: 'Novembro', 6: 'Dezembro', 9: 'Janeiro', 11: 'Março' 
          };
          return labelMap[val] || ''; 
        })
        .tickSize(0) // Remove os risquinhos do tick
        .tickPadding(16) // Afasta o texto do gráfico
      );

    // REMOVE A LINHA DO EIXO X (A linha preta feia)
    xAxis.select('.domain').remove();

    // APLICA ESTILOS DE FONTE NO EIXO X (Importante!)
    xAxis.selectAll('text')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '12px')
      .style('font-weight', '500')
      .style('fill', '#9CA3AF') // Cor cinza do Figma
      .style('letter-spacing', '-0.01em');

    // --- EIXO Y ---
    const yAxis = svg.append('g')
      .call(d3.axisLeft(y).ticks(5).tickSize(0).tickPadding(10));
    
    yAxis.select('.domain').remove(); // Remove linha vertical

    // APLICA ESTILOS DE FONTE NO EIXO Y
    yAxis.selectAll('text')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '12px')
      .style('font-weight', '500')
      .style('fill', '#9CA3AF');

    // --- INTERATIVIDADE (Tooltip & Bolinhas) ---
    const dots = this.chartData.map(series => {
      return svg.append('circle')
        .attr('r', 5)
        .attr('fill', series.color)
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .style('opacity', 0)
        .style('filter', 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))');
    });

    // Retângulo invisível para capturar mouse
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mousemove', (event) => {
        const [mouseX] = d3.pointer(event);
        // Arredonda para o índice inteiro mais próximo
        const xIndex = Math.round(x.invert(mouseX));
        
        if (xIndex < 0 || xIndex > 11) return;

        // Encontra a série com maior valor nesse ponto (para ser a "Principal")
        const pointData = this.chartData.map((series, i) => ({
          seriesIndex: i,
          name: series.name,
          color: series.color,
          value: series.values.find((v: any) => v.x === xIndex)?.y || 0
        })).sort((a, b) => b.value - a.value);

        const mainItem = pointData[0];

        // Posiciona a bolinha apenas na linha principal
        dots.forEach((dot, i) => {
          if (i === mainItem.seriesIndex) {
            dot.attr('cx', x(xIndex)).attr('cy', y(mainItem.value)).style('opacity', 1);
          } else {
            dot.style('opacity', 0);
          }
        });

        // HTML do Tooltip
        const tooltipHtml = `
          <div style="font-family: 'Inter', sans-serif; background: #111827; color: white; padding: 12px; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); min-width: 150px;">
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
               <div style="width: 8px; height: 8px; border-radius: 50%; background: ${mainItem.color}; margin-right: 8px;"></div>
               <span style="font-weight: 600; font-size: 14px;">${mainItem.name}</span>
               <span style="margin-left: auto; font-weight: 600; font-size: 14px;">${mainItem.value}</span>
            </div>
            <div style="border-top: 1px solid rgba(255,255,255,0.1); margin-bottom: 8px;"></div>
            ${pointData.slice(1).map(item => `
              <div style="display: flex; justify-content: space-between; font-size: 12px; color: #9CA3AF; margin-bottom: 4px;">
                <span>${item.name}</span>
                <span>${item.value}</span>
              </div>
            `).join('')}
          </div>
        `;

        // Posiciona Tooltip
        let left = mouseX + margin.left + 15;
        let top = y(mainItem.value) + margin.top;

        if (mouseX > width * 0.6) {
           left = mouseX + margin.left - 170; // Joga pra esquerda se estiver no fim
        }

        this.tooltip
          .html(tooltipHtml)
          .style('left', `${left}px`)
          .style('top', `${top}px`)
          .style('opacity', 1);
      })
      .on('mouseleave', () => {
        dots.forEach(d => d.style('opacity', 0));
        this.tooltip.style('opacity', 0);
      });
  }
}