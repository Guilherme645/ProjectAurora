import {
  Component,
  ElementRef,
  AfterViewInit,
  signal
} from '@angular/core';
import * as d3 from 'd3';  // Importação do D3.js: Biblioteca principal para manipulação de dados e criação de visualizações SVG. Usa named exports para acessar funções como scaleBand, axisBottom, select, etc.

interface DadosGrafico {
  nome: string;  // Chave para o eixo X (categorias nominais, ex.: meses).
  valor: number;  // Chave para o eixo Y (valores numéricos para altura das barras).
}

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',  // Template HTML: Contém o <div id="chart-container"> (onde o SVG é injetado) e <div id="chart-tooltip"> (elemento HTML para exibir tooltips interativos).
  styleUrls: ['./charts.component.css'],  // CSS: Aqui é onde as cores, tamanhos e estilos visuais são definidos (usando classes aplicadas pelo D3). Ex.: .barra { fill: var(--color-primary-500); } para cor azul das barras.
  standalone: false
})
export class ChartsComponent implements AfterViewInit {
  // Signal do Angular: Armazena os dados reativos do gráfico. Atualizações no signal disparam re-renders se configurado com OnPush.
  private data = signal<DadosGrafico[]>([
    { nome: 'Jan', valor: 65 },
    { nome: 'Fev', valor: 59 },
    { nome: 'Mar', valor: 80 },
    { nome: 'Abr', valor: 81 },
    { nome: 'Mai', valor: 56 },
    { nome: 'Jun', valor: 55 },
    { nome: 'Jul', valor: 40 },
  ]);

  constructor(private el: ElementRef) {}  // ElementRef: Referência ao host DOM, útil para manipulações diretas se necessário (não usado aqui, mas padrão para D3 em Angular).

  // Método auxiliar: Calcula o total dos valores (usado no card de estatísticas no HTML). Demonstra como processar dados antes de visualizar.
  getTotalValor(): number {
    return this.data().reduce((sum, d) => sum + d.valor, 0);  // 436 como no screenshot – Redução simples para soma agregada.
  }

