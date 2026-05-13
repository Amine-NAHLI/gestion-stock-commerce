import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user';
import { User as UserType } from '../../core/models/user.model';

@Component({
  selector: 'app-utilisateur-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="modal-backdrop fade show"></div>
    <div class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div class="modal-header border-0 bg-light p-4">
            <h4 class="modal-title fw-bold text-primary d-flex align-items-center gap-2">
              <i class="bi" [ngClass]="isEdit ? 'bi-person-gear' : 'bi-person-plus-fill'"></i>
              {{ isEdit ? 'Modifier' : 'Ajouter' }} un Utilisateur
            </h4>
            <button type="button" class="btn-close shadow-none" (click)="close.emit()"></button>
          </div>
          <div class="modal-body p-4 bg-white">
            <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label fw-semibold">Nom d'utilisateur *</label>
                  <input 
                    type="text" 
                    formControlName="username"
                    class="form-control rounded-3"
                    placeholder="ex: jean.dupont"
                    [class.is-invalid]="submitted && f['username'].errors"
                  >
                  <div *ngIf="submitted && f['username'].errors" class="invalid-feedback">
                    L'identifiant est obligatoire (min 3 car.)
                  </div>
                </div>

                <div class="col-12">
                  <label class="form-label fw-semibold">Adresse Email *</label>
                  <input 
                    type="email" 
                    formControlName="email"
                    class="form-control rounded-3"
                    placeholder="ex: jean@exemple.com"
                    [class.is-invalid]="submitted && f['email'].errors"
                  >
                  <div *ngIf="submitted && f['email'].errors" class="invalid-feedback">
                    Veuillez saisir un email valide
                  </div>
                </div>

                <div class="col-12">
                  <label class="form-label fw-semibold">Nom Complet</label>
                  <input 
                    type="text" 
                    formControlName="nomComplet"
                    class="form-control rounded-3"
                    placeholder="ex: Jean Dupont"
                  >
                </div>

                <div class="col-12">
                  <label class="form-label fw-semibold">Rôle *</label>
                  <select 
                    formControlName="role"
                    class="form-select rounded-3 shadow-none"
                  >
                    <option value="EMPLOYE">Employé</option>
                    <option value="GERANT">Gérant</option>
                    <option value="ADMIN">Administrateur</option>
                  </select>
                </div>

                <div class="col-12" *ngIf="!isEdit || showPassword">
                  <label class="form-label fw-semibold">
                    {{ isEdit ? 'Nouveau mot de passe' : 'Mot de passe *' }}
                  </label>
                  <input 
                    type="password" 
                    formControlName="password"
                    class="form-control rounded-3 shadow-none"
                    placeholder="••••••••"
                    [class.is-invalid]="submitted && f['password'].errors"
                  >
                  <div *ngIf="submitted && f['password'].errors" class="invalid-feedback">
                    Minimum 6 caractères requis
                  </div>
                </div>

                <div class="col-12 mt-2" *ngIf="isEdit">
                  <button type="button" class="btn btn-sm btn-link text-primary text-decoration-none p-0" (click)="showPassword = !showPassword">
                    <i class="bi" [ngClass]="showPassword ? 'bi-dash-circle' : 'bi-plus-circle'"></i>
                    {{ showPassword ? 'Annuler le changement' : 'Changer le mot de passe' }}
                  </button>
                </div>
              </div>

              <div class="d-flex gap-2 justify-content-end mt-4 pt-3 border-top">
                <button type="button" class="btn btn-light px-4 rounded-3" (click)="close.emit()">Annuler</button>
                <button type="submit" class="btn btn-primary px-4 rounded-3 shadow-sm d-flex align-items-center gap-2" [disabled]="loading">
                  <span class="spinner-border spinner-border-sm" *ngIf="loading"></span>
                  <i class="bi bi-check2-circle" *ngIf="!loading"></i>
                  {{ isEdit ? 'Mettre à jour' : 'Enregistrer' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-content { border: none; }
    .modal-backdrop { opacity: 0.5; background-color: #0f172a; }
    
    .form-label { font-size: 0.9rem; color: #475569; }
    
    .form-control, .form-select {
      border: 1px solid #e2e8f0;
      padding: 0.625rem 0.875rem;
      
      &:focus {
        border-color: #6366f1;
        box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
      }
    }
    
    .btn-primary {
      background-color: #6366f1;
      border-color: #6366f1;
    }
  `]
})
export class UtilisateurFormComponent implements OnInit {
  @Input() user?: UserType;
  @Input() isEdit: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<UserType>();

  userForm: FormGroup;
  submitted = false;
  loading = false;
  showPassword = false;

  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  constructor() {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      nomComplet: [''],
      role: ['EMPLOYE', Validators.required],
      password: ['', []]
    });
  }

  ngOnInit() {
    if (this.isEdit && this.user) {
      this.userForm.patchValue({
        username: this.user.username,
        email: this.user.email,
        nomComplet: this.user.nomComplet,
        role: this.user.role
      });
    } else {
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  get f() { return this.userForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.userForm.invalid) {
      return;
    }

    this.loading = true;
    const userData = this.userForm.value;

    if (this.isEdit) {
      this.userService.updateUser(this.user!.id!, userData).subscribe({
        next: (res) => {
          this.saved.emit(res);
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
    } else {
      this.userService.createUser(userData).subscribe({
        next: (res) => {
          this.saved.emit(res);
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
    }
  }
}
