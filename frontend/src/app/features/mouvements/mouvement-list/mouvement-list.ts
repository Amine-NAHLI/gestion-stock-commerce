import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MouvementService } from '../../../core/services/mouvement.service';
import { MouvementStock, TypeMouvement } from '../../../core/models/mouvement.model';

@Component({
  selector: 'app-mouvement-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold text-primary mb-0">🔄 Historique des Mouvements</h2>
        <a routerLink="new" class="btn btn-primary shadow-sm px-4">
          <i class="bi bi-plus-lg me-2"></i>Nouvelle Opération
        </a>
      </div>

      <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light text-secondary small text-uppercase fw-semibold">
              <tr>
                <th class="ps-4">Date</th>
                <th>Produit</th>
                <th>Type</th>
                <th>Quantité</th>
                <th>Motif</th>
                <th class="text-end pe-4">Statut</th>
              </tr>
            </thead>
            <tbody class="border-top-0">
              <tr *ngFor="let m of mouvements">
                <td class="ps-4">
                  <span class="text-muted small">{{ m.dateMouvement | date:'medium' }}</span>
                </td>
                <td>
                  <div class="fw-bold text-dark">{{ m.produitNom }}</div>
                  <code class="small text-primary">{{ m.produitCode }}</code>
                </td>
                <td>
                  <span [ngClass]="getTypeClass(m.type)" class="badge rounded-pill px-3 py-2 fw-medium">
                    <i [ngClass]="getTypeIcon(m.type)" class="me-1"></i>
                    {{ m.type }}
                  </span>
                </td>
                <td>
                  <span [ngClass]="m.type === 'ENTREE' ? 'text-success' : (m.type === 'SORTIE' ? 'text-danger' : 'text-primary')" class="fw-bold fs-5">
                    {{ m.type === 'ENTREE' ? '+' : (m.type === 'SORTIE' ? '-' : '') }}{{ m.quantite }}
                  </span>
                </td>
                <td>
                  <span class="text-muted small">{{ m.motif || 'Aucun motif' }}</span>
                </td>
                <td class="text-end pe-4">
                  <span class="badge bg-soft-secondary text-secondary rounded-pill">Validé</span>
                </td>
              </tr>
              <tr *ngIf="mouvements.length === 0">
                <td colspan="6" class="text-center py-5">
                  <div class="text-muted">
                    <i class="bi bi-arrow-repeat fs-1 d-block mb-3 opacity-25"></i>
                    <p>Aucun mouvement enregistré pour le moment.</p>
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
    .bg-soft-success { background-color: rgba(25, 135, 84, 0.1); }
    .bg-soft-danger { background-color: rgba(220, 53, 69, 0.1); }
    .bg-soft-warning { background-color: rgba(255, 193, 7, 0.1); }
    .bg-soft-info { background-color: rgba(13, 202, 240, 0.1); }
  `]
})
export class MouvementListComponent implements OnInit {
  private mouvementService = inject(MouvementService);
  private cdr = inject(ChangeDetectorRef);
  mouvements: MouvementStock[] = [];

  ngOnInit(): void {
    this.loadMouvements();
  }

  loadMouvements(): void {
    this.mouvementService.getAllMouvements().subscribe({
      next: (data) => {
        this.mouvements = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Erreur chargement mouvements', err)
    });
  }

  getTypeClass(type: TypeMouvement): string {
    switch (type) {
      case TypeMouvement.ENTREE: return 'bg-soft-success text-success';
      case TypeMouvement.SORTIE: return 'bg-soft-danger text-danger';
      case TypeMouvement.RETOUR: return 'bg-soft-info text-info';
      case TypeMouvement.CORRECTION: return 'bg-soft-warning text-warning';
      default: return 'bg-soft-secondary text-secondary';
    }
  }

  getTypeIcon(type: TypeMouvement): string {
    switch (type) {
      case TypeMouvement.ENTREE: return 'bi bi-arrow-down-left';
      case TypeMouvement.SORTIE: return 'bi bi-arrow-up-right';
      case TypeMouvement.RETOUR: return 'bi bi-arrow-left-right';
      case TypeMouvement.CORRECTION: return 'bi bi-wrench';
      default: return 'bi bi-dot';
    }
  }
}
