import { Routes } from '@angular/router';
import { challengeGuard } from './core/guards/challenge.guard';
import { resultGuard } from './core/guards/result.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },

  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component').then(m => m.HomeComponent),

  },
  {
    path: 'captcha',
    loadComponent: () =>
      import('./features/captcha/captcha.component').then(m => m.CaptchaComponent),
    canActivate: [challengeGuard]
  },

  {
    path: 'result',
    canActivate: [resultGuard],
    loadComponent: () =>
      import('./features/result/result.component').then(m => m.ResultComponent),
  },

  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];
