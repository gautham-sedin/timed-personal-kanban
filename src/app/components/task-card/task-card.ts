import {
  Component,
  Input,
  Output,
  EventEmitter,
  computed,
  signal,
} from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { Task, Column } from '../../models';
import { TaskStatsComponent } from '../task-stats/task-stats';
 
@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CdkDrag, TaskStatsComponent],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css',
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Input() columns: Column[] = [];
  @Input() completedColumnId = 'col-completed';
  @Output() deleted = new EventEmitter<void>();
 
  /** True when the task lives in the Completed column */
  isCompleted = computed(() => this.task.columnId === this.completedColumnId);
 
  onDelete(event: MouseEvent): void {
    event.stopPropagation(); // don't trigger drag
    this.deleted.emit();
  }
}