import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
    selector: 'app-side-bar',
    templateUrl: './side-bar.component.html',
    styleUrls: ['./side-bar.component.css'],
    standalone: false
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
  users: { [key: string]: string } = {}; 
  @Output() userChange = new EventEmitter<string>();
  @Output() sidebarToggled = new EventEmitter<boolean>();

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadUsers();
  }

  get userKeys(): string[] {
    return Object.keys(this.users);
  }

  getInitials(fullName: string): string {
    return fullName
      .split(' ')
      .map(word => word[0]) 
      .join('') 
      .toUpperCase(); 
  }

  private loadUsers(): void {
    this.dataService.getUsers().subscribe(
      (data) => this.users = data,
      (error) => console.error('Erro ao carregar usuários:', error)
    );
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.sidebarToggled.emit(this.isSidebarOpen); 
  }
  toggleModal(): void {
    this.isModalVisible = !this.isModalVisible;
  }

  @HostListener('window:resize')
  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  changeUser(userKey: string): void {
    this.currentUser.name = this.users[userKey] || 'Usuário Desconhecido';
    this.userChange.emit(this.currentUser.name); 
  }
  
  logout() {
    console.log('Usuário deslogado');
    this.isSidebarOpen = false;
    this.router.navigate(['/login']);
  }
}