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

  sidebarOpen = true;
  dashboardData?: DashboardData;
  isLoading = true;

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
      },
      error: (err) => { console.error(err); this.isLoading = false; }
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
    this.sidebarOpen = isOpen;
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }
}
