import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

const EXAMUSER_BLOCKED = ['/dashboard', '/learn'];

export const authGuard: CanActivateFn = (_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  if (auth.getRole() === 'examuser' && EXAMUSER_BLOCKED.some(p => state.url.startsWith(p))) {
    return router.createUrlTree(['/exam/my-exams']);
  }

  return true;
};
