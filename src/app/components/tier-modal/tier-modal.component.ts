import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
type Mode = 'category' | 'tier';
type GroupKey = string;

export interface VehicleItem {
  nome: string;
  selecionado: boolean;
}
@Component({
  selector: 'app-tier-modal',
  templateUrl: './tier-modal.component.html',
  styleUrls: ['./tier-modal.component.css'],
  standalone: false
})
export class TierModalComponent implements OnInit {
isMobile: boolean = window.innerWidth <= 768;
  isModalOpen: boolean = true;

  // ✅ Mudando o default para 'tier' para exibir exatamente como na foto
  @Input() mode: Mode = 'tier'; 
  @Input() dataSource?: Record<string, VehicleItem[]>;

  searchQuery: string = '';
  selectAll: boolean = true; // Inicia marcado igual à foto

  groups: GroupKey[] = [];
  selectedGroup: GroupKey = 'Tier 1';
  vehiclesByGroup: Record<GroupKey, VehicleItem[]> = {};

  @Output() close = new EventEmitter<void>();

  // ✅ Dados exatos extraídos da foto
  private mockData: Record<string, VehicleItem[]> = {
    'Tier 1': [
      { nome: 'O dia', selecionado: true },
      { nome: 'Brasil em Tempo Real', selecionado: true },
      { nome: 'O Globo', selecionado: true },
      { nome: 'Zero Hora', selecionado: true },
      { nome: 'Jornal do Brasil', selecionado: true },
      { nome: 'Correio do Povo', selecionado: true },
      { nome: 'Jornal do Comércio', selecionado: true },
      { nome: 'Diário Popular', selecionado: true },
      { nome: 'A tribuna da Imprensa', selecionado: true },
      { nome: 'Folha da Cidade', selecionado: true },
      { nome: 'Folha Dirigida', selecionado: true },
      { nome: 'Jornal do Comércio ', selecionado: true }, // Espaço no final para diferenciar a key
      { nome: 'A Voz da Serra', selecionado: true },
      { nome: 'Jornal NH', selecionado: true },
      { nome: 'Tribuna de Petrópolis', selecionado: true },
      { nome: 'Jornal VS', selecionado: true },
      { nome: 'Inverta - Jornal pra Ver...', selecionado: true },
      { nome: 'Diário de Canoas', selecionado: true },
      { nome: 'Correio Brasiliense', selecionado: true },
      { nome: 'A razão', selecionado: true },
    ],
    'Tier 2': [
      { nome: 'Exemplo Veículo Tier 2', selecionado: false },
    ],
    'Tier 3': [
      { nome: 'Exemplo Veículo Tier 3', selecionado: false },
    ]
  };

  constructor() {}

  ngOnInit(): void {
    // Se o pai passar dados, usa os do pai. Senão, usa os da foto (Mockup)
    if (this.dataSource) {
      this.applyData(this.dataSource);
    } else {
      this.applyData(this.mockData);
    }
  }

  ngOnChanges(): void {
    if (this.dataSource) this.applyData(this.dataSource);
  }

  private applyData(src: Record<string, VehicleItem[]>) {
    this.vehiclesByGroup = {};
    Object.keys(src || {}).forEach((k) => {
      this.vehiclesByGroup[k] = (src[k] || []).map(this.normalizeVehicle);
    });

    this.groups = Object.keys(this.vehiclesByGroup);

    // Força o "Tier 1" a ser o inicial
    this.selectedGroup = this.groups.find((g) => g === 'Tier 1') ?? this.groups[0] ?? '';
    this.updateSelectAll();
  }

  private normalizeVehicle = (v: any): VehicleItem => ({
    nome: String(v?.nome ?? v?.name ?? ''),
    selecionado: Boolean(v?.selecionado ?? v?.selected ?? false),
  });

  selectGroup(group: GroupKey): void {
    this.selectedGroup = group;
    this.updateSelectAll();
  }

  getFilteredVehicles(): VehicleItem[] {
    const all = this.vehiclesByGroup[this.selectedGroup] || [];
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return all;
    return all.filter((v) => v.nome.toLowerCase().includes(q));
  }

  getGroupTitle(): string {
    return this.selectedGroup;
  }

  // ✅ Força o número 492 para o Tier 1, exatamente como na foto
  getSelectedGroupTotal(): number | string {
    if (this.selectedGroup === 'Tier 1' && !this.searchQuery) return 492;
    return (this.vehiclesByGroup[this.selectedGroup] || []).length;
  }

  toggleSelectAll(): void {
    const filtered = this.getFilteredVehicles();
    filtered.forEach((v) => (v.selecionado = this.selectAll));
  }

  updateSelectAll(): void {
    const filtered = this.getFilteredVehicles();
    this.selectAll = filtered.length > 0 && filtered.every((v) => v.selecionado);
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.close.emit();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.key !== 'Escape') return;
    if (this.isModalOpen) {
      this.closeModal();
      event.preventDefault();
      event.stopPropagation();
    }
  }
}