import { Component, EventEmitter, HostListener, OnInit, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
  standalone: false
})
export class SideBarComponent implements OnInit {
  @Input() isSidebarOpen = true;
  @Output() userChange = new EventEmitter<string>();
  @Output() sidebarToggled = new EventEmitter<boolean>();
  @Output() openModalExternally = new EventEmitter<void>();
  isExpanded = true;
  isThreeDotsActive = false; // New property to track active state of the button
  isMobile = window.innerWidth <= 768;
  currentUser = { name: 'Superior Tribunal Federal' };
  userName = 'Antônio Costa';
  userRole = 'Analista';
  isClicked = false;
  users: { [key: string]: string } = {};
  menuItems = [
    { label: 'Início', link: '/navBar', icon: 'home' },
    {
      label: 'Busca Geral',
      link: '/busca',
      icon: 'search',
      subItems: [
        { label: 'Buscas Salvas', link: '/saved-search', icon: 'bookmark' }
      ],
      open: false
    },
    { label: 'Clippings', link: '/clippings', icon: 'clip' },
    { label: 'Relatórios', link: '/home/report', icon: 'report' },
    { label: 'Dashboard', link: '/home/dashboard', icon: 'dashboard' },
    { label: 'Configurações', link: '/home/settings', icon: 'settings' }
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
    this.isSidebarOpen = !this.isSidebarOpen;
    this.sidebarToggled.emit(this.isSidebarOpen);
  }

  toggleSubMenu(item: any): void {
    this.menuItems.forEach(menuItem => {
      if (menuItem !== item) {
        menuItem.open = false;
      }
    });
    if (item.subItems) {
      item.open = !item.open;
    }
  }

  @HostListener('window:resize')
  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.isSidebarOpen = true;
      this.isExpanded = true;
    } else {
      this.isSidebarOpen = false;
      this.isExpanded = false;
    }
    this.sidebarToggled.emit(this.isSidebarOpen);
  }


 changeUser(userKey: string): void {
  const userName = this.users[userKey] || 'Usuário Desconhecido';
  this.currentUser.name = userName;
  this.userChange.emit(this.currentUser.name);

  console.log('User clicked:', userName);
  console.log('User Key clicked:', userKey); // Adicionado para depuração
  console.log('Initials:', this.getInitials(userName));

  // Modifique esta condição para verificar a chave diretamente
  if (userKey === 'SD_USER') { // <<-- ALTERADO AQUI
    console.log('Navigating to /clients (triggered by SD_USER)');
    this.router.navigate(['/clients']);
  }
}

  logout(): void {
    console.log('Usuário deslogado');
    this.isSidebarOpen = false;
    this.isExpanded = false;
    this.sidebarToggled.emit(this.isSidebarOpen);
    this.router.navigate(['/login']);
  }

  onOpenModalClick(event: MouseEvent): void {
    event.stopPropagation();
    this.openModalExternally.emit();
    this.isThreeDotsActive = !this.isThreeDotsActive;
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
      case 'home':
        return `<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>`;
      case 'search':
        return `<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>`;
      case 'bookmark':
        return `<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z"></path><path d="M17 21v-8H7v8"></path><path d="M7 3v4h10V3"></path>`;
      case 'clip':
        return `<path d="M4 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2"></path><path d="M10 22H8"></path><path d="M16 22h-2"></path><circle cx="8" cy="8" r="2"></circle><path d="M9.414 9.414 12 12"></path><path d="M14.8 14.8 18 18"></path><circle cx="8" cy="16" r="2"></circle><path d="m18 6-8.586 8.586"></path>`;
      case 'report':
        return `<path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3.5"></path><path d="M4.017 11.512a6 6 0 1 0 8.466 8.475"></path><path d="M9 16a1 1 0 0 1-1-1v-4c0-.552.45-1.008.995-.917a6 6 0 0 1 4.922 4.922c.091.544-.365.995-.917.995z"></path>`;
      case 'dashboard':
        return `<rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect>`;
      case 'settings':
        return `<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle>`;
      default:
        return '';
    }
  }
}