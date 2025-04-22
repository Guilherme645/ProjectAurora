import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-monitor-card',
  templateUrl: './monitor-card.component.html',
  styleUrls: ['./monitor-card.component.css'],
  standalone: false
})
export class MonitorCardComponent {
  @Input() title!: string;
  @Input() startDate!: string;
  @Input() endDate!: string;
  @Input() status!: string;

  // Determina se o sino deve ser exibido (apenas para status "Ativa")
  get showBellIcon(): boolean {
    return this.status === 'Ativa';
  }

  // Dados do card para passar ao OptionSearchComponent
  get cardData() {
    return {
      title: this.title,
      startDate: this.startDate,
      endDate: this.endDate,
      status: this.status
    };
  }
}