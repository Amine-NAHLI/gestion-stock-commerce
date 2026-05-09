import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FournisseurService } from '../../../core/services/fournisseur.service';
import { Fournisseur } from '../../../core/models/fournisseur.model';

/**
 * Composant formulaire fournisseur.
 * Gère la création et la modification d'un fournisseur.
 */
@Component({
  selector: 'app-fournisseur-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container-fluid py-4">
      <div class="mb-5">
        <h1 class="display-font text-dark mb-1">{{ isEditMode ? 'Modifier le Fournisseur' : 'Nouveau Fournisseur' }}</h1>
        <p class="text-secondary mb-0">{{ isEditMode ? 'Modifiez les informations du fournisseur.' : 'Remplissez les informations du nouveau fournisseur.' }}</p>
      </div>

      <div class="card-premium p-4 border-0" style="max-width:700px">
        <form (ngSubmit)="onSubmit()" #fournisseurForm="ngForm">
          <div class="mb-3">
            <label class="form-label fw-bold">Nom <span class="text-danger">*</span></label>
            <input type="text" class="form-control" [(ngModel)]="fournisseur.nom" name="nom" required
                   placeholder="Nom du fournisseur">
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label fw-bold">Email</label>
              <input type="email" class="form-control" [(ngModel)]="fournisseur.email" name="email"
                     placeholder="email@exemple.com">
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label fw-bold">Téléphone</label>
              <input type="text" class="form-control" [(ngModel)]="fournisseur.telephone" name="telephone"
                     placeholder="+212 6XX XXX XXX">
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label fw-bold">Adresse</label>
            <textarea class="form-control" [(ngModel)]="fournisseur.adresse" name="adresse" rows="2"
                      placeholder="Adresse complète"></textarea>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label fw-bold">Ville</label>
              <input type="text" class="form-control" [(ngModel)]="fournisseur.ville" name="ville"
                     placeholder="Ville">
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label fw-bold">Pays</label>
              <input type="text" class="form-control" [(ngModel)]="fournisseur.pays" name="pays"
                     placeholder="Pays">
            </div>
          </div>
          <div class="d-flex gap-3 mt-4">
            <button type="submit" class="btn btn-primary px-4" [disabled]="!fournisseurForm.valid">
              <i class="bi" [ngClass]="isEditMode ? 'bi-check-lg' : 'bi-plus-lg'"></i>
              {{ isEditMode ? 'Enregistrer' : 'Créer' }}
            </button>
            <a routerLink="/fournisseurs" class="btn btn-outline-secondary px-4">Annuler</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class FournisseurFormComponent implements OnInit {
  private fournisseurService = inject(FournisseurService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  fournisseur: Fournisseur = { nom: '' };
  isEditMode = false;

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.fournisseurService.getFournisseurById(+id).subscribe({
        next: (data) => this.fournisseur = data,
        error: (err) => console.error('Erreur chargement fournisseur', err)
      });
    }
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.fournisseurService.updateFournisseur(this.fournisseur.id!, this.fournisseur).subscribe({
        next: () => this.router.navigate(['/fournisseurs']),
        error: (err) => console.error('Erreur modification', err)
      });
    } else {
      this.fournisseurService.createFournisseur(this.fournisseur).subscribe({
        next: () => this.router.navigate(['/fournisseurs']),
        error: (err) => console.error('Erreur création', err)
      });
    }
  }
}
