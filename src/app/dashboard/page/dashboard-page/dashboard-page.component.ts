import { Component, HostListener, OnInit } from '@angular/core';
import { DashboardService, DashboardData } from '../../service/dashboard.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  standalone: false
})
export class DashboardPageComponent implements OnInit {
    isFilterOpen = false;

isLocationModalOpen = false;
  isVehiclesModalOpen = false;
  isModalOpen = false;

  sidebarOpen = false;
  dashboardData?: DashboardData;
  isLoading = true;

  // 👉 1. ADICIONE ESTAS DUAS VARIÁVEIS AQUI
  filteredVolumeData: any[] = [];
  selectedKeywords: string[] = ['Dias Toffoli', 'Alexandre de Moraes', 'Roberto Barroso'];
  // ✅ flags
  private reopenFilterAfterLocationClose = false;
  private reopenFilterAfterVehiclesClose = false;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.isLoading = false;
        this.updateFilteredData();
      },
      error: (err) => { console.error(err); this.isLoading = false; }
    });
  }

  // 👉 3. ADICIONE A FUNÇÃO TOGGLE AQUI (Dentro da classe, antes ou depois das outras funções)
onKeywordsChanged(keywords: string[]) {
    this.selectedKeywords = keywords;
    this.updateFilteredData();
  }
 updateFilteredData() {
    if (!this.dashboardData?.volume) return;

    // Criamos uma paleta de cores maior para suportar vários ministros ao mesmo tempo
    const mockupColors = ['#2563EB', '#14B8A6', '#EBD725', '#9333EA', '#F97316', '#EF4444', '#10B981'];

    this.filteredVolumeData = this.selectedKeywords.map((keyword, index) => {
      // 1. Tenta achar os dados desse ministro que já vieram da API mockada
      const existingData = this.dashboardData!.volume.find((s: any) => s.name === keyword);

      if (existingData) {
        // Se achou, usa ele e garante que a cor não vai se repetir errada
        return { ...existingData, color: mockupColors[index % mockupColors.length] };
      }

      // 2. Se NÃO ACHOU (ex: adicionou Luiz Fux), a gente cria dados fake na hora para o gráfico!
      return {
        name: keyword,
        color: mockupColors[index % mockupColors.length],
        // Gera 12 meses de valores aleatórios (entre 10 e 70) para desenhar a linha
        values: Array.from({ length: 12 }, () => Math.floor(Math.random() * 60) + 10)
      };
    });
  }
  openFilter() {
    this.isFilterOpen = true;
    this.isLocationModalOpen = false;
    this.isVehiclesModalOpen = false;

    // abriu manualmente → não reabrir automático
    this.reopenFilterAfterLocationClose = false;
    this.reopenFilterAfterVehiclesClose = false;
  }

  closeFilter() {
    this.isFilterOpen = false;
  }

  // ✅ IMPORTANTÍSSIMO: evento veio do filter, então seta true SEM depender do estado
  openLocationModal() {
    this.reopenFilterAfterLocationClose = true;

    this.isFilterOpen = false;
    this.isVehiclesModalOpen = false;

    setTimeout(() => (this.isLocationModalOpen = true), 0);
  }

  closeLocationModal() {
    this.isLocationModalOpen = false;

    if (this.reopenFilterAfterLocationClose) {
      this.reopenFilterAfterLocationClose = false;
      setTimeout(() => (this.isFilterOpen = true), 0);
    }
  }

  openVehiclesModal() {
    this.reopenFilterAfterVehiclesClose = true;

    this.isFilterOpen = false;
    this.isLocationModalOpen = false;

    setTimeout(() => (this.isVehiclesModalOpen = true), 0);
  }

  closeVehiclesModal() {
    this.isVehiclesModalOpen = false;

    if (this.reopenFilterAfterVehiclesClose) {
      this.reopenFilterAfterVehiclesClose = false;
      setTimeout(() => (this.isFilterOpen = true), 0);
    }
  }

  // ✅ ESC fecha só o topo e mantém o fluxo de reabrir
 @HostListener('document:keydown', ['$event'])
onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape') return;

  if (this.isVehiclesModalOpen) {
    this.closeVehiclesModal();
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  if (this.isLocationModalOpen) {
    this.closeLocationModal();
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  if (this.isModalOpen) {
    this.isModalOpen = false;
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  // NÃO fecha o dashboard filter no ESC
}


  onSidebarToggle(isOpen: boolean) {
    this.sidebarOpen = false;
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }
}
