import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Vente, VenteRequest } from '../models/vente.model';
import { API_BASE_URL } from './api.config';

const API_URL = API_BASE_URL;

/**
 * Service Angular pour la gestion des ventes (point de vente).
 * Communique avec le backend via les endpoints REST /api/ventes.
 */
@Injectable({
  providedIn: 'root'
})
export class VenteService {

  private http = inject(HttpClient);

  /** Récupère toutes les ventes */
  getAllVentes(): Observable<Vente[]> {
    return this.http.get<Vente[]>(`${API_URL}/ventes`);
  }

  /** Récupère une vente par son ID (avec ses lignes) */
  getVenteById(id: number): Observable<Vente> {
    return this.http.get<Vente>(`${API_URL}/ventes/${id}`);
  }

  /** Récupère les ventes d'un client */
  getVentesByClient(clientId: number): Observable<Vente[]> {
    return this.http.get<Vente[]>(`${API_URL}/ventes/client/${clientId}`);
  }

  /** Crée une nouvelle vente */
  createVente(request: VenteRequest): Observable<Vente> {
    return this.http.post<Vente>(`${API_URL}/ventes`, request);
  }

  /** Supprime une vente */
  deleteVente(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/ventes/${id}`);
  }
}
