import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  emailError: string | null = null;
  passwordError: string | null = null;
  credentialsError: string | null = null;
  dadosVaziosError: string | null = null;
  showPassword: boolean = false;
  showError: boolean = false;

  private readonly emailCorreto = "admin@gmail.com";
  private readonly senhaCorreta = "123456";

  constructor(private router: Router) {}

  onLogin(): void {
    this.limparErros(); 

    if (!this.email && !this.password) {
      this.dadosVaziosError = "Insira os dados para acessar sua conta.";
      this.showError = true;
      return;
    }

    this.validateEmail();
    this.validatePassword();

    if (this.emailError || this.passwordError) {
      this.showError = true;
      return;
    }

    if (this.email !== this.emailCorreto || this.password !== this.senhaCorreta) {
      this.credentialsError = "Insira os dados corretos para acessar sua conta.";
      this.showError = true;
      return;
    }

    this.limparErros();
    console.log("Login realizado com sucesso:", this.email);
    this.router.navigate(['/navBar']);
  }

  validateEmail(): void {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!this.email) {
      this.emailError = "O email é obrigatório.";
    } else if (!emailPattern.test(this.email)) {
      this.emailError = "Insira um email válido.";
    } else {
      this.emailError = null;
    }
  }

  validatePassword(): void {
    if (!this.password) {
      this.passwordError = "Insira a senha para acessar sua conta.";
    } else {
      this.passwordError = null;
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    if (passwordInput) {
      passwordInput.type = this.showPassword ? "text" : "password";
    }
  }

  private limparErros(): void {
    this.emailError = null;
    this.passwordError = null;
    this.credentialsError = null;
    this.dadosVaziosError = null;
    this.showError = false;
  }
}
