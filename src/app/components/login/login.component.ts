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
  credentialsError: string | null = null;
  showPassword: boolean = false;
  showError: boolean = false;

  private readonly emailCorreto = "admin@gmail.com";
  private readonly senhaCorreta = "123456";

  constructor(private router: Router) {}

  /** 🔹 Método para realizar login */
  onLogin(): void {
    this.validateEmail();
    this.validatePassword();

    // Se houver erro em email ou senha, não prosseguir
    if (this.emailError || this.passwordError) {
      this.showError = true;
      return;
    }

    // Verifica credenciais
    if (this.email !== this.emailCorreto || this.password !== this.senhaCorreta) {
      this.credentialsError = "Email ou senha incorretos.";
      this.showError = true;
      return;
    }

    // Se passar por todas as validações, limpa erros e faz login
    this.limparErros();
    console.log("Login realizado com sucesso:", this.email);
    this.router.navigate(['/navBar']);
  }

  /** 🔹 Validação do email */
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

  /** 🔹 Validação da senha */
  validatePassword(): void {
    if (!this.password) {
      this.passwordError = "A senha é obrigatória.";
    } else if (this.password.length < 6) {
      this.passwordError = "A senha deve ter pelo menos 6 caracteres.";
    } else {
      this.passwordError = null;
    }
  }

  /** 🔹 Alternar visibilidade da senha */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    if (passwordInput) {
      passwordInput.type = this.showPassword ? "text" : "password";
    }
  }

  /** 🔹 Limpa todas as mensagens de erro */
  private limparErros(): void {
    this.emailError = null;
    this.passwordError = null;
    this.credentialsError = null;
    this.showError = false;
  }
}
