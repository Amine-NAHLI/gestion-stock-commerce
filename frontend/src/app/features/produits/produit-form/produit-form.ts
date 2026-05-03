import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProduitService } from '../../../core/services/produit.service';
import { Categorie, Produit } from '../../../core/models/produit.model';

@Component({
  selector: 'app-produit-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="d-flex align-items-center mb-4">
            <a routerLink="/produits" class="btn btn-outline-secondary btn-sm rounded-circle me-3">
              <i class="bi bi-arrow-left"></i>
            </a>
            <h2 class="fw-bold mb-0 text-primary">{{ isEdit ? 'Modifier' : 'Ajouter' }} un Produit</h2>
          </div>

          <div class="card border-0 shadow-sm rounded-4 p-4">
            <form (ngSubmit)="saveProduit()" #produitForm="ngForm">
              <div class="row g-3">
                <!-- Informations de base -->
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Nom du produit *</label>
                  <input type="text" name="nom" [(ngModel)]="produit.nom" class="form-control rounded-3" required placeholder="ex: Jus d'Orange 1L">
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Code / Référence *</label>
                  <input type="text" name="code" [(ngModel)]="produit.code" class="form-control rounded-3" required placeholder="ex: PRD-001">
                </div>

                <div class="col-12">
                  <label class="form-label fw-semibold">Description</label>
                  <textarea name="description" [(ngModel)]="produit.description" class="form-control rounded-3" rows="3" placeholder="Détails du produit..."></textarea>
                </div>

                <!-- Catégorie et Unité -->
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Catégorie</label>
                  <select name="categorieId" [(ngModel)]="produit.categorieId" class="form-select rounded-3">
                    <option [value]="undefined">Sélectionner une catégorie</option>
                    <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.nom }}</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Unité</label>
                  <input type="text" name="unite" [(ngModel)]="produit.unite" class="form-control rounded-3" placeholder="ex: kg, litre, unité">
                </div>

                <!-- Prix -->
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Prix d'Achat (€)</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">€</span>
                    <input type="number" name="prixAchat" [(ngModel)]="produit.prixAchat" class="form-control rounded-3" step="0.01">
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Prix de Vente (€)</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">€</span>
                    <input type="number" name="prixVente" [(ngModel)]="produit.prixVente" class="form-control rounded-3" step="0.01">
                  </div>
                </div>

                <!-- Stock -->
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Quantité en Stock</label>
                  <input type="number" name="quantiteStock" [(ngModel)]="produit.quantiteStock" class="form-control rounded-3">
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Seuil d'Alerte</label>
                  <input type="number" name="seuilAlerte" [(ngModel)]="produit.seuilAlerte" class="form-control rounded-3">
                </div>

                <!-- Image URL -->
                <div class="col-12">
                  <label class="form-label fw-semibold">URL de l'Image</label>
                  <input type="text" name="image" [(ngModel)]="produit.image" class="form-control rounded-3" placeholder="https://exemple.com/image.jpg">
                </div>

                <div class="col-12 mt-4 pt-3 border-top">
                  <div class="d-flex justify-content-end gap-2">
                    <button type="button" routerLink="/produits" class="btn btn-light px-4">Annuler</button>
                    <button type="submit" [disabled]="produitForm.invalid" class="btn btn-primary px-5 shadow-sm">
                      <i class="bi bi-check2-circle me-2"></i>{{ isEdit ? 'Mettre à jour' : 'Enregistrer' }}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProduitFormComponent implements OnInit {
  private produitService = inject(ProduitService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  produit: Produit = {
    nom: '',
    code: '',
    prixAchat: 0,
    prixVente: 0,
    quantiteStock: 0,
    seuilAlerte: 10
  };

  categories: Categorie[] = [];
  isEdit = false;

  ngOnInit(): void {
    this.loadCategories();
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.produitService.getProduitById(id).subscribe({
        next: (p) => this.produit = p,
        error: (err) => console.error('Erreur chargement produit', err)
      });
    }
  }

  loadCategories(): void {
    this.produitService.getAllCategories().subscribe(data => this.categories = data);
  }

  saveProduit(): void {
    const obs = this.isEdit 
      ? this.produitService.updateProduit(this.produit.id!, this.produit)
      : this.produitService.createProduit(this.produit);

    obs.subscribe({
      next: () => this.router.navigate(['/produits']),
      error: (err) => console.error('Erreur lors de la sauvegarde', err)
    });
  }
}
