import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

/**
 * Guard qui protège les routes nécessitant une authentification
 * Si l'utilisateur n'est pas connecté, redirige vers /login
 */
export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.isLoggedIn()) {
    return true; // Autorisé
  }

  // Non connecté → redirection vers login
  router.navigate(['/login']);
  return false;
};