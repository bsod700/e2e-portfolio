import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { legalPageResolver } from './resolvers/legal-page.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent),
    title: 'Guy Tagger | Full Stack Developer & UI/UX Designer'
  },
  {
    path: 'services',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'services/:id',
    loadComponent: () => import('./pages/services/service-detail/service-detail').then(m => m.ServiceDetailComponent),
    title: 'Service Details - Guy Tagger'
  },
  {
    path: 'projects',
    loadComponent: () => import('./pages/projects/projects-page/projects-page').then(m => m.ProjectsPageComponent),
    title: 'Projects & Case Studies - Guy Tagger'
  },
  {
    path: 'projects/tierro',
    loadComponent: () => import('./pages/projects/tierro-project/tierro-project').then(m => m.TierroProjectComponent),
    title: 'Tierro Project - Guy Tagger'
  },
  {
    path: 'projects/prompt-management',
    loadComponent: () => import('./pages/projects/prompt-management-project/prompt-management-project').then(m => m.PromptManagementProjectComponent),
    title: 'Prompt Management Project - Guy Tagger'
  },
  {
    path: 'projects/landerx',
    loadComponent: () => import('./pages/projects/landerx-project/landerx-project').then(m => m.LanderxProjectComponent),
    title: 'Landerx Project - Guy Tagger'
  },
  {
    path: 'projects/brush-along',
    loadComponent: () => import('./pages/projects/brush-along-project/brush-along-project').then(m => m.BrushAlongProjectComponent),
    title: 'Brush Along Project - Guy Tagger'
  },
  {
    path: 'terms-conditions',
    loadComponent: () => import('./pages/legal/terms-conditions-page/terms-conditions-page').then(m => m.TermsConditionsPageComponent),
    resolve: { legalContent: legalPageResolver },
    title: 'Terms & Conditions - Guy Tagger'
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./pages/legal/privacy-policy-page/privacy-policy-page').then(m => m.PrivacyPolicyPageComponent),
    resolve: { legalContent: legalPageResolver },
    title: 'Privacy Policy - Guy Tagger'
  },
  {
    path: 'accessibility-statement',
    loadComponent: () => import('./pages/legal/accessibility-statement-page/accessibility-statement-page').then(m => m.AccessibilityStatementPageComponent),
    resolve: { legalContent: legalPageResolver },
    title: 'Accessibility Statement - Guy Tagger'
  },
  {
    path: 'sitemap',
    loadComponent: () => import('./pages/sitemap-page/sitemap-page').then(m => m.SitemapPageComponent),
    title: 'Sitemap - Guy Tagger'
  },
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFoundPageComponent),
    title: 'Page Not Found - Guy Tagger'
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./pages/admin/admin-login/admin-login').then(m => m.AdminLoginComponent),
    title: 'Admin Login - Guy Tagger'
  },
  {
    path: 'admin/setup-password',
    loadComponent: () => import('./pages/admin/admin-setup-password/admin-setup-password').then(m => m.AdminSetupPasswordComponent),
    title: 'Set Password - Guy Tagger'
  },
  {
    path: 'admin/reset-password',
    loadComponent: () => import('./pages/admin/admin-setup-password/admin-setup-password').then(m => m.AdminSetupPasswordComponent),
    title: 'Reset Password - Guy Tagger'
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent),
    title: 'Admin Dashboard - Guy Tagger',
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '404',
    pathMatch: 'full'
  }
];
