import { Component, OnInit, inject , ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommandeService } from '../../../core/services/commande.service';
import { Commande, StatutCommande } from '../../../core/models/commande.model';

/**
 * Composant détail d'une commande.
 * Affiche les informations complètes d'une commande avec ses lignes
 * et permet de modifier le statut.
 */
@Component({
  selector: 'app-commande-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid py-4" *ngIf="commande">
      <div class="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h1 class="display-font text-dark mb-1">Commande {{ commande.numero }}</h1>
          <p class="text-secondary mb-0">Détails et suivi de la commande.</p>
        </div>
        <a routerLink="/commandes" class="btn btn-outline-secondary px-4">
          <i class="bi bi-arrow-left"></i> Retour
        </a>
      </div>

      <!-- Infos générales -->
      <div class="row g-4 mb-4">
        <div class="col-md-3">
          <div class="card-premium p-4 border-0 text-center">
            <div class="text-secondary small text-uppercase fw-bold mb-1">Fournisseur</div>
            <div class="fw-bold text-dark fs-5">{{ commande.fournisseurNom }}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card-premium p-4 border-0 text-center">
            <div class="text-secondary small text-uppercase fw-bold mb-1">Date</div>
            <div class="fw-bold text-dark">{{ commande.dateCommande | date:'dd/MM/yyyy HH:mm' }}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card-premium p-4 border-0 text-center">
            <div class="text-secondary small text-uppercase fw-bold mb-1">Montant Total</div>
            <div class="fw-bold text-primary fs-5">{{ commande.montantTotal | number:'1.2-2' }} MAD</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card-premium p-4 border-0 text-center">
            <div class="text-secondary small text-uppercase fw-bold mb-1">Statut</div>
            <span class="badge-status" [ngClass]="getStatutClass(commande.statut!)">
              <span class="dot"></span> {{ getStatutLabel(commande.statut!) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Actions de statut -->
      <div class="card-premium p-4 border-0 mb-4" *ngIf="commande.statut !== 'LIVREE' && commande.statut !== 'ANNULEE'">
        <h5 class="fw-bold mb-3">Modifier le statut</h5>
        <div class="d-flex gap-2">
          <button *ngIf="commande.statut === 'EN_ATTENTE'" class="btn btn-outline-primary px-3"
                  (click)="updateStatut('CONFIRMEE')">
            <i class="bi bi-check-circle"></i> Confirmer
          </button>
          <button *ngIf="commande.statut === 'CONFIRMEE'" class="btn btn-success px-3"
                  (click)="updateStatut('LIVREE')">
            <i class="bi bi-box-seam"></i> Marquer livrée
          </button>
          <button class="btn btn-outline-danger px-3"
                  (click)="updateStatut('ANNULEE')">
            <i class="bi bi-x-circle"></i> Annuler
          </button>
        </div>
      </div>

      <!-- Lignes de la commande -->
      <div class="card-premium overflow-hidden border-0">
        <div class="p-4 pb-0">
          <h5 class="fw-bold">Produits commandés</h5>
        </div>
        <div class="table-responsive">
          <table class="table align-middle mb-0">
            <thead class="bg-light text-secondary small text-uppercase fw-bold">
              <tr>
                <th class="ps-4 py-3">Produit</th>
                <th>Code</th>
                <th>Quantité</th>
                <th>Prix Unitaire</th>
                <th>Sous-total</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let l of commande.lignes">
                <td class="ps-4 fw-medium">{{ l.produitNom }}</td>
                <td><span class="badge bg-light text-secondary border px-2 py-1">{{ l.produitCode }}</span></td>
                <td>{{ l.quantite }}</td>
                <td>{{ l.prixUnitaire | number:'1.2-2' }} MAD</td>
                <td class="fw-bold">{{ l.sousTotal | number:'1.2-2' }} MAD</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="bg-light">
                <td colspan="4" class="text-end fw-bold pe-3">Total :</td>
                <td class="fw-bold text-primary fs-5">{{ commande.montantTotal | number:'1.2-2' }} MAD</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .badge-status {
      display: inline-flex; align-items: center; padding: 0.4rem 0.8rem;
      border-radius: 2rem; font-size: 0.75rem; font-weight: 700; gap: 0.5rem;
      .dot { width: 6px; height: 6px; border-radius: 50%; }
      &.status-pending { background: #fff7ed; color: #ea580c;
        .dot { background: #ea580c; box-shadow: 0 0 0 3px rgba(234,88,12,0.2); } }
      &.status-confirmed { background: #eff6ff; color: #2563eb;
        .dot { background: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.2); } }
      &.status-delivered { background: #ecfdf5; color: #059669;
        .dot { background: #059669; box-shadow: 0 0 0 3px rgba(5,150,105,0.2); } }
      &.status-cancelled { background: #fef2f2; color: #dc2626;
        .dot { background: #dc2626; box-shadow: 0 0 0 3px rgba(220,38,38,0.2); } }
    }
  `]
})
export class CommandeDetailComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private commandeService = inject(CommandeService);
  private route = inject(ActivatedRoute);
  commande: Commande | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadCommande(+id);
  }

  loadCommande(id: number): void {
    this.commandeService.getCommandeById(id).subscribe({
      next: (data) => { this.commande = data; this.cdr.markForCheck(); },
      error: (err) => console.error('Erreur chargement commande', err)
    });
  }

  updateStatut(statut: string): void {
    this.commandeService.updateStatut(this.commande!.id!, statut as StatutCommande).subscribe({
      next: (data) => { this.commande = data; this.cdr.markForCheck(); },
      error: (err) => console.error('Erreur mise à jour statut', err)
    });
  }

  getStatutClass(statut: StatutCommande): string {
    const map: Record<string, string> = {
      'EN_ATTENTE': 'status-pending', 'CONFIRMEE': 'status-confirmed',
      'LIVREE': 'status-delivered', 'ANNULEE': 'status-cancelled'
    };
    return map[statut] || '';
  }

  getStatutLabel(statut: StatutCommande): string {
    const map: Record<string, string> = {
      'EN_ATTENTE': 'En attente', 'CONFIRMEE': 'Confirmée',
      'LIVREE': 'Livrée', 'ANNULEE': 'Annulée'
    };
    return map[statut] || statut;
  }
}
