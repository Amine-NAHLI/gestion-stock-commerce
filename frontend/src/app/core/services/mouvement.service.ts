import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MouvementStock } from '../models/mouvement.model';

const API_URL = 'http://localhost:8080/api/mouvements';

@Injectable({
  providedIn: 'root'
})
export class MouvementService {
  private http = inject(HttpClient);
  private apiUrl = API_URL;

  getAllMouvements(): Observable<MouvementStock[]> {
    return this.http.get<MouvementStock[]>(this.apiUrl);
  }

  getMouvementsByProduit(produitId: number): Observable<MouvementStock[]> {
    return this.http.get<MouvementStock[]>(`${this.apiUrl}/produit/${produitId}`);
  }

  enregistrerMouvement(mouvement: MouvementStock): Observable<MouvementStock> {
    return this.http.post<MouvementStock>(this.apiUrl, mouvement);
  }
}
