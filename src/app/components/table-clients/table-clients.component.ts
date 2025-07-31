// src/app/components/table-clients/table-clients.component.ts

import { Component, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { ChipColor } from '../chips/chips.component';

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

@Component({
  selector: 'app-table-clients',
  templateUrl: './table-clients.component.html',
  styleUrls: ['./table-clients.component.css'],
  standalone: false
})
export class TableClientsComponent implements AfterViewInit {
  // ✅ 1. A lista de clientes agora é um Input, recebida do componente pai.
  @Input() clients: Client[] = [];
  
  @Output() editClient = new EventEmitter<Client>();

  // ❌ 2. A lista de clientes fixos foi removida daqui.

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