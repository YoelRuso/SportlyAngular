import { Routes } from '@angular/router';

// @ts-ignore
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./sports/pages/home-page/home-page'),
  },
  {
    path: 'resume',
    loadComponent: () => import('./sports/pages/resume-page/resume-page'),
  },
  {
    path: 'schedule',
    loadComponent: () => import('./sports/pages/schedule-page/schedule-page'),
  },
  {
    path: 'legal',
    loadComponent: () => import('./sports/pages/legal-page/legal-page'),
  },
  {
    path: 'contact',
    loadComponent: () => import('./sports/pages/contact-page/contact-page'),
  },
];
