import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlightPipe } from './highlight.pipe'; // ajuste o caminho conforme seu projeto

@NgModule({
  declarations: [HighlightPipe],
  imports: [CommonModule],
  exports: [HighlightPipe] // importante: exporta o pipe para outros módulos
})
export class SharedModule {}
