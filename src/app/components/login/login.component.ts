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
  showPassword: boolean = false; // Estado para alternar a senha visível
  emailError: string = '';
  passwordError: string = '';
  loginError: string = '';

  private readonly correctEmail: string = 'guilherme@gmail.com';
  private readonly correctPassword: string = '123456';

  constructor(private router: Router) {}

  // Validação de Email
  validateEmail(): void {
    this.email = this.email.trim(); // Remove espaços desnecessários

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
    this.password = this.password.trim(); // Remove espaços desnecessários

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

    // Se houver erros, interrompe o login
    if (this.emailError || this.passwordError) {
      return;
    }

    // Verifica credenciais fixas
    if (this.email === this.correctEmail && this.password === this.correctPassword) {
      this.router.navigate(['/navBar']);
    } else {
      this.loginError = 'Email ou senha incorretos.';
    }
  }

  // Alternar a visibilidade da senha
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
