import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardStats } from '../models/dashboard.model';
import { API_BASE_URL } from './api.config';

const API_URL = `${API_BASE_URL}/dashboard`;

/**
 * Service pour récupérer les statistiques du dashboard
 */
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private http = inject(HttpClient);

  /**
   * Récupère les statistiques globales
   * Le token JWT est ajouté automatiquement par l'interceptor
   */
  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${API_URL}/stats`);
  }
}