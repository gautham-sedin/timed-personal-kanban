import { Component, Input } from '@angular/core';
import { Column, Task } from '../../models';

@Component({
  selector: 'app-column',
  standalone: true,
  template: `<p>Column stub</p>`,
  styles: []
})
export class ColumnComponent {
  @Input() column!: Column;
  @Input() tasks: Task[] = [];
  @Input() projectId!: string;
}