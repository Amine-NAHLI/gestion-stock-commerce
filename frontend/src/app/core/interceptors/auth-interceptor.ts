import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

/**
 * Intercepteur HTTP qui ajoute automatiquement le token JWT
 * dans le header Authorization de chaque requête
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();

  // Si on a un token, on l'ajoute au header Authorization
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  // Sinon, on laisse passer la requête telle quelle
  return next(req);
};