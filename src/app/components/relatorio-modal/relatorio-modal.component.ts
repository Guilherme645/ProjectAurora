import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { DataService, Relatorio } from 'src/app/services/data.service';

@Component({
    selector: 'app-relatorio-modal',
    templateUrl: './relatorio-modal.component.html',
    styleUrls: ['./relatorio-modal.component.css'],
    standalone: false
})
export class RelatorioModalComponent implements OnInit {
  @Output() fechar = new EventEmitter<void>();
  @Output() inserir = new EventEmitter<void>();

  paginaAtual = 1;
  itensPorPagina = 5;
  relatorios: Relatorio[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getRelatorios().subscribe((data) => {
      this.relatorios = data;
    });
  }

  get totalPaginas(): number {
    return Math.ceil(this.relatorios.length / this.itensPorPagina);
  }

  getRelatoriosPaginados() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    return this.relatorios.slice(inicio, inicio + this.itensPorPagina);
  }

  fecharModal() {
    this.fechar.emit();
  }

  inserirMencao() {
    console.log('Menção inserida!');
    this.inserir.emit();
    this.fecharModal();
  }

  proximaPagina() {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
    }
  }

  paginaAnterior() {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
    }
  }

  atualizarPagina(event: any) {
    const valor = parseInt(event.target.value, 10);
    if (!isNaN(valor) && valor >= 1 && valor <= this.totalPaginas) {
      this.paginaAtual = valor;
    } else {
      event.target.value = this.paginaAtual;
    }
  }
}
