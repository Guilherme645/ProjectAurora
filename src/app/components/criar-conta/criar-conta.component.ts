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
  contaCriada: boolean = false; // Controla a exibição da tela de sucesso

  /**
   * Função executada ao submeter o formulário.
   * Verifica a etapa atual e avança para a próxima ou finaliza a criação da conta.
   */
  onSubmit() {
    if (this.etapa === 'email') {
      this.validateEmail();
      if (!this.emailError) {
        this.etapa = 'senha'; // Avança para a etapa de senha
      }
    } else {
      this.validatePassword();
      if (!this.passwordError) {
        this.contaCriada = true; // Exibe a tela de sucesso
        console.log("Conta criada com sucesso:", this.email);
      }
    }
  }

  /**
   * Valida o formato do email e se ele foi preenchido.
   */
  validateEmail() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.emailError = !this.email
      ? "O email é obrigatório."
      : !emailPattern.test(this.email)
      ? "Insira um email válido."
      : null;
  }

  /**
   * Valida a senha, garantindo que tenha pelo menos 8 caracteres.
   */
  validatePassword() {
    this.passwordError = this.password.length < 8
      ? "A senha deve ter pelo menos 8 caracteres."
      : null;
  }

  /**
   * Alterna a visibilidade da senha entre texto e oculto.
   */
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
