import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent),
    title: 'Guy Tagger | Full Stack Developer & UI/UX Designer'
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about-page/about-page').then(m => m.AboutPageComponent),
    title: 'About Me - Guy Tagger | Full Stack Developer'
  }
];
