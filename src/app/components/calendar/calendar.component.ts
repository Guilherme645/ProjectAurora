import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  currentDate = new Date();
  currentMonth = new Date();
  days: Date[] = [];

  @Output() dateSelected = new EventEmitter<Date>();

  constructor() {
    this.generateCalendar();
  }

  generateCalendar(): void {
    const firstDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const lastDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
    
    this.days = [];
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      this.days.push(new Date(d));
    }
  }

  changeMonth(offset: number): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + offset, 1);
    this.generateCalendar();
  }

  isToday(day: Date): boolean {
    return day.toDateString() === this.currentDate.toDateString();
  }

  isFutureDate(day: Date): boolean {
    return day > this.currentDate;
  }

  isFutureMonth(): boolean {
    return this.currentMonth > this.currentDate;
  }

  isSelected(day: Date): boolean {
    return false; // Ajuste isso se precisar marcar datas selecionadas
  }

  selectDate(day: Date): void {
    if (!this.isFutureDate(day)) {
      this.dateSelected.emit(day);
    }
  }
}
