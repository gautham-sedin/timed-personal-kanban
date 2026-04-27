import { Injectable } from '@angular/core';
import { Task } from '../models';

@Injectable({ providedIn: 'root' })
export class TimerService {

  recordMove(task: Task, fromColumnId: string, toColumnId: string): Task {
    const now = Date.now();
    const updatedLog = { ...task.timeLog };

    const oldEntry = updatedLog[fromColumnId];
    if (oldEntry?.enteredAt !== null && oldEntry?.enteredAt !== undefined) {
      updatedLog[fromColumnId] = {
        totalMs: oldEntry.totalMs + (now - oldEntry.enteredAt),
        enteredAt: null,
      };
    }

    updatedLog[toColumnId] = {
      totalMs: updatedLog[toColumnId]?.totalMs ?? 0,
      enteredAt: now,
    };

    return { ...task, columnId: toColumnId, timeLog: updatedLog };
  }

  formatMs(ms: number): string {
    if (ms <= 0) return '0s';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  }

  getLiveMs(task: Task, columnId: string): number {
    const entry = task.timeLog[columnId];
    if (!entry) return 0;
    const live = entry.enteredAt ? Date.now() - entry.enteredAt : 0;
    return entry.totalMs + live;
  }
}