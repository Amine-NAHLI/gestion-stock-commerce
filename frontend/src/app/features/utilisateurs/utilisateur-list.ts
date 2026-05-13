import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user';
import { User } from '../../core/models/user.model';
import { UtilisateurFormComponent } from './utilisateur-form';

@Component({
  selector: 'app-utilisateur-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, UtilisateurFormComponent],
  template: `
    <div class="container py-4">
      <!-- En-tête -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h3 mb-1 fw-bold text-white">Gestion des Utilisateurs</h1>
          <p class="text-muted mb-0">Gérez les accès et les comptes du système</p>
        </div>
        <button class="btn btn-primary d-flex align-items-center gap-2 shadow-sm" (click)="openAddModal()">
          <i class="bi bi-person-plus fs-5"></i>
          Nouvel Utilisateur
        </button>
      </div>

      <!-- Filtres et Recherche -->
      <div class="card bg-dark-soft border-secondary mb-4 shadow-sm">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-8">
              <div class="input-group">
                <span class="input-group-text bg-dark-light border-secondary text-muted">
                  <i class="bi bi-search"></i>
                </span>
                <input 
                  type="text" 
                  class="form-control bg-dark-light border-secondary text-white shadow-none" 
                  placeholder="Rechercher par nom, email ou rôle..."
                  [(ngModel)]="searchTerm"
                  (input)="filterUsers()"
                >
              </div>
            </div>
            <div class="col-md-4">
              <select class="form-select bg-dark-light border-secondary text-white shadow-none" [(ngModel)]="roleFilter" (change)="filterUsers()">
                <option value="">Tous les rôles</option>
                <option value="ADMIN">Administrateur</option>
                <option value="GERANT">Gérant</option>
                <option value="EMPLOYE">Employé</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des utilisateurs -->
      <div class="row g-4">
        <div class="col-md-6 col-lg-4" *ngFor="let user of filteredUsers">
          <div class="card h-100 bg-dark-soft border-secondary user-card">
            <div class="card-body">
              <div class="d-flex align-items-start justify-content-between mb-3">
                <div class="d-flex align-items-center gap-3">
                  <div class="user-avatar" [ngClass]="user.role.toLowerCase()">
                    {{ user.username.substring(0, 2).toUpperCase() }}
                  </div>
                  <div>
                    <h5 class="card-title mb-0 text-white">{{ user.nomComplet || user.username }}</h5>
                    <span class="badge" [ngClass]="getRoleBadgeClass(user.role)">
                      <i class="bi" [ngClass]="user.role === 'ADMIN' ? 'bi-shield-check' : 'bi-shield'"></i>
                      {{ user.role }}
                    </span>
                  </div>
                </div>
                <div class="dropdown">
                  <button class="btn btn-link text-muted p-0 shadow-none" data-bs-toggle="dropdown">
                    <i class="bi bi-three-dots-vertical fs-5"></i>
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark shadow">
                    <li><a class="dropdown-item" href="javascript:void(0)" (click)="editUser(user)">Modifier</a></li>
                    <li><a class="dropdown-item" href="javascript:void(0)" (click)="toggleStatus(user)">
                      {{ user.actif ? 'Désactiver' : 'Activer' }}
                    </a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="javascript:void(0)" (click)="deleteUser(user)">Supprimer</a></li>
                  </ul>
                </div>
              </div>

              <div class="user-info">
                <div class="d-flex align-items-center gap-2 mb-2 text-muted small">
                  <i class="bi bi-envelope"></i>
                  {{ user.email }}
                </div>
                <div class="d-flex align-items-center gap-2 mb-2 text-muted small">
                  <i class="bi bi-calendar3"></i>
                  Inscrit le : {{ user.dateCreation | date:'dd/MM/yyyy' }}
                </div>
                <div class="d-flex align-items-center gap-2 text-muted small">
                  <i class="bi bi-activity"></i>
                  Statut : 
                  <span [ngClass]="user.actif ? 'text-success' : 'text-danger'" class="fw-bold">
                    {{ user.actif ? 'Actif' : 'Inactif' }}
                  </span>
                </div>
              </div>
            </div>
            <div class="card-footer bg-transparent border-secondary border-0 pt-0 pb-3">
               <div class="d-flex gap-2 px-3">
                 <button class="btn btn-outline-light btn-sm flex-grow-1" (click)="editUser(user)">Détails / Modifier</button>
               </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="text-center py-5 mt-4" *ngIf="filteredUsers.length === 0">
        <div class="mb-3 text-muted">
          <i class="bi bi-person-x" style="font-size: 4rem;"></i>
        </div>
        <h4 class="text-white">Aucun utilisateur trouvé</h4>
        <p class="text-muted">Essayez de modifier vos filtres ou créez un nouvel utilisateur.</p>
      </div>

      <!-- Form Modal -->
      <app-utilisateur-form
        *ngIf="showForm"
        [user]="selectedUser"
        [isEdit]="isEdit"
        (close)="showForm = false"
        (saved)="onUserSaved($event)"
      ></app-utilisateur-form>
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; }
    
    .bg-dark-soft { background-color: #1a1a1a; }
    .bg-dark-light { background-color: #2a2a2a; }
    .border-secondary { border-color: rgba(255, 255, 255, 0.1) !important; }
    
    .user-card {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      border-radius: 16px;
    }
    
    .user-card:hover {
      transform: translateY(-5px);
      border-color: #3b82f6 !important;
      box-shadow: 0 12px 30px rgba(0,0,0,0.4) !important;
    }
    
    .user-avatar {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: white;
      font-size: 1.2rem;
    }
    
    .user-avatar.admin { background: linear-gradient(135deg, #ef4444, #991b1b); }
    .user-avatar.gerant { background: linear-gradient(135deg, #3b82f6, #1e40af); }
    .user-avatar.employe { background: linear-gradient(135deg, #10b981, #065f46); }
    
    .badge {
      font-weight: 600;
      padding: 0.5em 1em;
      border-radius: 8px;
      font-size: 0.75rem;
      letter-spacing: 0.5px;
    }
    
    .badge-admin { background-color: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
    .badge-gerant { background-color: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
    .badge-employe { background-color: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
    
    .form-control, .form-select {
      height: 48px;
      border-radius: 10px;
    }
    
    .form-control:focus, .form-select:focus {
      border-color: #3b82f6;
      background-color: #2d2d2d;
      color: white;
    }
  `]
})
export class UtilisateurListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  roleFilter: string = '';

  // Form state
  showForm = false;
  isEdit = false;
  selectedUser?: User;

  private userService = inject(UserService);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filterUsers();
      },
      error: (err) => console.error('Erreur lors du chargement des utilisateurs', err)
    });
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = 
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (user.nomComplet && user.nomComplet.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesRole = this.roleFilter === '' || user.role === this.roleFilter;
      
      return matchesSearch && matchesRole;
    });
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'ADMIN': return 'badge-admin';
      case 'GERANT': return 'badge-gerant';
      default: return 'badge-employe';
    }
  }

  openAddModal(): void {
    this.isEdit = false;
    this.selectedUser = undefined;
    this.showForm = true;
  }

  editUser(user: User): void {
    this.isEdit = true;
    this.selectedUser = user;
    this.showForm = true;
  }

  onUserSaved(user: User): void {
    this.showForm = false;
    this.loadUsers(); // Recharger la liste
  }

  toggleStatus(user: User): void {
    if (confirm(`Voulez-vous ${user.actif ? 'désactiver' : 'activer'} l'utilisateur ${user.username} ?`)) {
      this.userService.toggleStatus(user.id!).subscribe({
        next: (updated) => {
          user.actif = updated.actif;
          this.filterUsers();
        },
        error: (err) => console.error('Erreur lors du changement de statut', err)
      });
    }
  }

  deleteUser(user: User): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer définitivement l'utilisateur ${user.username} ?`)) {
      this.userService.deleteUser(user.id!).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== user.id);
          this.filterUsers();
        },
        error: (err) => console.error('Erreur lors de la suppression', err)
      });
    }
  }
}