  // Métodos de UI (não relacionados ao D3): Toggle sidebar e dropdown para layout responsivo; dismiss para alerta.
  toggleSidebar(): void {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar && overlay) {
      sidebar.classList.toggle('-translate-x-full');  // Animação Tailwind para slide-in/out da sidebar.
      overlay.classList.toggle('hidden');  // Overlay para mobile: Cobre a tela ao abrir sidebar.
    }
  }

  toggleDropdown(): void {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
      dropdown.classList.toggle('hidden');  // Toggle simples para menu de usuário no header.
    }
  }

  dismissAlert(): void {
    const alert = document.getElementById('alert-info');
    if (alert) {
      alert.style.display = 'none';  // Esconde o alerta de dica (integração com Preline JS opcional via data-hs-remove-element).
    }
  }

  ngAfterViewInit(): void {
    // Lifecycle hook do Angular: Executa após o view ser inicializado (garante que #chart-container existe no DOM).
    // Aqui chamamos a criação do gráfico – Ideal para D3, que manipula DOM diretamente.
    this.createChart();
  }

  // MÉTODO PRINCIPAL: createChart() – Demonstra o fluxo completo de criação de um gráfico de barras no D3.js.
  // PASSO 1: Preparação de Dados e Container
  // - Vincula dados ao container HTML via d3.select().
  // - Limpa conteúdo anterior para re-renders (evita sobreposições).
  public createChart(): void {
    const dados = this.data();  // Extrai dados do signal (array de objetos {nome, valor}).
    const container = d3.select('#chart-container');  // Seleciona o <div> no HTML como raiz para injetar o SVG.
    container.html('');  // Limpa o container: Remove SVGs anteriores para redraw limpo (útil em updates dinâmicos).

    // PASSO 2: Configurações de Dimensões e Margens
    // - Margens: Espaçam eixos e labels (top/right/bottom/left). Ajuste para room para títulos/ticks.
    // - Width/Height: Área interna do gráfico (exclui margens). Valores fixos aqui, mas use ResizeObserver para responsivo.
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };  // Margens: Top para título Y, bottom para labels X, left para ticks Y.
    const width = 600 - margin.left - margin.right;  // Largura interna: 560px – Define o range das escalas X.
    const height = 400 - margin.top - margin.bottom;  // Altura interna: 330px – Define o range das escalas Y (inverte para barras "crescerem" de baixo).

    // PASSO 3: Criação do SVG e Grupo Principal
    // - append('svg'): Cria elemento <svg> no container.
    // - attr('width/height'): Tamanho total (inclui margens) – Garante canvas fixo.
    // - attr('viewBox'): Define viewport escalável (responsivo: adapta a qualquer tela sem distorção).
    // - attr('preserveAspectRatio'): Centraliza e mantém proporção (xMidYMid meet = fit com crop se necessário).
    // - append('g').attr('transform'): Grupo <g> deslocado pelas margens – Todos elementos internos vão aqui.
    const svg = container
      .append('svg')  // Cria o elemento SVG raiz (vetorial, escalável).
      .attr('width', width + margin.left + margin.right)  // Largura total: 640px – Inclui margens para overflow.
      .attr('height', height + margin.top + margin.bottom)  // Altura total: 470px.
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)  // ViewBox: Define coordenadas lógicas (0,0 a width+height total) – Responsivo!
      .attr('preserveAspectRatio', 'xMidYMid meet')  // Responsividade: Centraliza e escala proporcionalmente.
      .append('g')  // Adiciona grupo <g> para agrupar elementos (eixos, barras).
      .attr('transform', `translate(${margin.left},${margin.top})`);  // Desloca grupo: Inicia desenho na área interna (após margens).

    // PASSO 4: Definição das Escalas (Scales) – Mapeiam dados para pixels.
    // - scaleBand(): Para eixo X categórico (bandas iguais para cada 'nome'). Padding: Espaçamento entre barras (20% da largura da banda).
    // - scaleLinear(): Para eixo Y numérico. Domain: [0, max valor] – Range: [height, 0] (inverte Y para barras "crescerem" de baixo para cima).
    const x = d3.scaleBand<string>()  // Escala de banda: Divide width em faixas iguais para categorias (ex.: 7 meses = ~80px cada).
      .range([0, width])  // Range: De 0 a width interna (560px) – Posições X das barras.
      .domain(dados.map((d) => d.nome))  // Domain: Valores únicos de 'nome' (['Jan', 'Fev', ...]) – Define categorias.
      .padding(0.2);  // Padding: 20% da largura da banda para espaçamento entre barras (evita colisão).

    const y = d3.scaleLinear<number>()  // Escala linear: Mapeia valores numéricos para pixels.
      .domain([0, d3.max(dados, (d) => d.valor) ?? 0])  // Domain: [0, 81] – Min/Max dos valores (usa d3.max para auto-detectar).
      .range([height, 0]);  // Range: [330, 0] – Inverte Y: Valor 0 no bottom, max no top (padrão SVG).

    // PASSO 5: Desenho dos Eixos (Axes)
    // - axisBottom(x): Cria eixo X horizontal (ticks/labels no bottom).
    // - axisLeft(y): Cria eixo Y vertical (ticks/labels à esquerda).
    // - append('g').call(axis): Adiciona grupo <g> para o eixo e chama a função de desenho.
    // - selectAll('text').attr('class'): Aplica classe CSS para estilizar labels (cores/tamanhos via .eixo-texto no CSS).
    // - Transform no X: Posiciona no bottom da área interna.
    svg.append('g')  // Grupo para eixo X.
      .attr('transform', `translate(0,${height})`)  // Posiciona no bottom: Desloca Y para height interna (linha base das barras).
      .call(d3.axisBottom(x))  // Chama axisBottom: Desenha ticks, linhas e labels (ex.: 'Jan', 'Fev').
      .selectAll('text')  // Seleciona todos <text> (labels dos meses).
      .attr('class', 'eixo-texto');  // Aplica classe CSS: Estilo (cor cinza, fonte 12px) definido em charts.component.css.

    svg.append('g')  // Grupo para eixo Y.
      .call(d3.axisLeft(y))  // Chama axisLeft: Desenha ticks verticais (ex.: 0, 20, 40... 80).
      .selectAll('text')  // Seleciona <text> (labels numéricos).
      .attr('class', 'eixo-texto');  // Classe CSS: Mesma estilização (cinza, fonte Inter 12px).

    // PASSO 6: Seleção do Tooltip
    // - d3.select('#chart-tooltip'): Seleciona o <div> HTML fixo no template (não SVG – permite HTML rico como <strong>).
    // - Estilo base no CSS/HTML: Posição absolute, opacity 0 inicial, transição suave.
    const tooltip = d3.select('#chart-tooltip');  // Seleciona o elemento HTML para tooltips (fora do SVG para liberdade de posicionamento).

    // PASSO 7: Desenho das Barras (Data Binding e Atributos)
    // - selectAll('.barra').data(dados).enter().append('rect'): Padrão D3 para data join – Cria <rect> para cada dado (7 barras).
    // - attr('x/y/width/height'): Posiciona e dimensiona cada barra via escalas (x para centro da banda, y/height invertido).
    // - attr('class', 'barra'): Aplica classe CSS para cores (fill azul via --color-primary-500 no CSS).
    // - attr('rx', 2): Cantos arredondados (raio 2px) – Estilo visual sutil.
    // - .on('mouseover/mouseout'): Eventos interativos – Mostra/esconde tooltip.
    svg.selectAll('.barra')  // Seleciona placeholders para barras (data join: enter/update/exit).
      .data(dados)  // Vincula dados: Cada objeto {nome, valor} a um <rect> (7 itens = 7 barras).
      .enter()  // Enter: Para novos dados (cria elementos ausentes).
      .append('rect')  // Adiciona <rect> SVG para cada dado (elemento retangular para barras).
      .attr('class', 'barra')  // Classe CSS: Define fill (azul #3b82f6), stroke (borda azul escura), hover (escurece). Tokens Figma via CSS vars.
      .attr('x', (d) => x(d.nome) ?? 0)  // Posição X: Centro da banda para o nome (ex.: x('Jan') ~0px).
      .attr('y', (d) => y(d.valor))  // Posição Y: Topo da barra (y(65) ~265px – invertido pela escala).
      .attr('width', x.bandwidth())  // Largura: Largura da banda (~80px) – Uniforme para todas barras.
      .attr('height', (d) => height - y(d.valor))  // Altura: height - y(valor) (ex.: 330 - 265 = 65px para Jan).
      .attr('rx', 2)  // Bordas arredondadas: Raio 2px – Estilo moderno (não precisa CSS, direto no SVG).
      .on('mouseover', (event: MouseEvent, d: DadosGrafico) => {  // Evento: Mouse over na barra – Ativa tooltip.
        tooltip  // Seleciona tooltip.
          .style('opacity', 1)  // Mostra: Transição CSS para fade-in.
          .style('visibility', 'visible')  // Garante visibilidade (com opacity 0 inicial).
          .html(`<strong>${d.nome}</strong>: ${d.valor} unidades`);  // Conteúdo HTML: Injeta texto formatado (nome em bold, valor numérico).
          
        // Posicionamento do Tooltip: Usa coordenadas reais do mouse (pageX/Y + scroll) para seguir cursor no viewport.
        // - pageX/Y: Posição absoluta relativa à página (ignora offsets do container).
        // - + window.scrollX/Y: Ajusta para scroll da página.
        // - transform: Centraliza tooltip acima do mouse (50% left, 100% top).
        const xPos = event.pageX + window.scrollX;  // X absoluto: Mouse X + scroll horizontal.
        const yPos = event.pageY + window.scrollY - 10;  // Y absoluto: Mouse Y + scroll vertical - offset para acima.
        tooltip
          .style('left', `${xPos}px`)  // Posição left: Segue mouse X.
          .style('top', `${yPos}px`)  // Posição top: Segue mouse Y (ajustado para não colidir com barra).
          .style('transform', 'translate(-50%, -100%)');  // Centraliza: -50% X (meio), -100% Y (acima do ponto).
      })
      .on('mouseout', () => {  // Evento: Mouse out – Esconde tooltip.
        tooltip.style('opacity', 0).style('visibility', 'hidden');  // Fade-out via CSS transition.
      });
  }
}