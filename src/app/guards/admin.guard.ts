import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn() && auth.isAdmin()) {
    return true;
  }

  // Logged-in users without admin role are redirected to dashboard
  if (auth.isLoggedIn()) {
    return router.createUrlTree(['/dashboard']);
  }

  return router.createUrlTree(['/login']);
};
