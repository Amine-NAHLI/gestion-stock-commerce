import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MouvementService } from '../../../core/services/mouvement.service';
import { ProduitService } from '../../../core/services/produit.service';
import { TypeMouvement, MouvementStock } from '../../../core/models/mouvement.model';
import { Produit } from '../../../core/models/produit.model';

@Component({
  selector: 'app-mouvement-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-lg-6">
          <div class="d-flex align-items-center mb-4">
            <a routerLink="/mouvements" class="btn btn-outline-secondary btn-sm rounded-circle me-3">
              <i class="bi bi-arrow-left"></i>
            </a>
            <h2 class="fw-bold mb-0 text-primary">Nouvelle Opération de Stock</h2>
          </div>

          <div class="card border-0 shadow-sm rounded-4 p-4">
            <form (ngSubmit)="saveMouvement()" #mvtForm="ngForm">
              <div class="mb-3">
                <label class="form-label fw-semibold">Produit *</label>
                <select name="produitId" [(ngModel)]="mouvement.produitId" class="form-select rounded-3 py-2" required>
                  <option [value]="undefined" disabled>Sélectionner un produit</option>
                  <option *ngFor="let p of produits" [value]="p.id">
                    {{ p.nom }} ({{ p.code }}) - Stock actuel: {{ p.quantiteStock }}
                  </option>
                </select>
              </div>

              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Type de mouvement *</label>
                  <select name="type" [(ngModel)]="mouvement.type" class="form-select rounded-3 py-2" required>
                    <option *ngFor="let t of types" [value]="t">{{ t }}</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Quantité *</label>
                  <input type="number" name="quantite" [(ngModel)]="mouvement.quantite" class="form-control rounded-3 py-2" required min="0.01" step="0.01">
                </div>
              </div>

              <div class="mb-4">
                <label class="form-label fw-semibold">Motif / Commentaire</label>
                <textarea name="motif" [(ngModel)]="mouvement.motif" class="form-control rounded-3" rows="3" placeholder="Raison du mouvement (ex: Réception commande #123, Vente magasin...)"></textarea>
              </div>

              <div *ngIf="errorMessage" class="alert alert-danger rounded-3 small py-2 mb-4">
                <i class="bi bi-exclamation-triangle me-2"></i>{{ errorMessage }}
              </div>

              <div class="d-flex justify-content-end gap-2 pt-3 border-top">
                <button type="button" routerLink="/mouvements" class="btn btn-light px-4">Annuler</button>
                <button type="submit" [disabled]="mvtForm.invalid" class="btn btn-primary px-5 shadow-sm">
                  <i class="bi bi-check2-circle me-2"></i>Valider l'opération
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MouvementFormComponent implements OnInit {
  private mouvementService = inject(MouvementService);
  private produitService = inject(ProduitService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  produits: Produit[] = [];
  types = Object.values(TypeMouvement);
  errorMessage: string | null = null;

  mouvement: MouvementStock = {
    produitId: undefined as any,
    quantite: 0,
    type: TypeMouvement.ENTREE,
    motif: ''
  };

  ngOnInit(): void {
    this.loadProduits();
  }

  loadProduits(): void {
    this.produitService.getAllProduits().subscribe({
      next: (data) => {
        this.produits = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Erreur chargement produits', err)
    });
  }

  saveMouvement(): void {
    this.errorMessage = null;
    this.mouvementService.enregistrerMouvement(this.mouvement).subscribe({
      next: () => this.router.navigate(['/mouvements']),
      error: (err) => {
        console.error('Erreur lors de l\'opération', err);
        this.errorMessage = err.error?.message || 'Une erreur est survenue lors de l\'enregistrement du mouvement.';
        this.cdr.markForCheck();
      }
    });
  }
}
