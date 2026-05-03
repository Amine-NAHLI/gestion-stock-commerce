import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Categorie, Produit } from '../models/produit.model';

const API_URL = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  private http = inject(HttpClient);

  // Produits
  getAllProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${API_URL}/produits`);
  }

  getProduitById(id: number): Observable<Produit> {
    return this.http.get<Produit>(`${API_URL}/produits/${id}`);
  }

  getProduitByCode(code: string): Observable<Produit> {
    return this.http.get<Produit>(`${API_URL}/produits/code/${code}`);
  }

  createProduit(produit: Produit): Observable<Produit> {
    return this.http.post<Produit>(`${API_URL}/produits`, produit);
  }

  updateProduit(id: number, produit: Produit): Observable<Produit> {
    return this.http.put<Produit>(`${API_URL}/produits/${id}`, produit);
  }

  deleteProduit(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/produits/${id}`);
  }

  // Categories
  getAllCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${API_URL}/categories`);
  }

  getCategorieById(id: number): Observable<Categorie> {
    return this.http.get<Categorie>(`${API_URL}/categories/${id}`);
  }

  createCategorie(categorie: Categorie): Observable<Categorie> {
    return this.http.post<Categorie>(`${API_URL}/categories`, categorie);
  }

  updateCategorie(id: number, categorie: Categorie): Observable<Categorie> {
    return this.http.put<Categorie>(`${API_URL}/categories/${id}`, categorie);
  }

  deleteCategorie(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/categories/${id}`);
  }
}
