import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../core/models/client.model';

/**
 * Composant liste des clients.
 * Affiche un tableau de tous les clients avec actions CRUD.
 */
@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h1 class="display-font text-dark mb-1">Clients</h1>
          <p class="text-secondary mb-0">Gérez votre base de clients.</p>
        </div>
        <a routerLink="new" class="btn btn-primary shadow-sm px-4 py-2">
          <i class="bi bi-plus-lg"></i>
          <span>Nouveau Client</span>
        </a>
      </div>

      <div class="card-premium overflow-hidden border-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light text-secondary small text-uppercase fw-bold" style="letter-spacing:0.05em">
              <tr>
                <th class="ps-4 py-3">Client</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Adresse</th>
                <th class="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody class="border-top-0">
              <tr *ngFor="let c of clients" class="transition-all">
                <td class="ps-4">
                  <div class="d-flex align-items-center py-2">
                    <div class="bg-light rounded-4 p-1 me-3 d-flex align-items-center justify-content-center shadow-sm"
                         style="width:42px;height:42px;">
                      <i class="bi bi-person-fill fs-5 text-primary"></i>
                    </div>
                    <div>
                      <div class="fw-bold text-dark">{{ c.nom }} {{ c.prenom }}</div>
                    </div>
                  </div>
                </td>
                <td>{{ c.email || '—' }}</td>
                <td>{{ c.telephone || '—' }}</td>
                <td class="text-truncate" style="max-width:200px">{{ c.adresse || '—' }}</td>
                <td class="text-end pe-4">
                  <div class="d-flex justify-content-end gap-2">
                    <a [routerLink]="['edit', c.id]" class="btn-action action-edit" title="Modifier">
                      <i class="bi bi-pencil-square"></i>
                    </a>
                    <button (click)="deleteClient(c.id!)" class="btn-action action-delete" title="Supprimer">
                      <i class="bi bi-trash3-fill"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="clients.length === 0">
                <td colspan="5" class="text-center py-5">
                  <div class="py-5">
                    <i class="bi bi-people display-1 text-light mb-4 d-block"></i>
                    <h4 class="text-secondary">Aucun client</h4>
                    <p class="text-muted">Commencez par ajouter votre premier client.</p>
                    <a routerLink="new" class="btn btn-primary mt-3 px-4">
                      <i class="bi bi-plus-lg"></i> Ajouter un client
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
      &.action-edit:hover { color: #d97706; border-color: #fef3c7; background: #fffbeb; }
      &.action-delete:hover { color: #dc2626; border-color: #fee2e2; background: #fef2f2; }
    }
  `]
})
export class ClientListComponent implements OnInit {
  private clientService = inject(ClientService);
  private cdr = inject(ChangeDetectorRef);
  clients: Client[] = [];

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Erreur chargement clients', err)
    });
  }

  deleteClient(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.clientService.deleteClient(id).subscribe({
        next: () => this.loadClients(),
        error: (err) => console.error('Erreur suppression', err)
      });
    }
  }
}
