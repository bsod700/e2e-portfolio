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
  },
  {
    path: 'terms-conditions',
    loadComponent: () => import('./pages/terms-conditions-page/terms-conditions-page').then(m => m.TermsConditionsPageComponent),
    title: 'Terms & Conditions - Guy Tagger'
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./pages/privacy-policy-page/privacy-policy-page').then(m => m.PrivacyPolicyPageComponent),
    title: 'Privacy Policy - Guy Tagger'
  },
  {
    path: 'accessibility-statement',
    loadComponent: () => import('./pages/accessibility-statement-page/accessibility-statement-page').then(m => m.AccessibilityStatementPageComponent),
    title: 'Accessibility Statement - Guy Tagger'
  },
  {
    path: 'sitemap',
    loadComponent: () => import('./pages/sitemap-page/sitemap-page').then(m => m.SitemapPageComponent),
    title: 'Sitemap - Guy Tagger'
  }
];
