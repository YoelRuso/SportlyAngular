import { Routes } from '@angular/router';

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
];
