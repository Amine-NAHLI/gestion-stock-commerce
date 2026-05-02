import { Injectable } from '@angular/core';
import { JwtResponse } from '../models/auth.model';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

/**
 * Service de gestion du token JWT et des informations utilisateur
 * Utilise le localStorage du navigateur pour persister la session
 */
@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  /**
   * Sauvegarde le token JWT dans le localStorage
   */
  saveToken(token: string): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * Récupère le token JWT du localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Sauvegarde les informations de l'utilisateur connecté
   */
  saveUser(user: JwtResponse): void {
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  /**
   * Récupère les informations de l'utilisateur connecté
   */
  getUser(): JwtResponse | null {
    const user = localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  /**
   * Vérifie si un utilisateur est actuellement connecté
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Récupère le rôle de l'utilisateur connecté
   */
  getUserRole(): string | null {
    const user = this.getUser();
    return user ? user.role : null;
  }

  /**
   * Vérifie si l'utilisateur connecté a un rôle spécifique
   */
  hasRole(role: string): boolean {
    return this.getUserRole() === role;
  }

  /**
   * Déconnexion : supprime le token et les infos utilisateur
   */
  signOut(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}