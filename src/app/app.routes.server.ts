import { RenderMode, ServerRoute } from '@angular/ssr';
 
export const serverRoutes: ServerRoute[] = [
  {
    // Dynamic board route with :projectId cannot be prerendered without params
    path: 'board/:projectId',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];