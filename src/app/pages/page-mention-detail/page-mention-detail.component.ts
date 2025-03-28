import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-mention-detail',
  templateUrl: './page-mention-detail.component.html',
  styleUrls: ['./page-mention-detail.component.css'],
  standalone: false
})
export class PageMentionDetailComponent  {
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


  onUserChange(user: string) {
    // this.currentUser = user;
    // this.page = 1;
    // this.noticias = [];
    // this.filteredNoticias = [];
    // this.hasMoreData = true;
    // this.loadNoticias();
  }


}
