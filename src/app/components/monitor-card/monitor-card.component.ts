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
}