import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Commande, CommandeRequest, StatutCommande } from '../models/commande.model';
import { API_BASE_URL } from './api.config';

const API_URL = API_BASE_URL;

/**
 * Service Angular pour la gestion des commandes fournisseurs.
 * Communique avec le backend via les endpoints REST /api/commandes.
 */
@Injectable({
  providedIn: 'root'
})
export class CommandeService {

  private http = inject(HttpClient);

  /** Récupère toutes les commandes */
  getAllCommandes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${API_URL}/commandes`);
  }

  /** Récupère une commande par son ID (avec ses lignes) */
  getCommandeById(id: number): Observable<Commande> {
    return this.http.get<Commande>(`${API_URL}/commandes/${id}`);
  }

  /** Récupère les commandes d'un fournisseur */
  getCommandesByFournisseur(fournisseurId: number): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${API_URL}/commandes/fournisseur/${fournisseurId}`);
  }

  /** Récupère les commandes par statut */
  getCommandesByStatut(statut: StatutCommande): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${API_URL}/commandes/statut/${statut}`);
  }

  /** Crée une nouvelle commande multi-lignes */
  createCommande(request: CommandeRequest): Observable<Commande> {
    return this.http.post<Commande>(`${API_URL}/commandes`, request);
  }

  /** Met à jour le statut d'une commande */
  updateStatut(id: number, statut: StatutCommande): Observable<Commande> {
    return this.http.put<Commande>(`${API_URL}/commandes/${id}/statut?statut=${statut}`, {});
  }

  /** Supprime une commande */
  deleteCommande(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/commandes/${id}`);
  }
}
