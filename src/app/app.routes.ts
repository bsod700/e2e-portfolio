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
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services-page/services-page').then(m => m.ServicesPageComponent),
    title: 'Our Services - Guy Tagger | Full Stack Developer'
  },
  {
    path: 'services/:id',
    loadComponent: () => import('./pages/service-detail/service-detail').then(m => m.ServiceDetailComponent),
    title: 'Service Details - Guy Tagger'
  },
  {
    path: 'projects',
    loadComponent: () => import('./pages/projects-page/projects-page').then(m => m.ProjectsPageComponent),
    title: 'Projects & Case Studies - Guy Tagger'
  }
];
