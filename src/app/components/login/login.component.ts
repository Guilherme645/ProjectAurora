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
  private readonly correctEmail: string = 'a';
  private readonly correctPassword: string = 'a';

  constructor(private router: Router) {}

  onLogin(): void {
    if (this.email === this.correctEmail && this.password === this.correctPassword) {
      // Login bem-sucedido, redireciona para /navBar
      this.router.navigate(['/navBar']);
    } else {
      // Exibe mensagem de erro
      alert('Email ou senha incorretos!');
    }
  }
}
