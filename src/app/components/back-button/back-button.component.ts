// back-button.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.css'],
  standalone: false
})
export class BackButtonComponent {

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/navBar']);
  }
}
