import { Component, Output, EventEmitter, signal } from '@angular/core';
 
@Component({
  selector: 'app-add-column-modal',
  standalone: true,
  templateUrl: './add-column-modal.html',
  styleUrl: './add-column-modal.css',
})
export class AddColumnModalComponent {
  @Output() columnAdded = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();
 
  columnName = signal('');
  error = signal('');
 
  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.columnName.set(value);
    if (this.error()) this.error.set('');
  }
 
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.submit();
    if (event.key === 'Escape') this.cancelled.emit();
  }
 
  submit(): void {
    const trimmed = this.columnName().trim();
    if (!trimmed) {
      this.error.set('Column name cannot be empty.');
      return;
    }
    this.columnAdded.emit(trimmed);
    this.columnName.set('');
    this.error.set('');
  }
}