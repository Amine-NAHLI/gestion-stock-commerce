import { Component, inject , ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportService } from '../../../core/services/export.service';

/**
 * Composant rapports et export Excel.
 * Permet de télécharger les données de chaque module au format .xlsx.
 */
@Component({
  selector: 'app-export-rapport',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid py-4">
      <div class="mb-5">
        <h1 class="display-font text-dark mb-1">Rapports & Export</h1>
        <p class="text-secondary mb-0">Téléchargez vos données au format Excel pour vos analyses.</p>
      </div>

      <div class="row g-4">
        <div class="col-md-4" *ngFor="let item of exportItems">
          <div class="card-premium p-4 border-0 h-100">
            <div class="d-flex align-items-center mb-3">
              <div class="icon-box me-3" [style.background]="item.bgColor">
                <i class="bi {{ item.icon }} fs-4" [style.color]="item.color"></i>
              </div>
              <div>
                <h5 class="fw-bold mb-0">{{ item.label }}</h5>
                <p class="text-secondary small mb-0">{{ item.description }}</p>
              </div>
            </div>
            <button class="btn btn-outline-primary w-100 mt-3" (click)="exportExcel(item.type)"
                    [disabled]="loading === item.type">
              <i class="bi" [ngClass]="loading === item.type ? 'bi-hourglass-split' : 'bi-file-earmark-excel'"></i>
              {{ loading === item.type ? 'Export en cours...' : 'Télécharger Excel' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .icon-box {
      width: 52px; height: 52px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
  `]
})
export class ExportRapportComponent {
  private cdr = inject(ChangeDetectorRef);
  private exportService = inject(ExportService);
  loading: string | null = null;

  exportItems = [
    {
      type: 'produits' as const, label: 'Produits', icon: 'bi-box-seam',
      description: 'Liste complète des produits avec stock et prix.',
      bgColor: '#eef2ff', color: '#6366f1'
    },
    {
      type: 'fournisseurs' as const, label: 'Fournisseurs', icon: 'bi-truck',
      description: 'Coordonnées de tous vos fournisseurs.',
      bgColor: '#fff7ed', color: '#ea580c'
    },
    {
      type: 'commandes' as const, label: 'Commandes', icon: 'bi-cart-check',
      description: 'Historique des commandes fournisseurs.',
      bgColor: '#eff6ff', color: '#2563eb'
    },
    {
      type: 'clients' as const, label: 'Clients', icon: 'bi-people',
      description: 'Base de données de vos clients.',
      bgColor: '#f0fdf4', color: '#16a34a'
    },
    {
      type: 'ventes' as const, label: 'Ventes', icon: 'bi-receipt',
      description: 'Historique de toutes les ventes réalisées.',
      bgColor: '#fdf2f8', color: '#db2777'
    }
  ];

  exportExcel(type: 'produits' | 'fournisseurs' | 'commandes' | 'clients' | 'ventes'): void {
    this.loading = type;
    this.exportService.exportExcel(type);
    // Réinitialiser après un court délai (le téléchargement est asynchrone)
    setTimeout(() => this.loading = null, 2000);
  }
}
