import { Component, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CdkDropList,
  CdkDropListGroup,
  CdkDragDrop,
} from '@angular/cdk/drag-drop';
import { Column, Task } from '../../models';
import { ProjectService } from '../../services/project';
import { TimerService } from '../../services/timer';
import { TaskCardComponent } from '../../components/task-card/task-card';
import { AddColumnModalComponent } from '../../components/add-column-modal/add-column-modal';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [
    CdkDropListGroup,
    CdkDropList,
    TaskCardComponent,
    AddColumnModalComponent,
  ],
  templateUrl: './kanban-board.html',
  styleUrl: './kanban-board.css',
})
export class KanbanBoardComponent {
  private projectService = inject(ProjectService);
  private timerService = inject(TimerService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private projectId = computed(() =>
    this.route.snapshot.paramMap.get('projectId') ?? ''
  );

  project = computed(() =>
    this.projectService.getProject(this.projectId())
  );

  columnsWithTasks = computed(() => {
    const p = this.project();
    if (!p) return [];
    return [...p.columns]
      .sort((a, b) => a.order - b.order)
      .map(col => ({
        column: col,
        tasks: p.tasks.filter(t => t.columnId === col.id),
      }));
  });

  allColumns = computed(() => this.project()?.columns ?? []);

  completedColumnId = computed(
    () =>
      this.project()?.columns.find(c => c.id === 'col-completed')?.id ??
      'col-completed'
  );

  addingTaskInColumn = signal<string | null>(null);
  newTaskTitle = signal('');
  taskTitleError = signal('');
  showAddColumnModal = signal(false);
  pendingDeleteColumn = signal<Column | null>(null);
  migrateToColumnId = signal<string>('col-todo');

  migrationTargetColumns = computed(() => {
    const pending = this.pendingDeleteColumn();
    if (!pending) return [];
    return this.allColumns()
      .filter(c => c.id !== pending.id && c.id !== 'col-completed')
      .sort((a, b) => a.order - b.order);
  });

  goBack(): void {
    this.router.navigate(['/projects']);
  }
  onDrop(event: CdkDragDrop<Task[]>, toColumn: Column): void {
    if (event.previousContainer === event.container) return;

    const task = event.item.data as Task;
    const fromColumnId = event.previousContainer.id;

    const updatedTask = this.timerService.recordMove(task, fromColumnId, toColumn.id);
    this.projectService.moveTask(this.projectId(), updatedTask);
  }

  openAddTask(columnId: string): void {
    this.addingTaskInColumn.set(columnId);
    this.newTaskTitle.set('');
    this.taskTitleError.set('');
  }

  cancelAddTask(): void {
    this.addingTaskInColumn.set(null);
    this.newTaskTitle.set('');
    this.taskTitleError.set('');
  }

  onTaskTitleInput(event: Event): void {
    this.newTaskTitle.set((event.target as HTMLInputElement).value);
    if (this.taskTitleError()) this.taskTitleError.set('');
  }

  onTaskTitleKeydown(event: KeyboardEvent, columnId: string): void {
    if (event.key === 'Enter') this.confirmAddTask(columnId);
    if (event.key === 'Escape') this.cancelAddTask();
  }

  confirmAddTask(columnId: string): void {
    const trimmed = this.newTaskTitle().trim();
    if (!trimmed) {
      this.taskTitleError.set('Task title cannot be empty.');
      return;
    }
    this.projectService.addTask(this.projectId(), columnId, trimmed);
    this.cancelAddTask();
  }

  deleteTask(taskId: string): void {
    this.projectService.deleteTask(this.projectId(), taskId);
  }
  onColumnAdded(name: string): void {
    this.projectService.addColumn(this.projectId(), name);
    this.showAddColumnModal.set(false);
  }

  requestDeleteColumn(column: Column): void {
    const tasks = this.project()?.tasks.filter(t => t.columnId === column.id) ?? [];
    if (tasks.length === 0) {
      this.projectService.deleteColumn(this.projectId(), column.id);
    } else {
      this.migrateToColumnId.set('col-todo');
      this.pendingDeleteColumn.set(column);
    }
  }

  onMigrateTargetChange(event: Event): void {
    this.migrateToColumnId.set((event.target as HTMLSelectElement).value);
  }

  confirmDeleteColumn(): void {
    const col = this.pendingDeleteColumn();
    if (!col) return;
    this.projectService.deleteColumn(this.projectId(), col.id, this.migrateToColumnId());
    this.pendingDeleteColumn.set(null);
  }

  cancelDeleteColumn(): void {
    this.pendingDeleteColumn.set(null);
  }
}