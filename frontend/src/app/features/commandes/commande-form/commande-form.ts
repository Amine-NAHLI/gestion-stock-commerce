import { Component, OnInit, inject , ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommandeService } from '../../../core/services/commande.service';
import { FournisseurService } from '../../../core/services/fournisseur.service';
import { ProduitService } from '../../../core/services/produit.service';
import { CommandeRequest, LigneCommande } from '../../../core/models/commande.model';
import { Fournisseur } from '../../../core/models/fournisseur.model';
import { Produit } from '../../../core/models/produit.model';

/**
 * Composant formulaire de commande fournisseur (multi-lignes).
 * Permet de sélectionner un fournisseur et d'ajouter plusieurs lignes de produits.
 */
@Component({
  selector: 'app-commande-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container-fluid py-4">
      <div class="mb-5">
        <h1 class="display-font text-dark mb-1">Nouvelle Commande</h1>
        <p class="text-secondary mb-0">Sélectionnez un fournisseur et ajoutez les produits à commander.</p>
      </div>

      <div class="card-premium p-4 border-0" style="max-width:900px">
        <form (ngSubmit)="onSubmit()">
          <!-- Sélection du fournisseur -->
          <div class="mb-4">
            <label class="form-label fw-bold">Fournisseur <span class="text-danger">*</span></label>
            <select class="form-select" [(ngModel)]="fournisseurId" name="fournisseurId" required>
              <option [ngValue]="null" disabled>-- Choisir un fournisseur --</option>
              <option *ngFor="let f of fournisseurs" [ngValue]="f.id">{{ f.nom }}</option>
            </select>
          </div>

          <!-- Lignes de commande -->
          <div class="mb-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <label class="form-label fw-bold mb-0">Lignes de commande</label>
              <button type="button" class="btn btn-outline-primary btn-sm px-3" (click)="addLigne()">
                <i class="bi bi-plus-lg"></i> Ajouter une ligne
              </button>
            </div>

            <div class="table-responsive">
              <table class="table align-middle mb-0" *ngIf="lignes.length > 0">
                <thead class="bg-light text-secondary small text-uppercase fw-bold">
                  <tr>
                    <th>Produit</th>
                    <th style="width:120px">Quantité</th>
                    <th style="width:150px">Prix Unitaire</th>
                    <th style="width:130px">Sous-total</th>
                    <th style="width:60px"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let ligne of lignes; let i = index">
                    <td>
                      <select class="form-select form-select-sm" [(ngModel)]="ligne.produitId" [name]="'produit_'+i" required>
                        <option [ngValue]="0" disabled>-- Produit --</option>
                        <option *ngFor="let p of produits" [ngValue]="p.id">{{ p.nom }} ({{ p.code }})</option>
                      </select>
                    </td>
                    <td>
                      <input type="number" class="form-control form-control-sm" [(ngModel)]="ligne.quantite"
                             [name]="'quantite_'+i" min="1" required (ngModelChange)="calculerSousTotal(i)">
                    </td>
                    <td>
                      <input type="number" class="form-control form-control-sm" [(ngModel)]="ligne.prixUnitaire"
                             [name]="'prix_'+i" min="0" step="0.01" required (ngModelChange)="calculerSousTotal(i)">
                    </td>
                    <td class="fw-bold text-dark">{{ (ligne.quantite * ligne.prixUnitaire) | number:'1.2-2' }} MAD</td>
                    <td>
                      <button type="button" class="btn btn-outline-danger btn-sm" (click)="removeLigne(i)" title="Supprimer">
                        <i class="bi bi-x-lg"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="bg-light">
                    <td colspan="3" class="text-end fw-bold">Total :</td>
                    <td class="fw-bold text-primary fs-5">{{ getTotal() | number:'1.2-2' }} MAD</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div *ngIf="lignes.length === 0" class="text-center py-4 text-muted border rounded-3">
              <i class="bi bi-cart-plus fs-1 d-block mb-2 opacity-25"></i>
              Aucune ligne ajoutée. Cliquez sur "Ajouter une ligne" pour commencer.
            </div>
          </div>

          <div class="d-flex gap-3 mt-4">
            <button type="submit" class="btn btn-primary px-4"
                    [disabled]="!fournisseurId || lignes.length === 0">
              <i class="bi bi-check-lg"></i> Valider la commande
            </button>
            <a routerLink="/commandes" class="btn btn-outline-secondary px-4">Annuler</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CommandeFormComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private commandeService = inject(CommandeService);
  private fournisseurService = inject(FournisseurService);
  private produitService = inject(ProduitService);
  private router = inject(Router);

  fournisseurs: Fournisseur[] = [];
  produits: Produit[] = [];
  fournisseurId: number | null = null;
  lignes: LigneCommande[] = [];

  ngOnInit(): void {
    this.fournisseurService.getAllFournisseurs().subscribe({
      next: (data) => {
        this.fournisseurs = data;
        this.cdr.markForCheck();
      }
    });
    this.produitService.getAllProduits().subscribe({
      next: (data) => {
        this.produits = data;
        this.cdr.markForCheck();
      }
    });
  }

  /** Ajoute une ligne vide au tableau */
  addLigne(): void {
    this.lignes.push({ produitId: 0, quantite: 1, prixUnitaire: 0 });
  }

  /** Supprime une ligne du tableau */
  removeLigne(index: number): void {
    this.lignes.splice(index, 1);
  }

  /** Recalcule le sous-total d'une ligne */
  calculerSousTotal(index: number): void {
    const ligne = this.lignes[index];
    ligne.sousTotal = ligne.quantite * ligne.prixUnitaire;
  }

  /** Calcule le montant total de la commande */
  getTotal(): number {
    return this.lignes.reduce((sum, l) => sum + (l.quantite * l.prixUnitaire), 0);
  }

  /** Soumet la commande au backend */
  onSubmit(): void {
    const request: CommandeRequest = {
      fournisseurId: this.fournisseurId!,
      lignes: this.lignes
    };

    this.commandeService.createCommande(request).subscribe({
      next: () => this.router.navigate(['/commandes']),
      error: (err) => console.error('Erreur création commande', err)
    });
  }
}
