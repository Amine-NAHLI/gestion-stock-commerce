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
        <div class="modal-content bg-dark-soft border-secondary text-white shadow-lg">
          <div class="modal-header border-secondary">
            <h5 class="modal-title fw-bold">
              {{ isEdit ? 'Modifier' : 'Nouvel' }} Utilisateur
            </h5>
            <button type="button" class="btn-close btn-close-white" (click)="close.emit()"></button>
          </div>
          <div class="modal-body">
            <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label class="form-label text-muted small uppercase fw-bold">Nom d'utilisateur</label>
                <div class="input-group">
                  <span class="input-group-text bg-dark-light border-secondary text-muted">
                    <i class="bi bi-person"></i>
                  </span>
                  <input 
                    type="text" 
                    formControlName="username"
                    class="form-control bg-dark-light border-secondary text-white shadow-none"
                    placeholder="ex: jdoe"
                    [class.is-invalid]="submitted && f['username'].errors"
                  >
                </div>
                <div *ngIf="submitted && f['username'].errors" class="invalid-feedback d-block">
                  Le nom d'utilisateur est obligatoire (min 3 car.)
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label text-muted small uppercase fw-bold">Email</label>
                <div class="input-group">
                  <span class="input-group-text bg-dark-light border-secondary text-muted">
                    <i class="bi bi-envelope"></i>
                  </span>
                  <input 
                    type="email" 
                    formControlName="email"
                    class="form-control bg-dark-light border-secondary text-white shadow-none"
                    placeholder="ex: john@example.com"
                    [class.is-invalid]="submitted && f['email'].errors"
                  >
                </div>
                <div *ngIf="submitted && f['email'].errors" class="invalid-feedback d-block">
                  L'email est obligatoire et doit être valide
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label text-muted small uppercase fw-bold">Nom Complet</label>
                <input 
                  type="text" 
                  formControlName="nomComplet"
                  class="form-control bg-dark-light border-secondary text-white shadow-none"
                  placeholder="ex: John Doe"
                >
              </div>

              <div class="mb-3">
                <label class="form-label text-muted small uppercase fw-bold">Rôle</label>
                <div class="input-group">
                  <span class="input-group-text bg-dark-light border-secondary text-muted">
                    <i class="bi bi-shield-lock"></i>
                  </span>
                  <select 
                    formControlName="role"
                    class="form-select bg-dark-light border-secondary text-white shadow-none"
                  >
                    <option value="EMPLOYE">Employé</option>
                    <option value="GERANT">Gérant</option>
                    <option value="ADMIN">Administrateur</option>
                  </select>
                </div>
              </div>

              <div class="mb-3" *ngIf="!isEdit || showPassword">
                <label class="form-label text-muted small uppercase fw-bold">
                  Mot de passe {{ isEdit ? '(Nouveau)' : '' }}
                </label>
                <div class="input-group">
                  <span class="input-group-text bg-dark-light border-secondary text-muted">
                    <i class="bi bi-key"></i>
                  </span>
                  <input 
                    type="password" 
                    formControlName="password"
                    class="form-control bg-dark-light border-secondary text-white shadow-none"
                    placeholder="••••••••"
                    [class.is-invalid]="submitted && f['password'].errors"
                  >
                </div>
                <div *ngIf="submitted && f['password'].errors" class="invalid-feedback d-block">
                  Le mot de passe doit contenir au moins 6 caractères
                </div>
              </div>

              <div class="mb-3" *ngIf="isEdit">
                <button type="button" class="btn btn-sm btn-outline-secondary" (click)="showPassword = !showPassword">
                  <i class="bi" [ngClass]="showPassword ? 'bi-x-circle' : 'bi-pencil'"></i>
                  {{ showPassword ? 'Annuler le changement' : 'Changer le mot de passe' }}
                </button>
              </div>

              <div class="d-flex gap-2 justify-content-end mt-4">
                <button type="button" class="btn btn-outline-light" (click)="close.emit()">Annuler</button>
                <button type="submit" class="btn btn-primary d-flex align-items-center gap-2" [disabled]="loading">
                  <i class="bi bi-check-lg" *ngIf="!loading"></i>
                  <span class="spinner-border spinner-border-sm" *ngIf="loading"></span>
                  {{ isEdit ? 'Enregistrer' : 'Créer' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-dark-soft { background-color: #1a1a1a; }
    .bg-dark-light { background-color: #2a2a2a; }
    .border-secondary { border-color: rgba(255, 255, 255, 0.1) !important; }
    .modal-backdrop { opacity: 0.7; background-color: #000; }
    
    .form-control:focus, .form-select:focus {
      border-color: #3b82f6;
      background-color: #2d2d2d;
      color: white;
    }
    
    .invalid-feedback { font-size: 0.75rem; }
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
      password: ['', []] // Validators added in ngOnInit if needed
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
      // New user requires password
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
