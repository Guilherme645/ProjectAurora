import { Component } from '@angular/core';

@Component({
  selector: 'app-criar-conta',
  templateUrl: './criar-conta.component.html',
  styleUrls: ['./criar-conta.component.css']
})
export class CriarContaComponent {
  email: string = '';
  password: string = '';

  emailError: string = '';
  passwordError: string = '';
  loginError: string = '';

  
  // Validação de Email
  validateEmail(): void {
    if (!this.email) {
      this.emailError = 'Insira os dados para acessar sua conta.';
    } else if (!this.email.includes('@') || !this.email.includes('.')) {
      this.emailError = 'Insira um email válido.';
    } else {
      this.emailError = '';
    }
  }

}
