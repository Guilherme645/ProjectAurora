import { Component } from '@angular/core';

@Component({
  selector: 'app-esqueceu-senha',
  templateUrl: './esqueceu-senha.component.html',
  styleUrls: ['./esqueceu-senha.component.css']
})
export class EsqueceuSenhaComponent {
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
