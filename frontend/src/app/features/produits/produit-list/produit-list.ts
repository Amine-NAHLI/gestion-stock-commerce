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
      <div class="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h1 class="display-font text-dark mb-1">Inventaire des Produits</h1>
          <p class="text-secondary mb-0">Gérez vos articles, suivez les stocks et les prix en temps réel.</p>
        </div>
        <a routerLink="new" class="btn btn-primary shadow-sm px-4 py-2">
          <i class="bi bi-plus-lg"></i>
          <span>Nouveau Produit</span>
        </a>
      </div>

      <div class="card-premium overflow-hidden border-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light text-secondary small text-uppercase fw-bold letter-spacing-1">
              <tr>
                <th class="ps-4 py-3">Produit</th>
                <th>Référence</th>
                <th>Catégorie</th>
                <th>Prix Vente</th>
                <th>Stock Actuel</th>
                <th>Statut</th>
                <th class="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody class="border-top-0">
              <tr *ngFor="let p of produits" class="transition-all">
                <td class="ps-4">
                  <div class="d-flex align-items-center py-2">
                    <div class="bg-light rounded-4 p-1 me-3 d-flex align-items-center justify-content-center shadow-sm" style="width: 52px; height: 52px; overflow: hidden;">
                      <img *ngIf="p.image" [src]="p.image" alt="" class="img-fluid rounded-3">
                      <i *ngIf="!p.image" class="bi bi-box-seam fs-4 text-secondary opacity-50"></i>
                    </div>
                    <div>
                      <div class="fw-bold text-dark fs-6">{{ p.nom }}</div>
                      <div class="text-secondary small text-truncate" style="max-width: 250px;">{{ p.description || 'Aucune description' }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge bg-light text-primary fw-bold px-3 py-2 rounded-3 border">
                    {{ p.code }}
                  </span>
                </td>
                <td>
                  <span class="text-dark fw-medium">
                    <i class="bi bi-tag-fill me-1 text-primary opacity-50"></i>
                    {{ p.categorieNom || 'Non classé' }}
                  </span>
                </td>
                <td>
                  <div class="fw-bold text-dark fs-6">{{ p.prixVente | currency:'EUR' }}</div>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="fw-bold me-2">{{ p.quantiteStock }}</div>
                    <span class="text-secondary small fw-medium">{{ p.unite || 'unités' }}</span>
                  </div>
                </td>
                <td>
                  <span *ngIf="p.quantiteStock > (p.seuilAlerte || 10)" class="badge-status status-success">
                    <span class="dot"></span> En Stock
                  </span>
                  <span *ngIf="p.quantiteStock <= (p.seuilAlerte || 10) && p.quantiteStock > 0" class="badge-status status-warning">
                    <span class="dot"></span> Stock Bas
                  </span>
                  <span *ngIf="p.quantiteStock <= 0" class="badge-status status-danger">
                    <span class="dot"></span> Rupture
                  </span>
                </td>
                <td class="text-end pe-4">
                  <div class="d-flex justify-content-end gap-2">
                    <a [routerLink]="[p.id]" class="btn-action action-view" title="Voir les détails">
                      <i class="bi bi-eye-fill"></i>
                    </a>
                    <a [routerLink]="['edit', p.id]" class="btn-action action-edit" title="Modifier">
                      <i class="bi bi-pencil-square"></i>
                    </a>
                    <button (click)="deleteProduit(p.id!)" class="btn-action action-delete" title="Supprimer">
                      <i class="bi bi-trash3-fill"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="produits.length === 0">
                <td colspan="7" class="text-center py-5">
                  <div class="py-5">
                    <i class="bi bi-archive-fill display-1 text-light mb-4 d-block"></i>
                    <h4 class="text-secondary">Votre inventaire est vide</h4>
                    <p class="text-muted">Commencez par ajouter votre premier produit pour suivre vos stocks.</p>
                    <a routerLink="new" class="btn btn-primary mt-3 px-4">
                      <i class="bi bi-plus-lg"></i> Ajouter un produit
                    </a>
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
    .letter-spacing-1 { letter-spacing: 0.05em; }
    
    .badge-status {
      display: inline-flex;
      align-items: center;
      padding: 0.4rem 0.8rem;
      border-radius: 2rem;
      font-size: 0.75rem;
      font-weight: 700;
      gap: 0.5rem;
      
      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
      }
      
      &.status-success {
        background: #ecfdf5;
        color: #059669;
        .dot { background: #059669; box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.2); }
      }
      &.status-warning {
        background: #fffbeb;
        color: #d97706;
        .dot { background: #d97706; box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.2); }
      }
      &.status-danger {
        background: #fef2f2;
        color: #dc2626;
        .dot { background: #dc2626; box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.2); }
      }
    }

    .btn-action {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #f1f5f9;
      background: white;
      color: #64748b;
      transition: all 0.2s;
      text-decoration: none;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
      }
      
      &.action-view:hover { color: var(--primary); border-color: var(--primary); background: #eef2ff; }
      &.action-edit:hover { color: #d97706; border-color: #fef3c7; background: #fffbeb; }
      &.action-delete:hover { color: #dc2626; border-color: #fee2e2; background: #fef2f2; }
    }
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
