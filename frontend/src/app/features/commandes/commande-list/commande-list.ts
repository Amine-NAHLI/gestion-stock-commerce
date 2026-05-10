import { Component, OnInit, inject , ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommandeService } from '../../../core/services/commande.service';
import { Commande, StatutCommande } from '../../../core/models/commande.model';

/**
 * Composant liste des commandes fournisseurs.
 * Affiche toutes les commandes avec leur statut et des actions rapides.
 */
@Component({
  selector: 'app-commande-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h1 class="display-font text-dark mb-1">Commandes Fournisseurs</h1>
          <p class="text-secondary mb-0">Suivez vos commandes et leur état de livraison.</p>
        </div>
        <a routerLink="new" class="btn btn-primary shadow-sm px-4 py-2">
          <i class="bi bi-plus-lg"></i>
          <span>Nouvelle Commande</span>
        </a>
      </div>

      <div class="card-premium overflow-hidden border-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light text-secondary small text-uppercase fw-bold" style="letter-spacing:0.05em">
              <tr>
                <th class="ps-4 py-3">Numéro</th>
                <th>Fournisseur</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
                <th class="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody class="border-top-0">
              <tr *ngFor="let c of commandes" class="transition-all">
                <td class="ps-4">
                  <span class="badge bg-light text-primary fw-bold px-3 py-2 rounded-3 border">{{ c.numero }}</span>
                </td>
                <td class="fw-medium">{{ c.fournisseurNom }}</td>
                <td class="text-secondary">{{ c.dateCommande | date:'dd/MM/yyyy HH:mm' }}</td>
                <td class="fw-bold text-dark">{{ c.montantTotal | currency:'MAD ':'symbol':'1.2-2' }}</td>
                <td>
                  <span class="badge-status" [ngClass]="getStatutClass(c.statut!)">
                    <span class="dot"></span> {{ getStatutLabel(c.statut!) }}
                  </span>
                </td>
                <td class="text-end pe-4">
                  <div class="d-flex justify-content-end gap-2">
                    <a [routerLink]="[c.id]" class="btn-action action-view" title="Détails">
                      <i class="bi bi-eye-fill"></i>
                    </a>
                    <button *ngIf="c.statut === 'EN_ATTENTE'" (click)="deleteCommande(c.id!)"
                            class="btn-action action-delete" title="Supprimer">
                      <i class="bi bi-trash3-fill"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="commandes.length === 0">
                <td colspan="6" class="text-center py-5">
                  <div class="py-5">
                    <i class="bi bi-cart-check display-1 text-light mb-4 d-block"></i>
                    <h4 class="text-secondary">Aucune commande</h4>
                    <p class="text-muted">Créez votre première commande fournisseur.</p>
                    <a routerLink="new" class="btn btn-primary mt-3 px-4">
                      <i class="bi bi-plus-lg"></i> Nouvelle commande
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
    .btn-action {
      width: 36px; height: 36px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      border: 1px solid #f1f5f9; background: white; color: #64748b;
      transition: all 0.2s; text-decoration: none; cursor: pointer;
      &:hover { transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
      &.action-view:hover { color: var(--primary); border-color: var(--primary); background: #eef2ff; }
      &.action-delete:hover { color: #dc2626; border-color: #fee2e2; background: #fef2f2; }
    }
  `]
})
export class CommandeListComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private commandeService = inject(CommandeService);
  commandes: Commande[] = [];

  ngOnInit(): void {
    this.loadCommandes();
  }

  loadCommandes(): void {
    this.commandeService.getAllCommandes().subscribe({
      next: (data) => { this.commandes = data; this.cdr.markForCheck(); },
      error: (err) => console.error('Erreur chargement commandes', err)
    });
  }

  deleteCommande(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      this.commandeService.deleteCommande(id).subscribe({
        next: () => this.loadCommandes(),
        error: (err) => console.error('Erreur suppression', err)
      });
    }
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
