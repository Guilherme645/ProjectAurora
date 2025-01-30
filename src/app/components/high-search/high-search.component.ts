import { Component } from '@angular/core';
import { DrawerService } from 'src/app/services/drawer.service';

@Component({
  selector: 'app-high-search',
  templateUrl: './high-search.component.html',
  styleUrls: ['./high-search.component.css'],
})
export class HighSearchComponent {
  isDrawerOpen = false;

  constructor(private drawerService: DrawerService) {}

  ngOnInit() {
    this.drawerService.drawerState$.subscribe((state) => {
      this.isDrawerOpen = state;
    });
  }

  closeDrawer() {
    this.drawerService.closeDrawer();
  }
}
