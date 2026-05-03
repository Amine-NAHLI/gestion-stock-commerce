import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProduitService } from '../../../core/services/produit.service';
import { Categorie } from '../../../core/models/produit.model';

@Component({
  selector: 'app-categorie-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-lg-6">
          <div class="d-flex align-items-center mb-4">
            <a routerLink="/categories" class="btn btn-outline-secondary btn-sm rounded-circle me-3">
              <i class="bi bi-arrow-left"></i>
            </a>
            <h2 class="fw-bold mb-0 text-primary">{{ isEdit ? 'Modifier' : 'Ajouter' }} une Catégorie</h2>
          </div>

          <div class="card border-0 shadow-sm rounded-4 p-4">
            <form (ngSubmit)="saveCategorie()" #categorieForm="ngForm">
              <div class="mb-3">
                <label class="form-label fw-semibold">Nom de la catégorie *</label>
                <input type="text" name="nom" [(ngModel)]="categorie.nom" class="form-control rounded-3 py-2" required placeholder="ex: Alimentation, Boissons, Entretien">
              </div>

              <div class="mb-4">
                <label class="form-label fw-semibold">Description</label>
                <textarea name="description" [(ngModel)]="categorie.description" class="form-control rounded-3" rows="4" placeholder="Décrivez brièvement cette catégorie..."></textarea>
              </div>

              <div class="d-flex justify-content-end gap-2 pt-3 border-top">
                <button type="button" routerLink="/categories" class="btn btn-light px-4">Annuler</button>
                <button type="submit" [disabled]="categorieForm.invalid" class="btn btn-primary px-5 shadow-sm">
                  <i class="bi bi-check2-circle me-2"></i>{{ isEdit ? 'Mettre à jour' : 'Enregistrer' }}
                </button>
              </div>
            </form>
          </div>
          
          <div class="mt-4 p-3 bg-light rounded-4 small text-muted">
            <i class="bi bi-info-circle me-2"></i>
            Les catégories vous aident à organiser vos produits et à générer des rapports plus précis par secteur d'activité.
          </div>
        </div>
      </div>
    </div>
  `
})
export class CategorieFormComponent implements OnInit {
  private produitService = inject(ProduitService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  categorie: Categorie = {
    nom: '',
    description: ''
  };

  isEdit = false;

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.produitService.getCategorieById(id).subscribe({
        next: (cat) => {
          this.categorie = cat;
          this.cdr.markForCheck();
        },
        error: (err) => console.error('Erreur chargement catégorie', err)
      });
    }
  }

  saveCategorie(): void {
    const obs = this.isEdit 
      ? this.produitService.updateCategorie(this.categorie.id!, this.categorie)
      : this.produitService.createCategorie(this.categorie);

    obs.subscribe({
      next: () => this.router.navigate(['/categories']),
      error: (err) => console.error('Erreur lors de la sauvegarde', err)
    });
  }
}
