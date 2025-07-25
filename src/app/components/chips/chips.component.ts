import { Component, Input, OnInit } from '@angular/core';
export type ChipColor = 'gray' | 'green' | 'blue' | 'red' | 'yellow';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.css'],
  standalone: false
})
export class ChipsComponent implements OnInit {

  /**
   * O texto a ser exibido dentro do chip.
   * Ex: <app-chip label="Pendente"></app-chip>
   */
  @Input() label: string = 'Badge';

  /**
   * Define o esquema de cores do chip.
   * Opções: 'gray', 'green', 'blue', 'red', 'yellow'.
   * O valor padrão é 'gray'.
   * Ex: <app-chip color="red"></app-chip>
   */
  @Input() color: ChipColor = 'gray';

  // Propriedade que irá armazenar as classes CSS dinâmicas para o template
  public colorClasses: string = '';

  // Mapeamento das cores para as classes do Tailwind CSS
  private colorMap = {
    gray:   'bg-gray-100 text-gray-800',
    green:  'bg-teal-100 text-teal-800', // Usei teal para corresponder à cor da imagem
    blue:   'bg-blue-100 text-blue-800',
    red:    'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800'
  };

  // O método ngOnInit é um "gancho de ciclo de vida" que roda quando o componente é inicializado.
  ngOnInit(): void {
    // Atribui as classes corretas com base na cor fornecida via @Input.
    // Se uma cor inválida for passada, ele usará 'gray' como padrão.
    this.colorClasses = this.colorMap[this.color] || this.colorMap.gray;
  }
}