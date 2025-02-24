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
  emailError: string | null = null;
  passwordError: string | null = null;
  errorMessage: string | null = null;
  showPassword: boolean = false;
  showError: boolean = false;
  invalidLogin: boolean = false;


  constructor(private router: Router) {} // Injeção do Router

  onLogin() {
    this.validateEmail();
    this.validatePassword();

    // Limpa mensagem de erro geral
    this.errorMessage = null;

    // Se houver erro nos inputs, concatena as mensagens e exibe
    if (this.emailError || this.passwordError) {
      this.invalidLogin = false;
      this.errorMessage = "Insira os dados corretos para acessar sua conta.";
      this.showError = true;
      setTimeout(() => { this.showError = false; }, 5000);
      return;
    }

    // Simulação de credenciais corretas
    const emailCorreto = "admin@gmail.com";
    const senhaCorreta = "123456";

    if (this.email !== emailCorreto || this.password !== senhaCorreta) {
      this.invalidLogin = true;
      this.errorMessage = "Insira os dados corretos para acessar sua conta.";
      this.showError = true;
      setTimeout(() => { this.showError = false; }, 5000);
      return;
    }

    // Se o login for bem-sucedido
    this.invalidLogin = false;
    this.showError = false;
    console.log("Login realizado com sucesso:", this.email);
    this.router.navigate(['/navBar']); // Redirecionamento para a página NavBar
  }

  validateEmail() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!this.email) {
      this.emailError = "O email é obrigatório.";
    } else if (!emailPattern.test(this.email)) {
      this.emailError = "Insira um email válido.";
    } else {
      this.emailError = null;
    }
  }

  validatePassword() {
    if (!this.password) {
      this.passwordError = "A senha é obrigatória.";
    } else if (this.password.length < 6) {
      this.passwordError = "A senha deve ter pelo menos 6 caracteres.";
    } else {
      this.passwordError = null;
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
    let passwordInput = document.getElementById("password") as HTMLInputElement;
    if (passwordInput) {
      passwordInput.type = this.showPassword ? "text" : "password";
    }
  }
}
