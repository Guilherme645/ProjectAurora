import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-sidebar-result-saved-search',
  templateUrl: './sidebar-result-saved-search.component.html',
  styleUrls: ['./sidebar-result-saved-search.component.css'],
  standalone: false
})
export class SidebarResultSavedSearchComponent implements OnInit {
  @Input() isSidebarOpen = true;
  @Output() userChange = new EventEmitter<string>();
  @Output() sidebarToggled = new EventEmitter<boolean>();

  isModalVisible = false;
  isExpanded = false; // Estado inicial colapsado, conforme a imagem
  isMobile = window.innerWidth <= 768;
  currentUser = { name: 'Superior Tribunal Federal' };
  userName = 'Gabriel Silva';
  userRole = 'Analista';
  users: { [key: string]: string } = {};

  menuItems = [
    { label: 'Início', route: '/home', icon: '<path d="M3 9L12 2L21 9V20A2 2 0 0 1 19 22H5A2 2 0 0 1 3 20Z"/>' },
    { label: 'Buscar', route: '/search', icon: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>' },
    { label: 'Salvar', route: '/saved', icon: '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>' },
    { label: 'Rede', route: '/network', icon: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15..."/>' },
    { label: 'Entidades', route: '/entities', icon: '<path d="M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6..."/>' },
    { label: 'Painéis', route: '/dashboards', icon: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>' },
    { label: 'Configurações', route: '/settings', icon: '<circle cx="12" cy="12" r="3"/><path d="..."/>' }
  ];

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadUsers();
    this.isExpanded = this.isSidebarOpen;
  }

  ngOnChanges(): void {
    this.isExpanded = this.isSidebarOpen;
  }

  get userKeys(): string[] {
    return Object.keys(this.users);
  }

  getInitials(fullName: string): string {
    return fullName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  private loadUsers(): void {
    this.dataService.getUsers().subscribe(
      (data) => (this.users = data),
      (error) => console.error('Erro ao carregar usuários:', error)
    );
  }

  toggleSidebar(): void {
    this.isExpanded = !this.isExpanded;
    this.isSidebarOpen = this.isExpanded; // Sincroniza com o estado atual
    this.sidebarToggled.emit(this.isSidebarOpen);
  }

  toggleModal(): void {
    this.isModalVisible = !this.isModalVisible;
  }

  @HostListener('window:resize')
  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.isSidebarOpen = true;
      this.isExpanded = false; // Mantém colapsada na visualização desktop, como na imagem
    } else {
      this.isSidebarOpen = false;
      this.isExpanded = false;
    }
    this.sidebarToggled.emit(this.isSidebarOpen);
  }

  changeUser(userKey: string): void {
    this.currentUser.name = this.users[userKey] || 'Usuário Desconhecido';
    this.userChange.emit(this.currentUser.name);
  }

  logout(): void {
    console.log('Usuário deslogado');
    this.isSidebarOpen = false;
    this.isExpanded = false;
    this.sidebarToggled.emit(this.isSidebarOpen);
    this.router.navigate(['/login']);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }

  getIconPath(icon: string): string {
    switch (icon) {
      case 'list':
        return `<line x1="8" x2="21" y1="6" y2="6"></line><line x1="8" x2="21" y1="12" y2="12"></line><line x1="8" x2="21" y1="18" y2="18"></line><line x1="3" x2="3.01" y1="6" y2="6"></line><line x1="3" x2="3.01" y1="12" y2="12"></line><line x1="3" x2="3.01" y1="18" y2="18"></line>`;
      case 'dashboard':
        return `<rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect>`;
      case 'settings':
        return `<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>`;
      default:
        return '';
    }
  }
}