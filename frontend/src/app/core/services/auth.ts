import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { JwtResponse, LoginRequest, MessageResponse, RegisterRequest } from '../models/auth.model';
import { TokenService } from './token.service';

const API_URL = 'http://localhost:8080/api/auth';

/**
 * Service d'authentification
 * Communique avec le backend Spring Boot
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

  /**
   * Connexion d'un utilisateur
   * Sauvegarde automatiquement le token et les infos user
   */
  login(credentials: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${API_URL}/login`, credentials).pipe(
      tap(response => {
        // Sauvegarder le token et les infos utilisateur
        this.tokenService.saveToken(response.token);
        this.tokenService.saveUser(response);
      })
    );
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  register(data: RegisterRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${API_URL}/register`, data);
  }

  /**
   * Déconnexion
   */
  logout(): void {
    this.tokenService.signOut();
  }

  /**
   * Vérifie si l'utilisateur est connecté
   */
  isAuthenticated(): boolean {
    return this.tokenService.isLoggedIn();
  }
}