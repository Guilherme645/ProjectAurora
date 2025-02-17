import { Component, HostListener } from '@angular/core';
import { DrawerService } from 'src/app/services/drawer.service';
import { CalendarService } from 'src/app/services/calendar.service'; // Serviço para comunicação entre componentes

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css'],
})
export class BuscarComponent {
  searchQuery: string = '';
  isMobile = window.innerWidth <= 768;
  isAdvancedSearchOpen = false;
  isDrawerOpen = true;
  isCalendarOpen = false;

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth();
  selectedDateRange: Date[] = []; // Armazena o intervalo de datas selecionado
  daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  calendarDates: Date[] = [];
  monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth <= 768;
  }

  constructor(
    private drawerService: DrawerService,
    private calendarService: CalendarService // Serviço para escutar eventos de abertura do calendário
  ) {}

  ngOnInit() {
    this.drawerService.drawerState$.subscribe((state) => {
      this.isDrawerOpen = state;
    });

    this.calendarService.calendarOpen$.subscribe(() => {
      console.log('Evento recebido para abrir o calendário.');
      this.openCalendarInDrawer();
    });

    this.generateCalendar();
  }

  // Abertura e Fechamento do Drawer e do Calendário
  openAdvancedSearch() {
    this.isDrawerOpen = true;
    console.log('Drawer aberto.');
  }

  closeDrawer() {
    this.isDrawerOpen = false;
    this.isCalendarOpen = false;
  }

  toggleCalendar() {
    this.isCalendarOpen = !this.isCalendarOpen;
    console.log('isCalendarOpen:', this.isCalendarOpen);
  }

  openCalendar() {
    this.isCalendarOpen = true;
  }

  closeCalendar() {
    this.isCalendarOpen = false;
  }

  openCalendarInDrawer() {
    this.isDrawerOpen = true;
    this.isCalendarOpen = true;
    console.log('Abrindo calendário no drawer.');
  }

  onSearch(): void {
    console.log('Buscando por:', this.searchQuery);
  }

  onCalendarRequested() {
    console.log('Evento recebido no BuscarComponent.');
    this.isCalendarOpen = true;
    console.log('isCalendarOpen:', this.isCalendarOpen);
  }

  // Funções para Gerar e Navegar no Calendário
  generateCalendar() {
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    this.calendarDates = [];

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      this.calendarDates.push(new Date(this.currentYear, this.currentMonth, 1 - i));
    }
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      this.calendarDates.push(new Date(this.currentYear, this.currentMonth, i));
    }
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  isCurrentDate(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  selectDate(date: Date) {
    console.log('Data selecionada:', date);
    this.selectedDateRange = [date]; // Atualiza a data selecionada
  }
}
