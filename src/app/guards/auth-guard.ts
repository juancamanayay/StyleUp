import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

/**
 * Protege rutas que requieren sesión iniciada (ej. /dashboard).
 * Si el usuario no está autenticado, lo redirige automáticamente al Home.
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.estaAutenticado()) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
