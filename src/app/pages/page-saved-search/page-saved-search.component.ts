import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-saved-search',
  templateUrl: './page-saved-search.component.html',
  styleUrls: ['./page-saved-search.component.css'],
  standalone: false
})
export class PageSavedSearchComponent  {
  noticias: any[] = [];
  filteredNoticias: any[] = [];
  isMobile: boolean = false;
  isSidebarOpen: boolean = false;
  allSelected: boolean = false;
  currentUser: string = 'Superior Tribunal Federal';
  selectedTab: string = 'todos';
  selectedOption: string = 'Mais relevantes';
  isDropdownOpen: boolean = false;
  selectedMentionsCount: number = 0;
  showScrollTop: boolean = false;
  showScrollTopButton: boolean = false;
  isSearchOpen = false;
    page: number = 1;
  pageSize: number = 10;
  isLoading: boolean = false;
  hasMoreData: boolean = true;

  monitorCards = [
    {
      title: 'Executivo',
      startDate: '30/03/2024',
      endDate: '01/04/2024',
      status: 'Ativa'
    },
    {
      title: 'Executivo',
      startDate: '30/03/2024',
      endDate: '01/04/2024',
      status: 'Pendente'
    },
    {
      title: 'Entidades relevantes',
      startDate: '25/03/2024',
      endDate: '29/03/2024',
      status: 'Desativada'
    },
    {
      title: 'Executivo',
      startDate: '30/03/2024',
      endDate: '01/04/2024',
      status: 'Ativa'
    },
    {
      title: 'Executivo',
      startDate: '30/03/2024',
      endDate: '01/04/2024',
      status: 'Pendente'
    },
    {
      title: 'Entidades relevantes',
      startDate: '25/03/2024',
      endDate: '29/03/2024',
      status: 'Desativada'
    },
    {
      title: 'Executivo',
      startDate: '30/03/2024',
      endDate: '01/04/2024',
      status: 'Ativa'
    },
    {
      title: 'Executivo',
      startDate: '30/03/2024',
      endDate: '01/04/2024',
      status: 'Pendente'
    },
    {
      title: 'Entidades relevantes',
      startDate: '25/03/2024',
      endDate: '-',
      status: 'Desativada'
    },
    {
      title: 'Executivo',
      startDate: '30/03/2024',
      endDate: '01/04/2024',
      status: 'Ativa'
    },
    {
      title: 'Executivo',
      startDate: '30/03/2024',
      endDate: '-',
      status: 'Pendente'
    },
    {
      title: 'Entidades relevantes',
      startDate: '25/03/2024',
      endDate: '29/03/2024',
      status: 'Desativada'
    },
   
    // ...adicione mais se quiser
  ];
  
  onUserChange(user: string) {
    // this.currentUser = user;
    // this.page = 1;
    // this.noticias = [];
    // this.filteredNoticias = [];
    // this.hasMoreData = true;
    // this.loadNoticias();
  }

}
