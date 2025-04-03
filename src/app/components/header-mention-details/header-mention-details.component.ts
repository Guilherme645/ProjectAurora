import { Component, EventEmitter, OnInit, Output, HostListener } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-header-mention-details',
  templateUrl: './header-mention-details.component.html',
  styleUrls: ['./header-mention-details.component.css'],
  standalone: false
})
export class HeaderMentionDetailsComponent implements OnInit {
  @Output() backClicked = new EventEmitter<void>();
  @Output() editClicked = new EventEmitter<void>();
  @Output() shareClicked = new EventEmitter<void>();

  noticia$: Observable<any> | null = null;
  isScrolled = false;

  intervalo: string = '10:17:01 – 10:23:59';
  horario: string = '10:17';
  dataFixa: string = '07 de dezembro de 2024';

  constructor() {}

  ngOnInit() {
    const mockNoticia = {
      veiculo: 'Globo News',
      local: 'São Paulo, SP',
      sentimento: 'Neutro'
    };
    this.noticia$ = of(mockNoticia);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollTop > 100;
    console.log('Scroll detected, isScrolled:', this.isScrolled, 'scrollTop:', scrollTop); // Log para depuração
  }

  onBack() {
    this.backClicked.emit();
  }

  onEditMention() {
    this.editClicked.emit();
  }

  onShare() {
    this.shareClicked.emit();
  }
}