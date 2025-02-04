import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
  selector: 'app-tag-filter',
  templateUrl: './tag-filter.component.html',
  styleUrls: ['./tag-filter.component.css']
})
export class TagFilterComponent {
  entidades: any = {};  // Dados carregados do JSON

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadEntidades();
  }

  loadEntidades(): void {
    this.http.get<any>('assets/data.json').subscribe((data) => {
      this.entidades = data.entidades;
    });
  }
}