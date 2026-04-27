import { Component, Input, computed, inject } from '@angular/core';
import { Task, Column } from '../../models';
import { TimerService } from '../../services/timer';

@Component({
  selector: 'app-task-stats',
  standalone: true,
  templateUrl: './task-stats.html',
  styleUrl: './task-stats.css',
})
export class TaskStatsComponent {
  @Input() task!: Task;
  @Input() columns: Column[] = [];

  private timer = inject(TimerService);

  /**
   * Returns only columns that the task actually spent time in,
   * ordered by column order, with the formatted time.
   */
  entries = computed(() =>
    this.columns
      .filter(c => (this.task.timeLog[c.id]?.totalMs ?? 0) > 0)
      .sort((a, b) => a.order - b.order)
      .map(c => ({
        columnName: c.name,
        formatted: this.timer.formatMs(this.task.timeLog[c.id].totalMs),
      }))
  );
}