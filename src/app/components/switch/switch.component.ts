import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.css'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true,
    },
  ],
})
export class SwitchComponent implements ControlValueAccessor {
  @Input() value: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Output() valueChange = new EventEmitter<boolean>();

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: boolean): void {
    this.value = value || false;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  toggleValue(): void {
    if (!this.isDisabled) {
      const newValue = !this.value;
      this.value = newValue; // Atualiza o valor interno
      this.onChange(newValue); // Notifica o FormControl
      this.onTouched(); // Marca como tocado
      this.valueChange.emit(newValue); // Emite o evento para o componente pai
    }
  }
}