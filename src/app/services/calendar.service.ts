import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private calendarOpenSource = new Subject<void>();
  calendarOpen$ = this.calendarOpenSource.asObservable(); // Observável para escutar eventos de abertura

  openCalendar() {
    this.calendarOpenSource.next(); // Emite o evento para abrir o calendário
  }
}
