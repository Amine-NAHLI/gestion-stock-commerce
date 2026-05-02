import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  // Route par défaut → redirige vers login
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Routes publiques (sans layout)
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
  },

  // Routes protégées (avec layout principal)
  {
    path: '',
    loadComponent: () => import('./shared/main-layout/main-layout').then(m => m.MainLayout),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
      },
      // Modules d'Adnane (placeholders)
      {
        path: 'produits',
        loadComponent: () => import('./shared/coming-soon/coming-soon').then(m => m.ComingSoon)
      },
      {
        path: 'categories',
        loadComponent: () => import('./shared/coming-soon/coming-soon').then(m => m.ComingSoon)
      },
      {
        path: 'mouvements',
        loadComponent: () => import('./shared/coming-soon/coming-soon').then(m => m.ComingSoon)
      },
      // Modules de Kenza (placeholders)
      {
        path: 'fournisseurs',
        loadComponent: () => import('./shared/coming-soon/coming-soon').then(m => m.ComingSoon)
      },
      {
        path: 'commandes',
        loadComponent: () => import('./shared/coming-soon/coming-soon').then(m => m.ComingSoon)
      },
      {
        path: 'clients',
        loadComponent: () => import('./shared/coming-soon/coming-soon').then(m => m.ComingSoon)
      },
      {
        path: 'ventes',
        loadComponent: () => import('./shared/coming-soon/coming-soon').then(m => m.ComingSoon)
      },
      {
        path: 'rapports',
        loadComponent: () => import('./shared/coming-soon/coming-soon').then(m => m.ComingSoon)
      },
      {
        path: 'utilisateurs',
        loadComponent: () => import('./shared/coming-soon/coming-soon').then(m => m.ComingSoon)
      }
    ]
  },

  // Route 404 → redirige vers dashboard si connecté
  { path: '**', redirectTo: '/dashboard' }
];