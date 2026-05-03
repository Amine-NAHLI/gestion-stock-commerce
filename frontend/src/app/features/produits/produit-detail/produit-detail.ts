import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProduitService } from '../../../core/services/produit.service';
import { Produit } from '../../../core/models/produit.model';

@Component({
  selector: 'app-produit-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-4" *ngIf="produit">
      <div class="d-flex align-items-center mb-4">
        <a routerLink="/produits" class="btn btn-outline-secondary btn-sm rounded-circle me-3">
          <i class="bi bi-arrow-left"></i>
        </a>
        <h2 class="fw-bold mb-0 text-primary">Détails du Produit</h2>
      </div>

      <div class="row g-4">
        <!-- Image et Infos Clés -->
        <div class="col-lg-4">
          <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
            <div class="bg-light p-5 d-flex align-items-center justify-content-center" style="min-height: 250px;">
              <img *ngIf="produit.image" [src]="produit.image" alt="" class="img-fluid rounded shadow-sm">
              <i *ngIf="!produit.image" class="bi bi-box-seam display-1 text-muted opacity-25"></i>
            </div>
            <div class="card-body">
              <h4 class="fw-bold mb-1">{{ produit.nom }}</h4>
              <p class="text-muted small mb-3">Code: <span class="badge bg-light text-dark">{{ produit.code }}</span></p>
              
              <div class="d-grid gap-2 mt-4">
                <a [routerLink]="['/produits/edit', produit.id]" class="btn btn-warning text-white fw-bold">
                  <i class="bi bi-pencil me-2"></i>Modifier le produit
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistiques et Détails -->
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm rounded-4 p-4 h-100">
            <div class="row g-4 mb-4">
              <div class="col-md-4">
                <div class="p-3 bg-light rounded-4">
                  <span class="text-muted small d-block mb-1">Prix de Vente</span>
                  <h3 class="fw-bold mb-0 text-success">{{ produit.prixVente | currency:'EUR' }}</h3>
                </div>
              </div>
              <div class="col-md-4">
                <div class="p-3 bg-light rounded-4">
                  <span class="text-muted small d-block mb-1">En Stock</span>
                  <h3 class="fw-bold mb-0" [class.text-danger]="produit.quantiteStock <= (produit.seuilAlerte || 10)">
                    {{ produit.quantiteStock }} <span class="fs-6 fw-normal text-muted">{{ produit.unite || 'pcs' }}</span>
                  </h3>
                </div>
              </div>
              <div class="col-md-4">
                <div class="p-3 bg-light rounded-4">
                  <span class="text-muted small d-block mb-1">Prix d'Achat</span>
                  <h3 class="fw-bold mb-0 text-primary">{{ produit.prixAchat | currency:'EUR' }}</h3>
                </div>
              </div>
            </div>

            <div class="row g-3">
              <div class="col-md-6">
                <p class="mb-1 text-muted small">Catégorie</p>
                <p class="fw-bold">{{ produit.categorieNom || 'Non classé' }}</p>
              </div>
              <div class="col-md-6">
                <p class="mb-1 text-muted small">Fournisseur</p>
                <p class="fw-bold">{{ produit.fournisseurNom || 'Aucun fournisseur principal' }}</p>
              </div>
              <div class="col-12 mt-3">
                <p class="mb-1 text-muted small">Description</p>
                <p class="text-secondary">{{ produit.description || 'Aucune description disponible.' }}</p>
              </div>
              <div class="col-md-6 mt-4">
                <p class="mb-1 text-muted small">Date de Création</p>
                <p class="small text-muted">{{ produit.dateCreation | date:'medium' }}</p>
              </div>
              <div class="col-md-6 mt-4">
                <p class="mb-1 text-muted small">Dernière Modification</p>
                <p class="small text-muted">{{ produit.dateModification | date:'medium' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProduitDetailComponent implements OnInit {
  private produitService = inject(ProduitService);
  private route = inject(ActivatedRoute);
  
  produit?: Produit;

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.produitService.getProduitById(id).subscribe(p => this.produit = p);
    }
  }
}
