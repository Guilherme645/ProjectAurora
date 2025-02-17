import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  currentMonth: Date = new Date();
  selectedDate: Date | null = null;
  days: Date[] = [];

  // Evento para emitir a data selecionada
  @Output() dateSelected = new EventEmitter<Date>();

  constructor() {
    this.generateCalendar();
  }

  changeMonth(delta: number) {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + delta);
    this.currentMonth = new Date(this.currentMonth); // Atualiza a referência
    this.generateCalendar();
  }

  generateCalendar() {
    const firstDayOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);

    this.days = [];

    // Preenche os dias em branco antes do primeiro dia do mês
    for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
      this.days.push(null as any);
    }

    // Preenche os dias do mês
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      this.days.push(new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), i));
    }
  }

  isToday(date: Date): boolean {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  isSelected(date: Date): boolean {
    if (!this.selectedDate || !date) return false;
    return date.getTime() === this.selectedDate.getTime();
  }

  selectDate(date: Date) {
    this.selectedDate = date;
    this.dateSelected.emit(date); // Emite o evento para o componente pai
  }
}
