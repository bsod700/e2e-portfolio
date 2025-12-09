import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
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
    path: 'projects/tierro',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'projects/prompt-management',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'projects/landerx',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'projects/brush-along',
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
    renderMode: RenderMode.Server
  },
  {
    path: 'privacy-policy',
    renderMode: RenderMode.Server
  },
  {
    path: 'accessibility-statement',
    renderMode: RenderMode.Server
  },
  {
    path: 'sitemap',
    renderMode: RenderMode.Prerender
  },
  {
    path: '404',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'admin/login',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/setup-password',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/reset-password',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
