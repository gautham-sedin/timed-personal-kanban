import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CdkDrag, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { Task, Column } from '../../models';
import { TaskStatsComponent } from '../task-stats/task-stats';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CdkDrag, CdkDragPlaceholder, TaskStatsComponent],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css',
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Input() columns: Column[] = [];
  @Input() completedColumnId = 'col-completed';
  @Output() deleted = new EventEmitter<void>();

  isCompleted = computed(() => this.task.columnId === this.completedColumnId);

  onDelete(event: MouseEvent): void {
    event.stopPropagation();
    this.deleted.emit();
  }
}