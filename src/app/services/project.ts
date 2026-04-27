import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { Project, Task, Column, DEFAULT_COLUMNS, STORAGE_KEYS } from '../models';
import { StorageService } from './storage';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private storage = inject(StorageService);

  projects = signal<Project[]>([]);
  userName = signal<string | null>(null);

  isOnboarded = computed(() => !!this.userName());

  constructor() {
    const savedProjects = this.storage.load<Project[]>(STORAGE_KEYS.PROJECTS);
    const savedName = this.storage.load<string>(STORAGE_KEYS.USER_NAME);

    if (savedProjects) this.projects.set(savedProjects);
    if (savedName) this.userName.set(savedName);

    effect(() => {
      this.storage.save(STORAGE_KEYS.PROJECTS, this.projects());
    });
    effect(() => {
      if (this.userName()) {
        this.storage.save(STORAGE_KEYS.USER_NAME, this.userName());
      }
    });
  }

  setUserName(name: string): void {
    this.userName.set(name.trim());
  }

  createProject(name: string): Project {
    const project: Project = {
      id: crypto.randomUUID(),
      name: name.trim(),
      columns: DEFAULT_COLUMNS.map(c => ({ ...c })),
      tasks: [],
      createdAt: Date.now(),
    };
    this.projects.update(list => [...list, project]);
    return project;
  }

  getProject(id: string): Project | undefined {
    return this.projects().find(p => p.id === id);
  }

  addTask(projectId: string, columnId: string, title: string): void {
    const task: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      columnId,
      createdAt: Date.now(),
      timeLog: {
        [columnId]: { totalMs: 0, enteredAt: Date.now() }
      },
    };
    this._updateProject(projectId, p => ({
      ...p,
      tasks: [...p.tasks, task],
    }));
  }

  deleteTask(projectId: string, taskId: string): void {
    this._updateProject(projectId, p => ({
      ...p,
      tasks: p.tasks.filter(t => t.id !== taskId),
    }));
  }

  moveTask(projectId: string, updatedTask: Task): void {
    this._updateProject(projectId, p => ({
      ...p,
      tasks: p.tasks.map(t => t.id === updatedTask.id ? updatedTask : t),
    }));
  }

  addColumn(projectId: string, name: string): void {
    this._updateProject(projectId, p => {
      const maxOrder = Math.max(...p.columns.map(c => c.order), 0);
      const completedOrder = p.columns.find(c => c.name === 'Completed')?.order ?? maxOrder;
      const newCol: Column = {
        id: crypto.randomUUID(),
        name: name.trim(),
        order: completedOrder,
        locked: false,
      };
      const updatedColumns = p.columns.map(c =>
        c.order >= completedOrder ? { ...c, order: c.order + 1 } : c
      );
      return { ...p, columns: [...updatedColumns, newCol] };
    });
  }

  deleteColumn(projectId: string, columnId: string, targetColumnId?: string): void {
    const project = this.getProject(projectId);
    if (!project) return;

    const col = project.columns.find(c => c.id === columnId);
    if (!col || col.locked) return;

    const fallback = project.columns.find(c => c.id === 'col-todo');
    const target = project.columns.find(c => c.id === (targetColumnId ?? 'col-todo'))
      ?? fallback;
    if (!target) return;

    this._updateProject(projectId, p => ({
      ...p,
      columns: p.columns.filter(c => c.id !== columnId),
      tasks: p.tasks.map(t =>
        t.columnId === columnId ? { ...t, columnId: target.id } : t
      ),
    }));
  }

  private _updateProject(projectId: string, updater: (p: Project) => Project): void {
    this.projects.update(list =>
      list.map(p => p.id === projectId ? updater(p) : p)
    );
  }
}