import { Component, OnInit } from '@angular/core';

export interface Client {
  id: number;
  name: string;
  cnpjCpf: string;
  type: 'Público' | 'Privado' | 'Notas';
  contracts: number;
}

@Component({
  selector: 'app-table-clients',
  templateUrl: './table-clients.component.html',
  styleUrls: ['./table-clients.component.css'],
  standalone: false
})
export class TableClientsComponent {
  // Dados mocados para a tabela
  clients: Client[] = [
    { id: 1, name: 'Superior TribunalFederal', cnpjCpf: '00.581.040/0001-45', type: 'Público', contracts: 1 },
    { id: 2, name: 'Procuradoria Geral', cnpjCpf: '22.302.716/0001-02', type: 'Público', contracts: 1 },
    { id: 3, name: 'Nestlé', cnpjCpf: '06.481.080/0001-85', type: 'Privado', contracts: 3 },
    { id: 4, name: 'Tribunal de Contas do União', cnpjCpf: '00.373.840/0001-90', type: 'Público', contracts: 1 },
    { id: 5, name: 'Câmara dos Deputados', cnpjCpf: '00.530.351/0001-50', type: 'Público', contracts: 1 },
    { id: 6, name: 'Comitê Olímpico Brasileiro', cnpjCpf: '34.711.288/0001-67', type: 'Público', contracts: 2 },
  ];

  constructor() {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (window.HSStaticMethods) {
        window.HSStaticMethods.autoInit();
      }
    }, 100);
  }
}