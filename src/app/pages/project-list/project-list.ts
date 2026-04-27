import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project';

@Component({
  selector: 'app-project-list',
  standalone: true,
  templateUrl: './project-list.html',
  styleUrl: './project-list.css',
})
export class ProjectListComponent {
  private projectService = inject(ProjectService);
  private router = inject(Router);

  // ─── State ────────────────────────────────────────────────────────────────
  projects = this.projectService.projects;
  userName = this.projectService.userName;

  newProjectName = signal('');
  showNewProjectForm = signal(false);
  nameError = signal('');

  // ─── Derived ──────────────────────────────────────────────────────────────
  sortedProjects = computed(() =>
    [...this.projects()].sort((a, b) => b.createdAt - a.createdAt)
  );

  // ─── Actions ──────────────────────────────────────────────────────────────
  openProject(id: string): void {
    this.router.navigate(['/board', id]);
  }

  toggleNewProjectForm(): void {
    this.showNewProjectForm.update(v => !v);
    this.newProjectName.set('');
    this.nameError.set('');
  }

  onProjectNameInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.newProjectName.set(value);
    if (this.nameError()) this.nameError.set('');
  }

  onProjectNameKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.createProject();
    if (event.key === 'Escape') this.toggleNewProjectForm();
  }

  createProject(): void {
    const trimmed = this.newProjectName().trim();
    if (!trimmed) {
      this.nameError.set('Project name cannot be empty.');
      return;
    }
    const project = this.projectService.createProject(trimmed);
    this.router.navigate(['/board', project.id]);
  }
}