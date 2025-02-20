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
    { 
      nome: 'Ministros', 
      criadoPor: 'Guilherme Sousa', 
      sigla: 'GS', 
      cor: '#1E3A8A', 
      backgroundColor: '#1E40AF', 
      criadoEm: '10/02/24' 
  },
  { 
      nome: 'Supremo Tribunal Federal', 
      criadoPor: 'Marina Campos', 
      sigla: 'MC', 
      cor: '#991B1B', 
      backgroundColor: '#E9D5FF', 
      criadoEm: '24/01/24' 
  },
  { 
      nome: 'Judiciário', 
      criadoPor: 'Gilberto Menezes', 
      sigla: 'GM', 
      cor: '#115E59', 
      backgroundColor: '#CCFBF1', 
      criadoEm: '12/01/24' 
  },
  { 
      nome: 'Legislativo', 
      criadoPor: 'Guilherme Sousa', 
      sigla: 'GS', 
      cor: '#1E3A8A', 
      backgroundColor: '#DBEAFE', 
      criadoEm: '28/12/23' 
  },
  { 
      nome: 'Executivo', 
      criadoPor: 'Guilherme Sousa', 
      sigla: 'GS', 
      cor: '#1E3A8A', 
      backgroundColor: '#DBEAFE', 
      criadoEm: '28/12/23' 
  }
  ];

  getRelatoriosPaginados() {
    return this.relatorios.slice((this.paginaAtual - 1) * this.itensPorPagina, this.paginaAtual * this.itensPorPagina);
  }


  fecharModal() {
    this.fechar.emit();
  }
  inserirMencao() {
    console.log('Menção inserida!');
    this.fecharModal();
  }
    // Método para avançar para a próxima página
    proximaPagina() {
      if (this.paginaAtual < this.totalPaginas) {
        this.paginaAtual++;
      }
    }
  
    // Método para voltar para a página anterior
    paginaAnterior() {
      if (this.paginaAtual > 1) {
        this.paginaAtual--;
      }
    }
  
    // Método para atualizar a página ao editar o input manualmente
    atualizarPagina(event: any) {
      let valor = parseInt(event.target.value, 10);
      if (!isNaN(valor) && valor >= 1 && valor <= this.totalPaginas) {
        this.paginaAtual = valor;
      } else {
        event.target.value = this.paginaAtual;
      }
    }
  
}