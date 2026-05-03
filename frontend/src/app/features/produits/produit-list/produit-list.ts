import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProduitService } from '../../../core/services/produit.service';
import { Produit } from '../../../core/models/produit.model';

@Component({
  selector: 'app-produit-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold text-primary mb-0">📦 Gestion des Produits</h2>
        <a routerLink="new" class="btn btn-primary shadow-sm px-4">
          <i class="bi bi-plus-lg me-2"></i>Nouveau Produit
        </a>
      </div>

      <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light text-secondary small text-uppercase fw-semibold">
              <tr>
                <th class="ps-4">Produit</th>
                <th>Code</th>
                <th>Catégorie</th>
                <th>Prix Vente</th>
                <th>Stock</th>
                <th>Statut</th>
                <th class="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody class="border-top-0">
              <tr *ngFor="let p of produits" class="cursor-pointer">
                <td class="ps-4">
                  <div class="d-flex align-items-center">
                    <div class="bg-light rounded-3 p-2 me-3 d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
                      <img *ngIf="p.image" [src]="p.image" alt="" class="img-fluid rounded">
                      <i *ngIf="!p.image" class="bi bi-box-seam fs-4 text-muted"></i>
                    </div>
                    <div>
                      <h6 class="mb-0 fw-bold">{{ p.nom }}</h6>
                      <small class="text-muted text-truncate d-inline-block" style="max-width: 200px;">{{ p.description }}</small>
                    </div>
                  </div>
                </td>
                <td><code class="text-primary fw-medium">{{ p.code }}</code></td>
                <td>
                  <span class="badge bg-soft-info text-info rounded-pill px-3 py-2 fw-medium">
                    {{ p.categorieNom || 'N/A' }}
                  </span>
                </td>
                <td class="fw-bold">{{ p.prixVente | currency:'EUR' }}</td>
                <td class="fw-medium">{{ p.quantiteStock }} {{ p.unite || 'pcs' }}</td>
                <td>
                  <span *ngIf="p.quantiteStock > (p.seuilAlerte || 10)" class="badge bg-soft-success text-success rounded-pill px-3 py-2 fw-medium">En Stock</span>
                  <span *ngIf="p.quantiteStock <= (p.seuilAlerte || 10) && p.quantiteStock > 0" class="badge bg-soft-warning text-warning rounded-pill px-3 py-2 fw-medium">Stock Bas</span>
                  <span *ngIf="p.quantiteStock <= 0" class="badge bg-soft-danger text-danger rounded-pill px-3 py-2 fw-medium">Rupture</span>
                </td>
                <td class="text-end pe-4">
                  <div class="btn-group shadow-sm rounded-3 overflow-hidden">
                    <a [routerLink]="[p.id]" class="btn btn-white btn-sm px-3 border-end" title="Détails">
                      <i class="bi bi-eye text-primary"></i>
                    </a>
                    <a [routerLink]="['edit', p.id]" class="btn btn-white btn-sm px-3 border-end" title="Modifier">
                      <i class="bi bi-pencil text-warning"></i>
                    </a>
                    <button (click)="deleteProduit(p.id!)" class="btn btn-white btn-sm px-3" title="Supprimer">
                      <i class="bi bi-trash text-danger"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="produits.length === 0">
                <td colspan="7" class="text-center py-5">
                  <div class="text-muted">
                    <i class="bi bi-inbox fs-1 d-block mb-3 opacity-25"></i>
                    <p>Aucun produit trouvé. Commencez par en ajouter un !</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-soft-success { background-color: rgba(25, 135, 84, 0.1); }
    .bg-soft-warning { background-color: rgba(255, 193, 7, 0.1); }
    .bg-soft-danger { background-color: rgba(220, 53, 69, 0.1); }
    .bg-soft-info { background-color: rgba(13, 202, 240, 0.1); }
    .btn-white { background-color: #fff; color: #6c757d; }
    .btn-white:hover { background-color: #f8f9fa; color: #212529; }
    .cursor-pointer { cursor: pointer; }
  `]
})
export class ProduitListComponent implements OnInit {
  private produitService = inject(ProduitService);
  private cdr = inject(ChangeDetectorRef);
  produits: Produit[] = [];

  ngOnInit(): void {
    this.loadProduits();
  }

  loadProduits(): void {
    this.produitService.getAllProduits().subscribe({
      next: (data) => {
        this.produits = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Erreur lors du chargement des produits', err)
    });
  }

  deleteProduit(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.produitService.deleteProduit(id).subscribe({
        next: () => this.loadProduits(),
        error: (err) => console.error('Erreur lors de la suppression', err)
      });
    }
  }
}
