import { Component, EventEmitter, OnInit, Output, HostListener } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators'; // Import retry and catchError
import { DataService, MentionDetails } from 'src/app/services/data.service';

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

  noticia$: Observable<MentionDetails> | null = null;
  isScrolled = false;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadMentionDetails();
  }

  loadMentionDetails() {
    this.isLoading = true;
    this.errorMessage = null;

    // Add retry and error handling to the observable
    this.noticia$ = this.dataService.getMentionDetails().pipe(
      retry(2), // Retry the request up to 2 times if it fails
      catchError(error => {
        console.error('Erro ao carregar detalhes da menção:', error);
        this.errorMessage = 'Falha ao carregar os dados. Tente novamente mais tarde.';
        this.isLoading = false;
        return of({} as MentionDetails); // Fallback to empty object
      })
    );

    this.noticia$.subscribe({
      next: (data) => {
        console.log('Detalhes da menção carregados:', data); // Debug log
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro após tentativas de retry:', error); // Debug log
        this.errorMessage = 'Falha ao carregar os dados. Tente novamente mais tarde.';
        this.isLoading = false;
        this.noticia$ = of({} as MentionDetails); // Fallback to empty object
      }
    });
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