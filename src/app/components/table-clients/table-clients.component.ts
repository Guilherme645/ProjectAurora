// Caminho do arquivo: src/app/components/table-clients/table-clients.component.ts

import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ChipColor } from '../chips/chips.component';

// =================================================================================
// 👇 GARANTA QUE "export" ESTÁ EXATAMENTE AQUI. É ISSO QUE TORNA A INTERFACE VISÍVEL.
export interface Client {
  id: number;
  name: string;
  cnpjCpf: string;
  type: 'Público' | 'Privado' | 'Notas';
  contracts: number;
  email?: string;
  phone?: string;
  stateRegistration?: string;
  municipalRegistration?: string;
}
// =================================================================================

@Component({
  selector: 'app-table-clients',
  templateUrl: './table-clients.component.html',
  styleUrls: ['./table-clients.component.css'],
  standalone: false
})
export class TableClientsComponent implements AfterViewInit {
  @Output() editClient = new EventEmitter<Client>();

  clients: Client[] = [
    { id: 1, name: 'Superior Tribunal Federal', cnpjCpf: '00.581.040/0001-45', type: 'Público', contracts: 1, email: 'stf@exemplo.com', phone: '(61) 3217-3000', stateRegistration: 'ISENTO', municipalRegistration: 'ISENTO' },
    { id: 2, name: 'Procuradoria Geral', cnpjCpf: '22.302.716/0001-02', type: 'Público', contracts: 1, email: 'pgr@exemplo.com', phone: '(61) 3105-5100', stateRegistration: 'ISENTO', municipalRegistration: 'ISENTO' },
    { id: 3, name: 'Nestlé Brasil Ltda.', cnpjCpf: '60.409.075/0001-52', type: 'Privado', contracts: 3, email: 'contato@nestle.com.br', phone: '(11) 5508-4400', stateRegistration: '110.041.222.118', municipalRegistration: '9.345.678-3' },
    { id: 4, name: 'Tribunal de Contas da União', cnpjCpf: '00.373.840/0001-90', type: 'Público', contracts: 1, email: 'tcu@exemplo.com', phone: '(61) 3316-7248', stateRegistration: 'ISENTO', municipalRegistration: 'ISENTO' },
  ];

  constructor() {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      if ((window as any).HSStaticMethods) {
        (window as any).HSStaticMethods.autoInit();
      }
    }, 100);
  }

  getChipColor(type: 'Público' | 'Privado' | 'Notas'): ChipColor {
    switch (type) {
      case 'Público': return 'blue';
      case 'Privado': return 'yellow';
      case 'Notas': return 'green';
      default: return 'gray';
    }
  }

  onEdit(client: Client): void {
    this.editClient.emit(client);
  }
}