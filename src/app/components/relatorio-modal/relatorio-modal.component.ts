import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { DataService, Relatorio } from 'src/app/services/data.service';
// Lembre-se de importar o FormsModule no seu módulo
import { FormsModule } from '@angular/forms';

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
  relatorios: (Relatorio & { selected?: boolean })[] = []; // O tipo foi corrigido aqui
  allSelected = false;
  searchText = '';

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getRelatorios().subscribe((data: Relatorio[]) => {
      // Mapeia os dados para adicionar a propriedade 'selected' a cada objeto
      this.relatorios = data.map(rel => ({ ...rel, selected: false }));
    });
  }

  get totalPaginas(): number {
    const filtered = this.getFilteredRelatorios();
    return Math.ceil(filtered.length / this.itensPorPagina);
  }

  getFilteredRelatorios(): Relatorio[] {
    if (!this.searchText) {
      return this.relatorios;
    }
    return this.relatorios.filter(relatorio => 
      relatorio.nome.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  getRelatoriosPaginados() {
    const filtered = this.getFilteredRelatorios();
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    return filtered.slice(inicio, inicio + this.itensPorPagina);
  }

  fecharModal() {
    this.fechar.emit();
  }

  toggleAll(event: any) {
    const checked = event.target.checked;
    this.relatorios.forEach(relatorio => relatorio.selected = checked);
    this.allSelected = checked;
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