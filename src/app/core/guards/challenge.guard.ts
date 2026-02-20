import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StateService } from '../services/state.service';

export const challengeGuard: CanActivateFn = () => {
  const router = inject(Router);
  const state = inject(StateService);

  const attempt = state.getAttempt();

  if (!attempt) {
    return router.createUrlTree(['/']);
  }

  if (attempt.status === 'finished') {
    return router.createUrlTree(['/result']);
  }

  return true;
};