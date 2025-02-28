import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-account',
  templateUrl: './modal-account.component.html',
  styleUrls: ['./modal-account.component.css']
})
export class ModalAccountComponent {
  isOpen = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('ModalAccountComponent carregado');
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  logout() {
    console.log('Saindo da conta...');
    localStorage.removeItem('token'); 
    sessionStorage.removeItem('token'); 
    this.router.navigate(['/login']);
  }
}
