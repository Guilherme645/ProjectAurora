import { Component } from '@angular/core';

@Component({
  selector: 'app-esqueceu-senha',
  templateUrl: './esqueceu-senha.component.html',
  styleUrls: ['./esqueceu-senha.component.css']
})
export class EsqueceuSenhaComponent {
  email: string = '';
  emailError: string | null = null;
  contaCriada: boolean = false; // Controla a exibição da tela de sucesso

  onSubmit() {
    this.validateEmail();
    if (!this.emailError) {
      // Simula o envio do email e muda para a tela de sucesso
      setTimeout(() => {
        this.contaCriada = true;
      }, 500); // Simula um pequeno delay para feedback do usuário
    }
  }

  validateEmail() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.emailError = !this.email
      ? "O email é obrigatório."
      : !emailPattern.test(this.email)
      ? "Insira um email válido."
      : null;
  }
}