import { Component } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
  standalone: false
})
export class PlayerComponent {
  videoTitle = 'Análise: Mauro Cid preso novamente após PF...';
  videoDescription = 'Para a Polícia Federal (PF) o novo depoimento do ex-ajudante de ordens de Jair Bolsonaro (PL), Mauro Cid, é visto como um esclarecimento para preencher algumas lacunas. Contudo, chama a atenção o fato de que a decisão de ouvi-lo novamente ocorre após a entrevista do seu advogado ao Estúdio I, da GloboNews. Ele informou que o ex-presidente sabia do plano para executar o presidente Lula, o vice Alckmin e o ministro Alexandre de Moraes, do Supremo Tribunal Federal (STF) e, depois, recuou. A entrevista de Cézar Bittencourt foi esquisita. Quando ele disse que Bolsonaro sabia do plano de assassinato de autoridades, a conexão caiu e, nove minutos depois, o advogado retornou à entrevista e recuou do que havia afirmado.';
  videoThumbnail = 'https://via.placeholder.com/625x352'; // Substitua por uma URL real
}