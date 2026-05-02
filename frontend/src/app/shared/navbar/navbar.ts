import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { TokenService } from '../../core/services/token.service';
import { JwtResponse } from '../../core/models/auth.model';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnInit {

  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  currentUser: JwtResponse | null = null;

  ngOnInit(): void {
    this.currentUser = this.tokenService.getUser();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /**
   * Récupère les initiales de l'utilisateur pour l'avatar
   */
  getUserInitials(): string {
    if (!this.currentUser) return '?';
    if (this.currentUser.nomComplet) {
      const parts = this.currentUser.nomComplet.trim().split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return parts[0].substring(0, 2).toUpperCase();
    }
    return this.currentUser.username.substring(0, 2).toUpperCase();
  }

  /**
   * Couleur du badge de rôle
   */
  getRoleBadgeClass(): string {
    if (!this.currentUser) return 'bg-secondary';
    switch (this.currentUser.role) {
      case 'ADMIN': return 'bg-danger';
      case 'GERANT': return 'bg-warning text-dark';
      case 'EMPLOYE': return 'bg-success';
      default: return 'bg-secondary';
    }
  }
}