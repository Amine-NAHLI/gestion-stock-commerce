import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../core/models/client.model';

/**
 * Composant formulaire client.
 * Gère la création et la modification d'un client.
 */
@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container-fluid py-4">
      <div class="mb-5">
        <h1 class="display-font text-dark mb-1">{{ isEditMode ? 'Modifier le Client' : 'Nouveau Client' }}</h1>
        <p class="text-secondary mb-0">{{ isEditMode ? 'Modifiez les informations du client.' : 'Remplissez les informations du nouveau client.' }}</p>
      </div>

      <div class="card-premium p-4 border-0" style="max-width:700px">
        <form (ngSubmit)="onSubmit()" #clientForm="ngForm">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label fw-bold">Nom <span class="text-danger">*</span></label>
              <input type="text" class="form-control" [(ngModel)]="client.nom" name="nom" required
                     placeholder="Nom du client">
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label fw-bold">Prénom</label>
              <input type="text" class="form-control" [(ngModel)]="client.prenom" name="prenom"
                     placeholder="Prénom du client">
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label fw-bold">Email</label>
              <input type="email" class="form-control" [(ngModel)]="client.email" name="email"
                     placeholder="email@exemple.com">
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label fw-bold">Téléphone</label>
              <input type="text" class="form-control" [(ngModel)]="client.telephone" name="telephone"
                     placeholder="+212 6XX XXX XXX">
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label fw-bold">Adresse</label>
            <textarea class="form-control" [(ngModel)]="client.adresse" name="adresse" rows="2"
                      placeholder="Adresse complète"></textarea>
          </div>
          <div class="d-flex gap-3 mt-4">
            <button type="submit" class="btn btn-primary px-4" [disabled]="!clientForm.valid">
              <i class="bi" [ngClass]="isEditMode ? 'bi-check-lg' : 'bi-plus-lg'"></i>
              {{ isEditMode ? 'Enregistrer' : 'Créer' }}
            </button>
            <a routerLink="/clients" class="btn btn-outline-secondary px-4">Annuler</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ClientFormComponent implements OnInit {
  private clientService = inject(ClientService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  client: Client = { nom: '' };
  isEditMode = false;

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.clientService.getClientById(+id).subscribe({
        next: (data) => this.client = data,
        error: (err) => console.error('Erreur chargement client', err)
      });
    }
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.clientService.updateClient(this.client.id!, this.client).subscribe({
        next: () => this.router.navigate(['/clients']),
        error: (err) => console.error('Erreur modification', err)
      });
    } else {
      this.clientService.createClient(this.client).subscribe({
        next: () => this.router.navigate(['/clients']),
        error: (err) => console.error('Erreur création', err)
      });
    }
  }
}
