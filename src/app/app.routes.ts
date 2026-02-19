import { Routes } from '@angular/router';

export const routes: Routes = [
  // Default route
  { path: '', pathMatch: 'full', redirectTo: 'home' },

  // Pages
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'captcha',
    loadComponent: () =>
      import('./features/captcha/captcha.component').then(m => m.CaptchaComponent),
  },

  // Result must be protected (no direct access)
  {
    path: 'result',
    // canActivate: [captchaCompleteGuard],
    loadComponent: () =>
      import('./features/result/result.component').then(m => m.ResultComponent),
  },

  // 404 (always last)
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];
