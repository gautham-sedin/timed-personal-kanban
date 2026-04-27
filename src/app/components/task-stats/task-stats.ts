import { Component, Input } from '@angular/core';
import { Task, Column } from '../../models';

@Component({
  selector: 'app-task-stats',
  standalone: true,
  template: `<p>Task stats stub</p>`,
  styles: []
})
export class TaskStatsComponent {
  @Input() task!: Task;
  @Input() columns: Column[] = [];
}