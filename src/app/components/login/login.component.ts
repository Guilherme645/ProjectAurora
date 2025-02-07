import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  emailError: string = '';
  passwordError: string = '';
  loginError: string = '';

  private readonly correctEmail: string = 'test@gmail.com';
  private readonly correctPassword: string = '123456';

  constructor(private router: Router) {}

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

  // Validação de Senha
  validatePassword(): void {
    if (!this.password) {
      this.passwordError = 'Insira a senha para acessar sua conta.';
    } else {
      this.passwordError = '';
    }
  }

  // Lógica de Login
  onLogin(): void {
    this.validateEmail();
    this.validatePassword();

    // Se houver erros de email ou senha, interrompe o login
    if (this.emailError || this.passwordError) {
      return;
    }

    // Verifica credenciais fixas
    if (this.email === this.correctEmail && this.password === this.correctPassword) {
      this.router.navigate(['/navBar']);
    } else {
      this.loginError = 'Insira os dados corretos para acessar sua conta.';
    }
  }
}
