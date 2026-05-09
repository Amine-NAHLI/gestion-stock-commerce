import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Fournisseur } from '../models/fournisseur.model';

const API_URL = 'http://localhost:8080/api';

/**
 * Service Angular pour la gestion des fournisseurs.
 * Communique avec le backend via les endpoints REST /api/fournisseurs.
 */
@Injectable({
  providedIn: 'root'
})
export class FournisseurService {

  private http = inject(HttpClient);

  /** Récupère tous les fournisseurs */
  getAllFournisseurs(): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(`${API_URL}/fournisseurs`);
  }

  /** Récupère un fournisseur par son ID */
  getFournisseurById(id: number): Observable<Fournisseur> {
    return this.http.get<Fournisseur>(`${API_URL}/fournisseurs/${id}`);
  }

  /** Recherche les fournisseurs par nom */
  searchFournisseurs(nom: string): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(`${API_URL}/fournisseurs/search?nom=${nom}`);
  }

  /** Crée un nouveau fournisseur */
  createFournisseur(fournisseur: Fournisseur): Observable<Fournisseur> {
    return this.http.post<Fournisseur>(`${API_URL}/fournisseurs`, fournisseur);
  }

  /** Met à jour un fournisseur existant */
  updateFournisseur(id: number, fournisseur: Fournisseur): Observable<Fournisseur> {
    return this.http.put<Fournisseur>(`${API_URL}/fournisseurs/${id}`, fournisseur);
  }

  /** Supprime un fournisseur */
  deleteFournisseur(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/fournisseurs/${id}`);
  }
}
