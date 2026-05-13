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
      // Modules d'Adnane
      {
        path: 'produits',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/produits/produit-list/produit-list').then(m => m.ProduitListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./features/produits/produit-form/produit-form').then(m => m.ProduitFormComponent)
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./features/produits/produit-form/produit-form').then(m => m.ProduitFormComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./features/produits/produit-detail/produit-detail').then(m => m.ProduitDetailComponent)
          }
        ]
      },
      {
        path: 'categories',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/categories/categorie-list/categorie-list').then(m => m.CategorieListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./features/categories/categorie-form/categorie-form').then(m => m.CategorieFormComponent)
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./features/categories/categorie-form/categorie-form').then(m => m.CategorieFormComponent)
          }
        ]
      },
      {
        path: 'mouvements',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/mouvements/mouvement-list/mouvement-list').then(m => m.MouvementListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./features/mouvements/mouvement-form/mouvement-form').then(m => m.MouvementFormComponent)
          }
        ]
      },
      // Modules de Kenza (Phase 3)
      {
        path: 'fournisseurs',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/fournisseurs/fournisseur-list/fournisseur-list').then(m => m.FournisseurListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./features/fournisseurs/fournisseur-form/fournisseur-form').then(m => m.FournisseurFormComponent)
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./features/fournisseurs/fournisseur-form/fournisseur-form').then(m => m.FournisseurFormComponent)
          }
        ]
      },
      {
        path: 'commandes',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/commandes/commande-list/commande-list').then(m => m.CommandeListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./features/commandes/commande-form/commande-form').then(m => m.CommandeFormComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./features/commandes/commande-detail/commande-detail').then(m => m.CommandeDetailComponent)
          }
        ]
      },
      {
        path: 'clients',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/clients/client-list/client-list').then(m => m.ClientListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./features/clients/client-form/client-form').then(m => m.ClientFormComponent)
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./features/clients/client-form/client-form').then(m => m.ClientFormComponent)
          }
        ]
      },
      {
        path: 'ventes',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/ventes/vente-list/vente-list').then(m => m.VenteListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./features/ventes/vente-form/vente-form').then(m => m.VenteFormComponent)
          },
          {
            path: 'recu/:id',
            loadComponent: () => import('./features/ventes/vente-recu/vente-recu').then(m => m.VenteRecuComponent)
          }
        ]
      },
      {
        path: 'rapports',
        loadComponent: () => import('./features/rapports/export-rapport/export-rapport').then(m => m.ExportRapportComponent)
      },
      {
        path: 'utilisateurs',
        loadComponent: () => import('./features/utilisateurs/utilisateur-list').then(m => m.UtilisateurListComponent)
      }
    ]
  },

  // Route 404 → redirige vers dashboard si connecté
  { path: '**', redirectTo: '/dashboard' }
];