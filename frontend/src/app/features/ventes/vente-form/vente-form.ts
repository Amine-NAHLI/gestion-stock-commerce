import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { VenteService } from '../../../core/services/vente.service';
import { ClientService } from '../../../core/services/client.service';
import { ProduitService } from '../../../core/services/produit.service';
import { LigneVente, ModePaiement, VenteRequest } from '../../../core/models/vente.model';
import { Client } from '../../../core/models/client.model';
import { Produit } from '../../../core/models/produit.model';

/**
 * Composant point de vente (POS).
 * Permet de créer une vente en ajoutant des produits, sélectionnant un client
 * optionnel et un mode de paiement.
 */
@Component({
  selector: 'app-vente-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container-fluid py-4">
      <div class="mb-5">
        <h1 class="display-font text-dark mb-1">
          <i class="bi bi-cart3 me-2 text-primary"></i> Point de Vente
        </h1>
        <p class="text-secondary mb-0">Enregistrez une nouvelle vente en ajoutant les produits vendus.</p>
      </div>

      <div class="row g-4">
        <!-- Colonne principale : lignes de vente -->
        <div class="col-lg-8">
          <div class="card-premium p-4 border-0">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="fw-bold mb-0">Articles</h5>
              <button type="button" class="btn btn-outline-primary btn-sm px-3" (click)="addLigne()">
                <i class="bi bi-plus-lg"></i> Ajouter un article
              </button>
            </div>

            <div class="table-responsive" *ngIf="lignes.length > 0">
              <table class="table align-middle mb-0">
                <thead class="bg-light text-secondary small text-uppercase fw-bold">
                  <tr>
                    <th>Produit</th>
                    <th style="width:100px">Qté</th>
                    <th style="width:130px">Prix Unit.</th>
                    <th style="width:120px">Sous-total</th>
                    <th style="width:50px"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let ligne of lignes; let i = index">
                    <td>
                      <select class="form-select form-select-sm" [(ngModel)]="ligne.produitId"
                              [name]="'produit_'+i" required (ngModelChange)="onProduitChange(i)">
                        <option [ngValue]="0" disabled>-- Produit --</option>
                        <option *ngFor="let p of produits" [ngValue]="p.id">
                          {{ p.nom }} (stock: {{ p.quantiteStock }})
                        </option>
                      </select>
                    </td>
                    <td>
                      <input type="number" class="form-control form-control-sm" [(ngModel)]="ligne.quantite"
                             [name]="'quantite_'+i" min="1" required>
                    </td>
                    <td>
                      <input type="number" class="form-control form-control-sm" [(ngModel)]="ligne.prixUnitaire"
                             [name]="'prix_'+i" min="0" step="0.01" required>
                    </td>
                    <td class="fw-bold">{{ (ligne.quantite * ligne.prixUnitaire) | number:'1.2-2' }}</td>
                    <td>
                      <button type="button" class="btn btn-outline-danger btn-sm" (click)="removeLigne(i)">
                        <i class="bi bi-x-lg"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div *ngIf="lignes.length === 0" class="text-center py-5 text-muted border rounded-3">
              <i class="bi bi-bag-plus fs-1 d-block mb-2 opacity-25"></i>
              Ajoutez des articles pour commencer la vente.
            </div>
          </div>
        </div>

        <!-- Colonne latérale : résumé et paiement -->
        <div class="col-lg-4">
          <div class="card-premium p-4 border-0 mb-4">
            <h5 class="fw-bold mb-3">Client</h5>
            <select class="form-select" [(ngModel)]="clientId" name="clientId">
              <option [ngValue]="null">Client occasionnel</option>
              <option *ngFor="let c of clients" [ngValue]="c.id">{{ c.nom }} {{ c.prenom }}</option>
            </select>
          </div>

          <div class="card-premium p-4 border-0 mb-4">
            <h5 class="fw-bold mb-3">Mode de paiement</h5>
            <div class="d-flex flex-column gap-2">
              <label class="payment-option" [class.active]="modePaiement === 'ESPECES'">
                <input type="radio" [(ngModel)]="modePaiement" name="paiement" value="ESPECES" class="d-none">
                <i class="bi bi-cash fs-5"></i> Espèces
              </label>
              <label class="payment-option" [class.active]="modePaiement === 'CARTE'">
                <input type="radio" [(ngModel)]="modePaiement" name="paiement" value="CARTE" class="d-none">
                <i class="bi bi-credit-card fs-5"></i> Carte
              </label>
              <label class="payment-option" [class.active]="modePaiement === 'CHEQUE'">
                <input type="radio" [(ngModel)]="modePaiement" name="paiement" value="CHEQUE" class="d-none">
                <i class="bi bi-file-text fs-5"></i> Chèque
              </label>
            </div>
          </div>

          <div class="card-premium p-4 border-0" style="background:linear-gradient(135deg,#6366f1,#4f46e5);color:white">
            <div class="text-uppercase small fw-bold opacity-75 mb-1">Total à payer</div>
            <div class="display-6 fw-bold">{{ getTotal() | number:'1.2-2' }} MAD</div>
            <div class="small opacity-75 mt-1">{{ lignes.length }} article(s)</div>
            <button class="btn btn-light w-100 mt-4 fw-bold text-primary"
                    [disabled]="lignes.length === 0" (click)="onSubmit()">
              <i class="bi bi-check-circle-fill"></i> Valider la vente
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .payment-option {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 0.75rem 1rem; border-radius: 0.75rem;
      border: 2px solid #e2e8f0; cursor: pointer;
      transition: all 0.2s; font-weight: 500;
      &:hover { border-color: var(--primary); background: #f8faff; }
      &.active { border-color: var(--primary); background: #eef2ff; color: var(--primary); }
    }
  `]
})
export class VenteFormComponent implements OnInit {
  private venteService = inject(VenteService);
  private clientService = inject(ClientService);
  private produitService = inject(ProduitService);
  private router = inject(Router);

  clients: Client[] = [];
  produits: Produit[] = [];
  clientId: number | null = null;
  modePaiement: string = 'ESPECES';
  lignes: LigneVente[] = [];

  ngOnInit(): void {
    this.clientService.getAllClients().subscribe({ next: (data) => this.clients = data });
    this.produitService.getAllProduits().subscribe({ next: (data) => this.produits = data });
  }

  addLigne(): void {
    this.lignes.push({ produitId: 0, quantite: 1, prixUnitaire: 0 });
  }

  removeLigne(index: number): void {
    this.lignes.splice(index, 1);
  }

  /** Quand on sélectionne un produit, on pré-remplit le prix de vente */
  onProduitChange(index: number): void {
    const ligne = this.lignes[index];
    const produit = this.produits.find(p => p.id === ligne.produitId);
    if (produit) {
      ligne.prixUnitaire = produit.prixVente;
    }
  }

  getTotal(): number {
    return this.lignes.reduce((sum, l) => sum + (l.quantite * l.prixUnitaire), 0);
  }

  onSubmit(): void {
    const request: VenteRequest = {
      clientId: this.clientId ?? undefined,
      modePaiement: this.modePaiement as ModePaiement,
      lignes: this.lignes
    };

    this.venteService.createVente(request).subscribe({
      next: (vente) => this.router.navigate(['/ventes/recu', vente.id]),
      error: (err) => {
        console.error('Erreur création vente', err);
        alert(err.error?.message || 'Erreur lors de la création de la vente');
      }
    });
  }
}
