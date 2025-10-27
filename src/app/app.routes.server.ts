import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'about',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'services',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'projects',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'services/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => [
      { id: 'development' },
      { id: 'strategy' },
      { id: 'ai-automation' },
      { id: 'design' }
    ]
  }
];
