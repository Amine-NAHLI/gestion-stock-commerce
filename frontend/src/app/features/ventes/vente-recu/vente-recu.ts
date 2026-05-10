import { Component, OnInit, inject , ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { VenteService } from '../../../core/services/vente.service';
import { Vente } from '../../../core/models/vente.model';

/**
 * Composant reçu de vente.
 * Affiche un reçu imprimable avec les détails de la vente.
 */
@Component({
  selector: 'app-vente-recu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h1 class="display-font text-dark mb-1">Reçu de Vente</h1>
          <p class="text-secondary mb-0">Détail de la transaction.</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-primary px-4" (click)="imprimer()">
            <i class="bi bi-printer"></i> Imprimer
          </button>
          <a routerLink="/ventes" class="btn btn-outline-secondary px-4">
            <i class="bi bi-arrow-left"></i> Retour
          </a>
        </div>
      </div>

      <div class="receipt-container" id="receipt" *ngIf="vente">
        <div class="card-premium p-5 border-0" style="max-width:600px;margin:0 auto">
          <!-- En-tête -->
          <div class="text-center mb-4 pb-4 border-bottom">
            <div class="d-flex align-items-center justify-content-center gap-2 mb-2">
              <div class="bg-primary rounded-3 p-2 d-flex align-items-center justify-content-center"
                   style="width:40px;height:40px">
                <i class="bi bi-box-seam text-white fs-5"></i>
              </div>
              <h3 class="display-font mb-0">STOCKLY</h3>
            </div>
            <p class="text-secondary small mb-0">Système de gestion de stock</p>
          </div>

          <!-- Infos vente -->
          <div class="row mb-4">
            <div class="col-6">
              <div class="text-secondary small">N° Vente</div>
              <div class="fw-bold">{{ vente.numero }}</div>
            </div>
            <div class="col-6 text-end">
              <div class="text-secondary small">Date</div>
              <div class="fw-bold">{{ vente.dateVente | date:'dd/MM/yyyy HH:mm' }}</div>
            </div>
          </div>

          <div class="row mb-4">
            <div class="col-6">
              <div class="text-secondary small">Client</div>
              <div class="fw-bold">{{ vente.clientNom || 'Client occasionnel' }}</div>
            </div>
            <div class="col-6 text-end">
              <div class="text-secondary small">Vendeur</div>
              <div class="fw-bold">{{ vente.userNom }}</div>
            </div>
          </div>

          <!-- Lignes -->
          <table class="table mb-4">
            <thead class="bg-light">
              <tr class="small text-uppercase text-secondary fw-bold">
                <th>Article</th>
                <th class="text-center">Qté</th>
                <th class="text-end">P.U.</th>
                <th class="text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let l of vente.lignes">
                <td>{{ l.produitNom }}</td>
                <td class="text-center">{{ l.quantite }}</td>
                <td class="text-end">{{ l.prixUnitaire | number:'1.2-2' }}</td>
                <td class="text-end fw-bold">{{ l.sousTotal | number:'1.2-2' }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Total -->
          <div class="border-top pt-3">
            <div class="d-flex justify-content-between align-items-center">
              <span class="text-secondary">Mode de paiement</span>
              <span class="fw-bold">{{ vente.modePaiement }}</span>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
              <span class="fs-5 fw-bold">TOTAL</span>
              <span class="fs-4 fw-bold text-primary">{{ vente.montantTotal | number:'1.2-2' }} MAD</span>
            </div>
          </div>

          <!-- Pied de page -->
          <div class="text-center mt-4 pt-4 border-top">
            <p class="text-secondary small mb-0">Merci pour votre achat !</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @media print {
      .btn, a.btn { display: none !important; }
      .card-premium { box-shadow: none !important; }
    }
  `]
})
export class VenteRecuComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private venteService = inject(VenteService);
  private route = inject(ActivatedRoute);
  vente: Vente | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.venteService.getVenteById(+id).subscribe({
      next: (data) => { this.vente = data; this.cdr.markForCheck(); },
      error: (err) => console.error('Erreur chargement vente', err)
    });
  }

  imprimer(): void {
    window.print();
  }
}
