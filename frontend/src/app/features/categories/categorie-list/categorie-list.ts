import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProduitService } from '../../../core/services/produit.service';
import { Categorie } from '../../../core/models/produit.model';

@Component({
  selector: 'app-categorie-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h1 class="display-font text-dark mb-1">Catégories d'Articles</h1>
          <p class="text-secondary mb-0">Organisez votre catalogue par secteurs et familles de produits.</p>
        </div>
        <a routerLink="new" class="btn btn-primary shadow-sm px-4 py-2">
          <i class="bi bi-plus-lg"></i>
          <span>Nouvelle Catégorie</span>
        </a>
      </div>

      <div class="row g-4">
        <div class="col-md-6 col-lg-4" *ngFor="let cat of categories">
          <div class="card-premium h-100 overflow-hidden border-0">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-4">
                <div class="category-icon-box">
                  <i class="bi bi-folder2-open"></i>
                </div>
                <div class="d-flex gap-2">
                  <a [routerLink]="['edit', cat.id]" class="btn-action action-edit-small" title="Modifier">
                    <i class="bi bi-pencil-square"></i>
                  </a>
                  <button (click)="deleteCategorie(cat.id!)" class="btn-action action-delete-small" title="Supprimer">
                    <i class="bi bi-trash3-fill"></i>
                  </button>
                </div>
              </div>
              
              <h4 class="display-font text-dark mb-2">{{ cat.nom }}</h4>
              <p class="text-secondary small mb-4 line-clamp-2" style="min-height: 3rem;">
                {{ cat.description || 'Aucune description fournie pour cette catégorie.' }}
              </p>
              
              <div class="d-flex justify-content-between align-items-center pt-4 border-top border-light">
                <div class="d-flex flex-column">
                  <span class="text-secondary x-small text-uppercase fw-bold opacity-50">Création</span>
                  <span class="text-dark small fw-medium">{{ cat.dateCreation | date:'longDate' }}</span>
                </div>
                <a [routerLink]="['/produits']" [queryParams]="{categorie: cat.id}" class="btn btn-light btn-sm rounded-pill px-4 fw-bold">
                  Explorer
                </a>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="categories.length === 0" class="col-12 text-center py-5">
          <div class="py-5">
            <i class="bi bi-folder-x display-1 text-light mb-4 d-block"></i>
            <h4 class="text-secondary">Aucune catégorie</h4>
            <p class="text-muted">Structurez votre inventaire en créant des catégories pertinentes.</p>
            <a routerLink="new" class="btn btn-primary mt-3 px-4">
              <i class="bi bi-plus-lg"></i> Créer une catégorie
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .category-icon-box {
      width: 56px;
      height: 56px;
      background: #eef2ff;
      color: var(--primary);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.75rem;
    }
    
    .x-small { font-size: 0.65rem; }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .btn-action {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #f1f5f9;
      background: white;
      color: #94a3b8;
      transition: all 0.2s;
      text-decoration: none;
      
      i { font-size: 1rem; }
      &:hover { transform: scale(1.1); }
      &.action-edit-small:hover { color: #d97706; border-color: #fef3c7; background: #fffbeb; }
      &.action-delete-small:hover { color: #dc2626; border-color: #fee2e2; background: #fef2f2; }
    }
  `]
})
export class CategorieListComponent implements OnInit {
  private produitService = inject(ProduitService);
  private cdr = inject(ChangeDetectorRef);
  categories: Categorie[] = [];

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.produitService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Erreur chargement catégories', err)
    });
  }

  deleteCategorie(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ? Cela ne supprimera pas les produits associés, mais ils n\'auront plus de catégorie.')) {
      this.produitService.deleteCategorie(id).subscribe({
        next: () => this.loadCategories(),
        error: (err) => console.error('Erreur suppression catégorie', err)
      });
    }
  }
}
