import { RenderMode, ServerRoute } from '@angular/ssr';
 
export const serverRoutes: ServerRoute[] = [
  {
    path: 'board/:projectId',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];