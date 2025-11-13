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
  },
  {
    path: 'terms-conditions',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'privacy-policy',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'accessibility-statement',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'sitemap',
    renderMode: RenderMode.Prerender
  }
];
