import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task, Column } from '../../models';

@Component({
  selector: 'app-task-card',
  standalone: true,
  template: `<p>Task card stub</p>`,
  styles: []
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Input() columns: Column[] = [];
  @Output() deleted = new EventEmitter<void>();
}