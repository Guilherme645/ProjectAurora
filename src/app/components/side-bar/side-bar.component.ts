import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  isModalVisible = false;
  isExpanded = true;
  isSidebarOpen = true;
  isMobile = window.innerWidth <= 768;
  currentUser = { name: 'Superior Tribunal Federal' };
  menuItems = [
    { label: 'Início', link: '/home/workspace', icon: 'home' },
    { label: 'Busca Geral', link: '/home/general-search', icon: 'search' },
    { label: 'Buscas Salvas', link: '/home/saved-search', icon: 'bookmark' },
    { label: 'Clippings', link: '/home/clippings', icon: 'clip' },
    { label: 'Dashboard', link: '/home/dashboard', icon: 'dashboard' }
  ];
  users: { [key: string]: string } = {}; // Armazena os usuários carregados
  @Output() userChange = new EventEmitter<string>();

  constructor(private dataService: DataService) {}

  /** 🔹 Inicializa o componente */
  ngOnInit(): void {
    this.checkScreenSize();
    this.loadUsers();
  }

  /** 🔹 Obtém as chaves dos usuários carregados */
  get userKeys(): string[] {
    return Object.keys(this.users);
  }

  /** 🔹 Obtém as iniciais do nome do usuário */
  getInitials(fullName: string): string {
    return fullName
      .split(' ') // Divide o nome em palavras
      .map(word => word[0]) // Captura a primeira letra de cada palavra
      .join('') // Junta as iniciais
      .toUpperCase(); // Converte para maiúsculas
  }

  /** 🔹 Carrega os usuários do JSON via serviço */
  private loadUsers(): void {
    this.dataService.getUsers().subscribe(
      (data) => this.users = data,
      (error) => console.error('Erro ao carregar usuários:', error)
    );
  }

  /** 🔹 Alterna a visibilidade do sidebar */
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  /** 🔹 Alterna a visibilidade do modal */
  toggleModal(): void {
    this.isModalVisible = !this.isModalVisible;
  }

  /** 🔹 Detecta e ajusta o tamanho da tela */
  @HostListener('window:resize')
  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  /** 🔹 Altera o usuário ativo e emite evento */
  changeUser(userKey: string): void {
    this.currentUser.name = this.users[userKey] || 'Usuário Desconhecido';
    this.userChange.emit(this.currentUser.name);
  }
}