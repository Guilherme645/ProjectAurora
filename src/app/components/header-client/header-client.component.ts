import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header-client',
  templateUrl: './header-client.component.html',
  styleUrls: ['./header-client.component.css'],
  standalone: false
})
export class HeaderClientComponent implements OnInit {
  @Output() openModal = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

}
