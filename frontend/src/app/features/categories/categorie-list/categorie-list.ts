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
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold text-primary mb-0">📁 Gestion des Catégories</h2>
        <a routerLink="new" class="btn btn-primary shadow-sm px-4">
          <i class="bi bi-plus-lg me-2"></i>Nouvelle Catégorie
        </a>
      </div>

      <div class="row g-4">
        <div class="col-md-6 col-lg-4" *ngFor="let cat of categories">
          <div class="card border-0 shadow-sm rounded-4 h-100 overflow-hidden hover-shadow transition">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div class="bg-soft-primary rounded-3 p-3">
                  <i class="bi bi-folder2-open fs-3 text-primary"></i>
                </div>
                <div class="dropdown">
                  <button class="btn btn-link text-muted p-0" type="button" data-bs-toggle="dropdown">
                    <i class="bi bi-three-dots-vertical"></i>
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-3">
                    <li><a class="dropdown-item" [routerLink]="['edit', cat.id]"><i class="bi bi-pencil me-2 text-warning"></i>Modifier</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><button class="dropdown-item text-danger" (click)="deleteCategorie(cat.id!)"><i class="bi bi-trash me-2"></i>Supprimer</button></li>
                  </ul>
                </div>
              </div>
              
              <h5 class="fw-bold mb-2">{{ cat.nom }}</h5>
              <p class="text-muted small mb-4 line-clamp-2" style="min-height: 3rem;">
                {{ cat.description || 'Aucune description fournie pour cette catégorie.' }}
              </p>
              
              <div class="d-flex justify-content-between align-items-center pt-3 border-top">
                <span class="text-muted small">Créée le : {{ cat.dateCreation | date:'shortDate' }}</span>
                <a [routerLink]="['/produits']" [queryParams]="{categorie: cat.id}" class="btn btn-light btn-sm rounded-pill px-3">
                  Voir produits
                </a>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="categories.length === 0" class="col-12 text-center py-5">
          <div class="text-muted">
            <i class="bi bi-folder-x fs-1 d-block mb-3 opacity-25"></i>
            <p>Aucune catégorie trouvée. Créez votre première catégorie !</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-soft-primary { background-color: rgba(13, 110, 253, 0.1); }
    .hover-shadow:hover { transform: translateY(-5px); box-shadow: 0 1rem 3rem rgba(0,0,0,.1) !important; }
    .transition { transition: all 0.3s ease; }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
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
