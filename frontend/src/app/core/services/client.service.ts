import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from '../models/client.model';
import { API_BASE_URL } from './api.config';

const API_URL = API_BASE_URL;

/**
 * Service Angular pour la gestion des clients.
 * Communique avec le backend via les endpoints REST /api/clients.
 */
@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private http = inject(HttpClient);

  /** Récupère tous les clients */
  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${API_URL}/clients`);
  }

  /** Récupère un client par son ID */
  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${API_URL}/clients/${id}`);
  }

  /** Recherche les clients par nom ou prénom */
  searchClients(query: string): Observable<Client[]> {
    return this.http.get<Client[]>(`${API_URL}/clients/search?q=${query}`);
  }

  /** Crée un nouveau client */
  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(`${API_URL}/clients`, client);
  }

  /** Met à jour un client existant */
  updateClient(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${API_URL}/clients/${id}`, client);
  }

  /** Supprime un client */
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/clients/${id}`);
  }
}
