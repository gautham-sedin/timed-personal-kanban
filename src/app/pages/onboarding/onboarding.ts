import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.css',
})
export class OnboardingComponent {
  private projectService = inject(ProjectService);
  private router = inject(Router);

  name = signal('');
  error = signal('');

  onNameInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.name.set(value);
    if (this.error()) this.error.set('');
  }

  onSubmit(): void {
    const trimmed = this.name().trim();
    if (!trimmed) {
      this.error.set('Please enter your name to get started.');
      return;
    }
    this.projectService.setUserName(trimmed);
    this.router.navigate(['/projects']);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSubmit();
    }
  }
}