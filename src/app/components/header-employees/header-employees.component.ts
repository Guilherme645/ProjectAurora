import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header-employees',
  templateUrl: './header-employees.component.html',
  styleUrls: ['./header-employees.component.css'],
  standalone: false
})
export class HeaderEmployeesComponent {
  @Output() openModal = new EventEmitter<void>();

  constructor() { }
}