import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TokenService } from '../../core/services/token.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[]; // Si défini, seuls ces rôles voient le lien
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {

  private tokenService = inject(TokenService);

  // Liste des liens du menu
  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'bi-speedometer2', route: '/dashboard' },
    { label: 'Produits', icon: 'bi-box-seam', route: '/produits' },
    { label: 'Catégories', icon: 'bi-tags', route: '/categories' },
    { label: 'Mouvements Stock', icon: 'bi-arrow-left-right', route: '/mouvements' },
    { label: 'Fournisseurs', icon: 'bi-truck', route: '/fournisseurs' },
    { label: 'Commandes', icon: 'bi-cart-check', route: '/commandes' },
    { label: 'Clients', icon: 'bi-people', route: '/clients' },
    { label: 'Ventes', icon: 'bi-receipt', route: '/ventes' },
    { label: 'Rapports', icon: 'bi-file-earmark-bar-graph', route: '/rapports' },
    { label: 'Utilisateurs', icon: 'bi-person-gear', route: '/utilisateurs', roles: ['ADMIN'] }
  ];

  /**
   * Filtre les éléments du menu selon le rôle de l'utilisateur
   */
  get visibleMenuItems(): MenuItem[] {
    const userRole = this.tokenService.getUserRole();
    return this.menuItems.filter(item => {
      if (!item.roles) return true; // Pas de restriction
      return userRole && item.roles.includes(userRole);
    });
  }
}