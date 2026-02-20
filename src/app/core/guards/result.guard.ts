import { CanActivateFn, Router } from '@angular/router';
import { StateService } from '../services/state.service';
import { inject } from '@angular/core';

export const resultGuard: CanActivateFn = () => {
  const router = inject(Router);
  const state = inject(StateService);

  const attempt = state.getAttempt();

  if (!attempt) {
    return router.createUrlTree(['/']);
  }

  if (attempt.status === 'started') {
    return router.createUrlTree(['/captcha']);
  }

  return true;
};
