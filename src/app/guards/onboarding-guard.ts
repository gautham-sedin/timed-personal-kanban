import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ProjectService } from '../services/project';

export const onboardingGuard: CanActivateFn = () => {
  const projectService = inject(ProjectService);
  const router = inject(Router);

  if (!projectService.isOnboarded()) {
    router.navigate(['/onboarding']);
    return false;
  }
  return true;
};

export const reverseOnboardingGuard: CanActivateFn = () => {
  const projectService = inject(ProjectService);
  const router = inject(Router);

  if (projectService.isOnboarded()) {
    router.navigate(['/projects']);
    return false;
  }
  return true;
};