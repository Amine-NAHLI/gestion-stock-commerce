import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  // Route par défaut → redirige vers login
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Routes publiques
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
  },

  // Route protégée (nécessite d'être connecté)
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [authGuard]
  },

  // Route 404 → redirige vers login
  { path: '**', redirectTo: '/login' }
];