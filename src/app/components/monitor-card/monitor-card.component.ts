// monitor-card.component.ts
import { Component, Input, ViewChild } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { OptionSearchComponent } from '../option-search/option-search.component';

@Component({
  selector: 'app-monitor-card',
  templateUrl: './monitor-card.component.html',
  styleUrls: ['./monitor-card.component.css'],
  standalone: false,
})
export class MonitorCardComponent {
  @Input() title!: string;
  @Input() startDate!: string;
  @Input() endDate!: string;
  @Input() status!: string;
  @Input() isMobile: boolean = false;
  @ViewChild('optionSearch') optionSearch!: OptionSearchComponent;

  constructor(private modalService: ModalService) {}

  get showBellIcon(): boolean {
    return this.status === 'Ativa';
  }

  get cardData() {
    return {
      title: this.title,
      startDate: this.startDate,
      endDate: this.endDate,
      status: this.status,
    };
  }

  // Método para abrir o modal de edição
  openEditModal() {
    this.modalService.openEditModal(this.cardData);
  }

  // Método para abrir o modal de duplicação
  openDuplicateModal() {
    this.modalService.openDuplicateModal(this.cardData);
  }
}