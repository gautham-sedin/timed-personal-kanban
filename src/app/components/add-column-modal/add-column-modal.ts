import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-column-modal',
  standalone: true,
  template: `<p>Add column modal stub</p>`,
  styles: []
})
export class AddColumnModalComponent {
  @Output() columnAdded = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();
}