import { Routes } from '@angular/router';
import { onboardingGuard, reverseOnboardingGuard } from './guards/onboarding-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'projects',
        pathMatch: 'full',
    },
    {
        path: 'onboarding',
        canActivate: [reverseOnboardingGuard],
        loadComponent: () =>
            import('./pages/onboarding/onboarding').then(m => m.OnboardingComponent),
    },
    {
        path: 'projects',
        canActivate: [onboardingGuard],
        loadComponent: () =>
            import('./pages/project-list/project-list').then(m => m.ProjectListComponent),
    },
    {
        path: 'board/:projectId',
        canActivate: [onboardingGuard],
        loadComponent: () =>
            import('./pages/kanban-board/kanban-board').then(m => m.KanbanBoardComponent),
    },
    {
        path: '**',
        redirectTo: 'projects',
    },
];