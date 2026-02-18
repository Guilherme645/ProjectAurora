import { Component, ElementRef, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';

interface FilterOption {
  label: string;
  value: string;
  checked: boolean;
}

@Component({
  selector: 'app-mentions-table', // Certifique-se que o seletor bate com o uso no pai
  templateUrl: './mentions-table.component.html',
  standalone: false
})
export class MentionsTableComponent implements OnChanges {
  // --- INPUTS DE DADOS ---
  @Input() data: any;
  @Input() isLoading: boolean = false;

  // --- NOVOS INPUTS (Correção do Erro) ---
  @Input() searchPlaceholder: string = ''; // Texto do placeholder da busca
  @Input() showVehicleStats: boolean = false; // Se mostra o card de veículos
  @Input() vehicleCount: number = 0; // Número atual de veículos
  @Input() totalVehicles: number = 0; // Total de veículos

  // --- ESTADO INTERNO ---
  filteredItems: any[] = [];
  searchTerm: string = ''; // Armazena o que foi digitado

  // Controle do Filtro (Tipo/Tier)
  isFilterOpen: boolean = false; // Controle de abertura do dropdown (se usar *ngIf no HTML)
  activeFilterColumn: string | null = null; // Qual coluna está com filtro aberto
  filters: { [key: string]: FilterOption[] } = {
    type: [] 
  };

  // Controle da Ordenação
  sortColumn: string = ''; 
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor(private eRef: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data?.data) {
      // Inicializa os filtros apenas na primeira carga ou mudança de dados
      if (this.filters['type'].length === 0) {
        this.initializeFilters();
      }
      this.processData(); 
    }
  }

  // Cria as opções do filtro (Tier 1, Tier 2 ou Pessoa, Organização...) dinamicamente
  initializeFilters() {
    if (!this.data?.data) return;
    
    const types = new Set(this.data.data.map((item: any) => item.tier || item.type));
    
    this.filters['type'] = Array.from(types)
      .filter(t => t) // Remove nulos/undefined
      .map(t => ({ 
        label: t as string, 
        value: t as string, 
        checked: true // Começa tudo marcado
      }));
  }

  // --- AÇÕES DO USUÁRIO ---

  // 1. Busca
  onSearch(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.processData();
  }

  // 2. Toggle do Dropdown de Filtro
  toggleFilter(column: string, event: MouseEvent) {
    event.stopPropagation();
    // Se clicar no mesmo, fecha. Se for outro, abre o novo.
    this.activeFilterColumn = this.activeFilterColumn === column ? null : column;
  }

  // 3. Checkbox do Filtro
  onFilterChange(column: string, option: FilterOption) {
    option.checked = !option.checked;
    this.processData();
  }

  // 4. Ordenação
  onSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'desc';
    }
    this.processData();
  }

  // --- LÓGICA CENTRAL ---

  getNumericValue(item: any, column: string): number {
    if (column === 'quantity') {
      return item.quantity || (item.negative + item.neutral + item.positive);
    }
    return item[column] || 0;
  }

  processData() {
    if (!this.data?.data) return;

    let tempItems = [...this.data.data];

    // PASSO 1: Filtro de Busca (Nome)
    if (this.searchTerm) {
      tempItems = tempItems.filter((item: any) => 
        item.name && item.name.toLowerCase().includes(this.searchTerm)
      );
    }

    // PASSO 2: Filtro de Tipo/Tier (Checkbox)
    // Pega apenas os valores que estão marcados como checked: true
    const activeTypes = this.filters['type']
      .filter(f => f.checked)
      .map(f => f.value);

    // Se nem todos estiverem marcados, filtra
    if (activeTypes.length !== this.filters['type'].length) {
      tempItems = tempItems.filter((item: any) => {
        const itemType = item.tier || item.type;
        return activeTypes.includes(itemType);
      });
    }

    // PASSO 3: Ordenação
    if (this.sortColumn) {
      tempItems.sort((a: any, b: any) => {
        const valA = this.getNumericValue(a, this.sortColumn);
        const valB = this.getNumericValue(b, this.sortColumn);
        
        return this.sortDirection === 'asc' ? valA - valB : valB - valA;
      });
    }

    this.filteredItems = tempItems;
  }

  // Fecha o dropdown se clicar fora
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (this.activeFilterColumn && !this.eRef.nativeElement.contains(event.target)) {
      this.activeFilterColumn = null;
    }
  }
}