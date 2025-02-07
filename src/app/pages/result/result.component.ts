import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent {
  noticias: any[] = []; // Armazena o array de notícias

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getData().subscribe(
      (data) => {
        this.noticias = data.noticias; // Certifique-se de usar a chave correta do JSON
      },
      (error) => console.error('Erro ao carregar os dados:', error)
    );
  }
}
