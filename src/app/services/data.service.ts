import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private jsonUrl = 'assets/data.json'; // Caminho para o arquivo JSON

  constructor(private http: HttpClient) {}

  // Método para obter os dados do JSON
  getData(): Observable<any> {
    return this.http.get<any>(this.jsonUrl);
  }
}
