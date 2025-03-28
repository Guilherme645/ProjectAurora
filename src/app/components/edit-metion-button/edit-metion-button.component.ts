import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-edit-metion-button',
  templateUrl: './edit-metion-button.component.html',
  styleUrls: ['./edit-metion-button.component.css'],
  standalone: false
})
export class EditMetionButtonComponent  {

  @Output() editClicked = new EventEmitter<void>();

  onEditClick() {
    this.editClicked.emit();
  }
}
