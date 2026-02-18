import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

type Mode = 'category' | 'tier';
type GroupKey = string;

export interface VehicleItem {
  nome: string;
  selecionado: boolean;
}

@Component({
  selector: 'app-veiculos',
  templateUrl: './veiculos.component.html',
  styleUrls: ['./veiculos.component.css'],
  standalone: false,
})
export class VeiculosComponent implements OnInit {
  isMobile: boolean = window.innerWidth <= 768;
  isModalOpen: boolean = true;

  /** ✅ NOVO: controla o layout/dados */
  @Input() mode: Mode = 'category'; // default: comportamento antigo
  /**
   * ✅ opcional: se o pai quiser passar os dados prontos:
   * {
   *   "Tier 1": [...],
   *   "Tier 2": [...],
   * }
   */
  @Input() dataSource?: Record<string, VehicleItem[]>;

  searchQuery: string = '';
  selectAll: boolean = false;

  /** grupos dinâmicos: pode ser categorias ou tiers */
  groups: GroupKey[] = [];
  selectedGroup: GroupKey = '';

  /** dados normalizados por grupo */
  vehiclesByGroup: Record<GroupKey, VehicleItem[]> = {};

  @Output() close = new EventEmitter<void>();

  constructor(private dataservice: DataService) {}

  ngOnInit(): void {
    if (this.dataSource) {
      this.applyData(this.dataSource);
      return;
    }
    this.loadVeiculos();
  }

  /** caso o pai altere dataSource depois */
  ngOnChanges(): void {
    if (this.dataSource) this.applyData(this.dataSource);
  }

  private applyData(src: Record<string, VehicleItem[]>) {
    this.vehiclesByGroup = {};
    Object.keys(src || {}).forEach((k) => {
      this.vehiclesByGroup[k] = (src[k] || []).map(this.normalizeVehicle);
    });

    this.groups = Object.keys(this.vehiclesByGroup);

    // define default selecionado
    const preferred =
      this.mode === 'tier'
        ? (this.groups.find((g) => g.toLowerCase().includes('tier 1')) ?? this.groups[0])
        : (this.groups.find((g) => g.toLowerCase() === 'texto') ?? this.groups[0]);

    this.selectedGroup = preferred || '';
    this.updateSelectAll();
  }

  loadVeiculos(): void {
    // ✅ usa o mesmo endpoint que você já tem
    this.dataservice.getVeiculos().subscribe({
      next: (data: any) => {
        /**
         * Aqui é o pulo do gato:
         * - Se mode='category', esperamos chaves Texto/Vídeo/Áudio
         * - Se mode='tier', esperamos chaves Tier 1/2/3
         *
         * Se teu backend NÃO vier assim, você adapta só aqui.
         */
        this.applyData(data);
      },
      error: (err) => console.error('Erro ao carregar veículos:', err),
    });
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
    // ✅ só pra manter seu texto antigo no modo category
    if (this.mode !== 'category') return this.selectedGroup;

    if (this.selectedGroup === 'Texto') return 'Texto (Jornais impressos e Web)';
    if (this.selectedGroup === 'Áudio') return 'Áudio (Rádio)';
    if (this.selectedGroup === 'Vídeo') return 'Vídeo (Canais de televisão)';
    return this.selectedGroup;
  }

  getSelectedGroupTotal(): number {
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
