import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-relatorio-modal',
  templateUrl: './relatorio-modal.component.html',
  styleUrls: ['./relatorio-modal.component.css']
})
export class RelatorioModalComponent {
  @Output() fechar = new EventEmitter<void>();

  paginaAtual = 1;
  itensPorPagina = 5;
  totalPaginas = 3;

  relatorios = [
    { nome: 'Ministros', criadoPor: 'Guilherme Sousa', sigla: 'GS', cor: '#DBEAFE', criadoEm: '10/02/24' },
    { nome: 'Supremo Tribunal Federal', criadoPor: 'Marina Campos', sigla: 'MC', cor: '#DBEAFE', criadoEm: '24/01/24' },
    { nome: 'Judiciário', criadoPor: 'Gilberto Menezes', sigla: 'GM', cor: '#DBEAFE', criadoEm: '12/01/24' },
    { nome: 'Legislativo', criadoPor: 'Guilherme Sousa', sigla: 'GS', cor: '#DBEAFE', criadoEm: '28/12/23' },
    { nome: 'Executivo', criadoPor: 'Guilherme Sousa', sigla: 'GS', cor: '#DBEAFE', criadoEm: '28/12/23' }
  ];

  getRelatoriosPaginados() {
    return this.relatorios.slice((this.paginaAtual - 1) * this.itensPorPagina, this.paginaAtual * this.itensPorPagina);
  }

  paginaAnterior() {
    if (this.paginaAtual > 1) this.paginaAtual--;
  }

  proximaPagina() {
    if (this.paginaAtual < this.totalPaginas) this.paginaAtual++;
  }

  fecharModal() {
    this.fechar.emit();
  }
  inserirMencao() {
    console.log('Menção inserida!');
    this.fecharModal();
  }
}