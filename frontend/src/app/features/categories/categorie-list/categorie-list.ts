import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProduitService } from '../../../core/services/produit.service';
import { Categorie } from '../../../core/models/produit.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categorie-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container-fluid py-5 px-4">
      <!-- En-tête -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5 gap-3">
        <div>
          <h1 class="h2 fw-bold text-dark mb-2">Catégories d'Articles</h1>
          <p class="text-muted mb-0">Structurez votre inventaire par familles de produits.</p>
        </div>
        <a routerLink="new" class="btn btn-primary btn-lg d-inline-flex align-items-center gap-2 shadow-sm rounded-pill">
          <i class="bi bi-folder-plus"></i>
          <span>Nouvelle Catégorie</span>
        </a>
      </div>

      <!-- Filtres -->
      <div class="card border-0 mb-5 shadow-sm overflow-hidden">
        <div class="card-body p-4">
          <div class="row g-4 align-items-center">
            <div class="col-12">
              <div class="input-group input-group-lg custom-search">
                <span class="input-group-text bg-white border-0 text-secondary">
                  <i class="bi bi-search"></i>
                </span>
                <input 
                  type="text" 
                  class="form-control bg-white border-0 text-dark shadow-none ps-3" 
                  placeholder="Rechercher une catégorie..."
                  [(ngModel)]="searchTerm"
                  (input)="filterCategories()"
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Grille des catégories -->
      <div class="row g-4">
        <div class="col-sm-6 col-lg-4 col-xl-3" *ngFor="let cat of filteredCategories">
          <div class="card h-100 border-0 category-card shadow-sm">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div class="category-icon-container shadow-sm">
                  <i class="bi bi-folder2-open text-primary fs-3"></i>
                </div>
                <div class="dropdown">
                  <button class="btn btn-icon-only text-secondary p-0 shadow-none" data-bs-toggle="dropdown">
                    <i class="bi bi-three-dots-vertical fs-5"></i>
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0">
                    <li><a class="dropdown-item py-2" [routerLink]="['edit', cat.id]">
                      <i class="bi bi-pencil-square me-2"></i> Modifier
                    </a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item py-2 text-danger" href="javascript:void(0)" (click)="deleteCategorie(cat.id!)">
                      <i class="bi bi-trash3-fill me-2"></i> Supprimer
                    </a></li>
                  </ul>
                </div>
              </div>
              
              <h4 class="text-dark fw-semibold mb-2">{{ cat.nom }}</h4>
              <p class="text-muted small mb-4 line-clamp-3" style="min-height: 4.5rem;">
                {{ cat.description || 'Aucune description fournie pour cette catégorie.' }}
              </p>
              
              <div class="d-flex justify-content-between align-items-center pt-4 border-top">
                <div class="d-flex flex-column">
                  <span class="text-secondary text-uppercase fw-semibold small tracking-text">Créé le</span>
                  <span class="text-muted small">{{ cat.dateCreation | date:'dd MMM yyyy' }}</span>
                </div>
                <a [routerLink]="['/produits']" [queryParams]="{categorie: cat.id}" class="btn btn-outline-primary btn-sm rounded-pill px-4">
                  Explorer
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredCategories.length === 0" class="col-12 text-center py-5">
          <div class="py-5">
            <i class="bi bi-folder-x display-1 mb-4 d-block text-secondary"></i>
            <h4 class="text-dark">Aucune catégorie trouvée</h4>
            <p class="text-muted">Structurez votre inventaire en créant des catégories pertinentes.</p>
            <button class="btn btn-primary mt-3 px-4 rounded-pill" (click)="searchTerm=''; filterCategories()">
              Voir toutes les catégories
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container-fluid { max-width: 1400px; }
    
    .bg-dark-glass { background-color: rgba(30, 30, 30, 0.7); backdrop-filter: blur(10px); }
    .bg-dark-light { background-color: rgba(255, 255, 255, 0.05); }
    .border-dark-light { border-color: rgba(255, 255, 255, 0.05) !important; }
    
    .custom-search .input-group-text { border-radius: 12px 0 0 12px; }
    .custom-search .form-control { border-radius: 0 12px 12px 0; }
    
    .category-card {
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      border: 1px solid rgba(255, 255, 255, 0.05) !important;
      border-radius: 24px;
    }
    
    .category-card:hover {
      transform: translateY(-10px);
      background-color: rgba(40, 40, 40, 0.9);
      border-color: rgba(59, 130, 246, 0.4) !important;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5) !important;
    }
    
    .category-icon-container {
      width: 56px;
      height: 56px;
      background-color: rgba(59, 130, 246, 0.1);
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(59, 130, 246, 0.2);
    }
    
    .btn-icon-only {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      transition: background 0.2s;
    }
    
    .btn-icon-only:hover { background-color: rgba(255, 255, 255, 0.1); color: white !important; }
    
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .dropdown-item { font-size: 0.9rem; font-weight: 500; transition: all 0.2s; }
    .dropdown-item:hover { background-color: #3b82f6; color: white !important; }
    .dropdown-item.text-danger:hover { background-color: #ef4444; color: white !important; }
    
    .rounded-pill { border-radius: 50px !important; }
  `]
})
export class CategorieListComponent implements OnInit {
  private produitService = inject(ProduitService);
  private cdr = inject(ChangeDetectorRef);
  
  categories: Categorie[] = [];
  filteredCategories: Categorie[] = [];
  searchTerm: string = '';

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.produitService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.filterCategories();
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Erreur chargement catégories', err)
    });
  }

  filterCategories(): void {
    this.filteredCategories = this.categories.filter(cat => 
      cat.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (cat.description && cat.description.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  deleteCategorie(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ? Cela ne supprimera pas les produits associés.')) {
      this.produitService.deleteCategorie(id).subscribe({
        next: () => this.loadCategories(),
        error: (err) => console.error('Erreur suppression catégorie', err)
      });
    }
  }
}
