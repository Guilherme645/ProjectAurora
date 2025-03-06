import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  currentDate: Date = new Date(); 
  today: Date = new Date(); 
  selectedDate: Date | null = null; 
  daysInMonth: number[] = [];
  firstDayOfMonth: number = 0;
  daysInPrevMonth: number[] = [];
  daysInNextMonth: number[] = [];
  monthNames: string[] = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  @Output() dateSelected = new EventEmitter<Date>(); 

  ngOnInit() {
    this.renderCalendar();
  }

  renderCalendar() {
    const month = this.currentDate.getMonth();
    const year = this.currentDate.getFullYear();
    this.firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    this.daysInMonth = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    this.daysInPrevMonth = Array.from({ length: this.firstDayOfMonth }, (_, i) => daysInPrevMonth - this.firstDayOfMonth + i + 1);
    const totalCells = this.firstDayOfMonth + daysInMonth;
    const remainingCells = (7 - (totalCells % 7)) % 7; 
    this.daysInNextMonth = Array.from({ length: remainingCells }, (_, i) => i + 1);
  }

  prevMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.renderCalendar();
  }

  nextMonth() {
    const nextMonthDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    if (nextMonthDate <= this.today) {
      this.currentDate = nextMonthDate;
      this.renderCalendar();
    }
  }

  getMonthYear(): string {
    return `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
  }

  isToday(day: number): boolean {
    return (
      day === this.today.getDate() &&
      this.currentDate.getMonth() === this.today.getMonth() &&
      this.currentDate.getFullYear() === this.today.getFullYear()
    );
  }

  isSelected(day: number): boolean {
    if (!this.selectedDate) return false;
    return (
      day === this.selectedDate.getDate() &&
      this.currentDate.getMonth() === this.selectedDate.getMonth() &&
      this.currentDate.getFullYear() === this.selectedDate.getFullYear()
    );
  }

  isSelectable(day: number): boolean {
    const dateToCheck = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
    return dateToCheck <= this.today;
  }

  selectDay(day: number) {
    if (this.isSelectable(day)) {
      const selected = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
      this.selectedDate = selected;
      this.dateSelected.emit(selected); 
    }
  }

  isFutureDate(day: number): boolean {
    const dateToCheck = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
    return dateToCheck > this.today;
  }
}
