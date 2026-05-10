import { Component, OnInit, inject , ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VenteService } from '../../../core/services/vente.service';
import { Vente } from '../../../core/models/vente.model';

/**
 * Composant liste des ventes.
 * Affiche toutes les ventes réalisées avec le montant et le mode de paiement.
 */
@Component({
  selector: 'app-vente-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h1 class="display-font text-dark mb-1">Ventes</h1>
          <p class="text-secondary mb-0">Historique de toutes les ventes réalisées.</p>
        </div>
        <a routerLink="new" class="btn btn-primary shadow-sm px-4 py-2">
          <i class="bi bi-plus-lg"></i>
          <span>Nouvelle Vente</span>
        </a>
      </div>

      <div class="card-premium overflow-hidden border-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light text-secondary small text-uppercase fw-bold" style="letter-spacing:0.05em">
              <tr>
                <th class="ps-4 py-3">Numéro</th>
                <th>Client</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Paiement</th>
                <th>Vendeur</th>
                <th class="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody class="border-top-0">
              <tr *ngFor="let v of ventes" class="transition-all">
                <td class="ps-4">
                  <span class="badge bg-light text-success fw-bold px-3 py-2 rounded-3 border">{{ v.numero }}</span>
                </td>
                <td class="fw-medium">{{ v.clientNom || 'Client occasionnel' }}</td>
                <td class="text-secondary">{{ v.dateVente | date:'dd/MM/yyyy HH:mm' }}</td>
                <td class="fw-bold text-dark">{{ v.montantTotal | number:'1.2-2' }} MAD</td>
                <td>
                  <span class="badge rounded-pill" [ngClass]="{
                    'bg-success-subtle text-success': v.modePaiement === 'ESPECES',
                    'bg-primary-subtle text-primary': v.modePaiement === 'CARTE',
                    'bg-warning-subtle text-warning': v.modePaiement === 'CHEQUE'
                  }">
                    <i class="bi" [ngClass]="{
                      'bi-cash': v.modePaiement === 'ESPECES',
                      'bi-credit-card': v.modePaiement === 'CARTE',
                      'bi-file-text': v.modePaiement === 'CHEQUE'
                    }"></i>
                    {{ v.modePaiement }}
                  </span>
                </td>
                <td class="text-secondary">{{ v.userNom }}</td>
                <td class="text-end pe-4">
                  <div class="d-flex justify-content-end gap-2">
                    <a [routerLink]="['recu', v.id]" class="btn-action action-view" title="Voir le reçu">
                      <i class="bi bi-receipt"></i>
                    </a>
                    <button (click)="deleteVente(v.id!)" class="btn-action action-delete" title="Supprimer">
                      <i class="bi bi-trash3-fill"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="ventes.length === 0">
                <td colspan="7" class="text-center py-5">
                  <div class="py-5">
                    <i class="bi bi-receipt display-1 text-light mb-4 d-block"></i>
                    <h4 class="text-secondary">Aucune vente</h4>
                    <p class="text-muted">Réalisez votre première vente depuis le point de vente.</p>
                    <a routerLink="new" class="btn btn-primary mt-3 px-4">
                      <i class="bi bi-plus-lg"></i> Nouvelle vente
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
export class VenteListComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private venteService = inject(VenteService);
  ventes: Vente[] = [];

  ngOnInit(): void {
    this.loadVentes();
  }

  loadVentes(): void {
    this.venteService.getAllVentes().subscribe({
      next: (data) => { this.ventes = data; this.cdr.markForCheck(); },
      error: (err) => console.error('Erreur chargement ventes', err)
    });
  }

  deleteVente(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette vente ?')) {
      this.venteService.deleteVente(id).subscribe({
        next: () => this.loadVentes(),
        error: (err) => console.error('Erreur suppression', err)
      });
    }
  }
}
