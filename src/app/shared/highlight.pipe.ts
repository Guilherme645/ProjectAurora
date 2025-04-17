import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight',
  standalone: false // Use apenas se estiver usando Angular 15+ com standalone components
})
export class HighlightPipe implements PipeTransform {
  transform(text: string, search: string): string {
    if (!search || !text) return text;

    const pattern = search
      .replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') // escapa caracteres especiais
      .trim();
    const regex = new RegExp(pattern, 'gi');

    return text.replace(regex, (match) => `<mark class="bg-yellow-300">${match}</mark>`);
  }
}
