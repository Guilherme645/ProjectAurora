import { Component, EventEmitter, OnInit, Output, HostListener, Input } from '@angular/core';
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
  @Input() showEntitiesDrawer: boolean = false;
  isMobile: boolean = window.innerWidth <= 768;
  noticia$: Observable<MentionDetails> | null = null;
  isScrolled = false;
  isLoading = false;
  errorMessage: string | null = null;
  textoOriginal: string = ''; // Novo campo para o texto descritivo
  isPlayerMinimized: boolean = false; // Novo campo para controlar o player

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.checkScreenSize();
    this.loadMentionDetails();
    console.log('HeaderMentionDetailsComponent initialized, showEntitiesDrawer:', this.showEntitiesDrawer);
  }

  loadMentionDetails() {
    this.isLoading = true;
    this.errorMessage = null;

    this.noticia$ = this.dataService.getMentionDetails().pipe(
      retry(2),
      catchError(error => {
        console.error('Erro ao carregar detalhes da menção:', error);
        this.errorMessage = 'Falha ao carregar os dados. Tente novamente mais tarde.';
        this.isLoading = false;
        return of({
          veiculo: 'N/A',
          local: 'N/A',
          sentimento: 'N/A',
          titulo: 'N/A',
          horario: 'N/A',
          dataFixa: 'N/A',
          intervalo: 'N/A'
        } as MentionDetails);
      })
    );

    this.noticia$.subscribe({
      next: (data) => {
        console.log('Detalhes da menção carregados:', data);
        this.isLoading = false;
        console.log('After loading', {
          isLoading: this.isLoading,
          errorMessage: this.errorMessage,
          isScrolled: this.isScrolled,
          showEntitiesDrawer: this.showEntitiesDrawer
        });
      },
      error: (error) => {
        console.error('Erro após tentativas de retry:', error);
        this.errorMessage = 'Falha ao carregar os dados. Tente novamente mais tarde.';
        this.isLoading = false;
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollTop > 200;
    console.log('Scroll detected', {
      isScrolled: this.isScrolled,
      scrollTop,
      showEntitiesDrawer: this.showEntitiesDrawer,
      isLoading: this.isLoading,
      errorMessage: this.errorMessage
    });
  }

  onBack() {
    console.log('Back button clicked');
    this.backClicked.emit();
  }

  onEditMention() {
    console.log('Edit mention clicked');
    this.editClicked.emit();
  }

  onShare() {
    console.log('Share button clicked');
    this.shareClicked.emit();
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
    console.log('Screen size checked, isMobile:', this.isMobile);
  }

  @HostListener('window:resize', [])
  onResize(): void {
    this.checkScreenSize();
  }
}