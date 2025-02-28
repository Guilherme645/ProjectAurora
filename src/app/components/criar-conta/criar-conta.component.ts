import { Component } from '@angular/core';

@Component({
  selector: 'app-criar-conta',
  templateUrl: './criar-conta.component.html',
  styleUrls: ['./criar-conta.component.css']
})
export class CriarContaComponent {
  email: string = '';
  password: string = '';
  emailError: string | null = null;
  passwordError: string | null = null;
  etapa: 'email' | 'senha' = 'email';
  showPassword: boolean = false;
  contaCriada: boolean = false;

  onSubmit(): void {
    if (this.etapa === 'email') {
      this.validateEmail();
      if (!this.emailError) this.etapa = 'senha';
    } else {
      this.validatePassword();
      if (!this.passwordError) {
        this.contaCriada = true;
        console.log('Conta criada com sucesso:', this.email);
      }
    }
  }

 
  validateEmail(): void {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.emailError = !this.email
      ? 'O email é obrigatório.'
      : !emailPattern.test(this.email)
      ? 'Insira um email válido.'
      : null;
  }

  validatePassword(): void {
    this.passwordError = this.password.length < 8
      ? 'A senha deve ter pelo menos 8 caracteres.'
      : null;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
