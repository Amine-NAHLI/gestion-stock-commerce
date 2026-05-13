import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
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
    <div class="container-fluid py-4">
      <!-- En-tête -->
      <div class="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h1 class="display-font text-dark mb-1">Gestion des Utilisateurs</h1>
          <p class="text-secondary mb-0">Administrez les accès, les rôles et les demandes d'inscription.</p>
        </div>
        <button class="btn btn-primary shadow-sm px-4 py-2" (click)="openAddModal()">
          <i class="bi bi-person-plus-fill"></i>
          <span>Nouvel Utilisateur</span>
        </button>
      </div>

      <!-- Onglets -->
      <ul class="nav nav-pills mb-4 gap-2">
        <li class="nav-item">
          <button class="nav-link px-4 py-2 rounded-3 fw-bold" [class.active]="activeTab === 'users'" (click)="setTab('users')">
            <i class="bi bi-people-fill me-2"></i>Utilisateurs
          </button>
        </li>
        <li class="nav-item position-relative">
          <button class="nav-link px-4 py-2 rounded-3 fw-bold" [class.active]="activeTab === 'requests'" (click)="setTab('requests')">
            <i class="bi bi-person-badge-fill me-2"></i>Demandes d'inscription
            <span *ngIf="pendingRequests.length > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {{ pendingRequests.length }}
            </span>
          </button>
        </li>
      </ul>

      <!-- Filtres et Recherche -->
      <div class="card-premium p-4 mb-4 border-0">
        <div class="row g-3 align-items-center">
          <div class="col-md-8">
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0 text-secondary pe-0">
                <i class="bi bi-search"></i>
              </span>
              <input 
                type="text" 
                class="form-control bg-light border-start-0 shadow-none ps-2" 
                placeholder="Rechercher par nom, email..."
                [(ngModel)]="searchTerm"
                (input)="filterUsers()"
              >
            </div>
          </div>
          <div class="col-md-4">
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0 text-secondary pe-0">
                <i class="bi bi-funnel"></i>
              </span>
              <select class="form-select bg-light border-start-0 shadow-none ps-2" [(ngModel)]="roleFilter" (change)="filterUsers()">
                <option value="">Tous les rôles</option>
                <option value="ADMIN">Administrateur</option>
                <option value="GERANT">Gérant</option>
                <option value="EMPLOYE">Employé</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des utilisateurs (Tableau) -->
      <div class="card-premium overflow-hidden border-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light text-secondary small text-uppercase fw-bold letter-spacing-1">
              <tr>
                <th class="ps-4 py-3">Utilisateur</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>{{ activeTab === 'users' ? "Date d'inscription" : "Date de demande" }}</th>
                <th>Statut</th>
                <th class="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody class="border-top-0">
              <tr *ngFor="let user of displayedUsers" class="transition-all">
                <td class="ps-4">
                  <div class="d-flex align-items-center py-2">
                    <div class="user-avatar shadow-sm me-3" [ngClass]="user.role.toLowerCase()">
                      {{ user.username.substring(0, 2).toUpperCase() }}
                    </div>
                    <div>
                      <div class="fw-bold text-dark fs-6">{{ user.nomComplet || user.username }}</div>
                      <div class="text-secondary small">@{{ user.username }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="text-dark fw-medium">{{ user.email }}</span>
                </td>
                <td>
                  <span class="badge-role" [ngClass]="getRoleBadgeClass(user.role)">
                    <i class="bi" [ngClass]="user.role === 'ADMIN' ? 'bi-shield-fill-check' : 'bi-shield-fill'"></i>
                    {{ user.role }}
                  </span>
                </td>
                <td>
                  <span class="text-secondary small">{{ user.dateCreation | date:'dd/MM/yyyy HH:mm' }}</span>
                </td>
                <td>
                  <ng-container *ngIf="activeTab === 'users'">
                    <span [ngClass]="user.actif ? 'status-pill-success' : 'status-pill-danger'">
                      <span class="dot"></span>
                      {{ user.actif ? 'Actif' : 'Inactif' }}
                    </span>
                  </ng-container>
                  <ng-container *ngIf="activeTab === 'requests'">
                    <span class="status-pill-warning">
                      <span class="dot"></span>
                      En attente
                    </span>
                  </ng-container>
                </td>
                <td class="text-end pe-4">
                  <div class="d-flex justify-content-end gap-2">
                    <!-- Actions pour utilisateurs classiques -->
                    <ng-container *ngIf="activeTab === 'users'">
                      <button (click)="editUser(user)" class="btn-action action-edit" title="Modifier">
                        <i class="bi bi-pencil-square"></i>
                      </button>
                      <button (click)="toggleStatus(user)" class="btn-action action-view" [title]="user.actif ? 'Désactiver' : 'Activer'">
                        <i class="bi" [ngClass]="user.actif ? 'bi-person-x-fill' : 'bi-person-check-fill'"></i>
                      </button>
                      <button (click)="deleteUser(user)" class="btn-action action-delete" title="Supprimer">
                        <i class="bi bi-trash3-fill"></i>
                      </button>
                    </ng-container>

                    <!-- Actions pour demandes d'inscription -->
                    <ng-container *ngIf="activeTab === 'requests'">
                      <button (click)="approveUser(user)" class="btn btn-success btn-sm rounded-3 px-3 shadow-sm d-flex align-items-center gap-1">
                        <i class="bi bi-check-circle-fill"></i> Accepter
                      </button>
                      <button (click)="rejectUser(user)" class="btn btn-outline-danger btn-sm rounded-3 px-3 d-flex align-items-center gap-1">
                        <i class="bi bi-x-circle-fill"></i> Refuser
                      </button>
                    </ng-container>
                  </div>
                </td>
              </tr>
              <tr *ngIf="displayedUsers.length === 0">
                <td colspan="6" class="text-center py-5">
                  <div class="py-4 text-center">
                    <i class="bi bi-people text-light display-1 mb-3 d-block opacity-50"></i>
                    <h4 class="text-secondary">Aucun résultat</h4>
                    <p class="text-muted">Il n'y a actuellement aucune donnée dans cette section.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
    .letter-spacing-1 { letter-spacing: 0.05em; }
    
    .nav-pills .nav-link {
      background: #f8fafc;
      color: #64748b;
      border: 1px solid #e2e8f0;
      transition: all 0.2s;
    }
    
    .nav-pills .nav-link.active {
      background: #6366f1;
      color: white;
      border-color: #6366f1;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }

    .user-avatar {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: white;
      font-size: 1rem;
    }
    
    .user-avatar.admin { background: linear-gradient(135deg, #f87171, #ef4444); }
    .user-avatar.gerant { background: linear-gradient(135deg, #60a5fa, #3b82f6); }
    .user-avatar.employe { background: linear-gradient(135deg, #34d399, #10b981); }

    .badge-role {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 0.35rem 0.75rem;
      border-radius: 8px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      
      &.badge-admin { background: #fef2f2; color: #dc2626; border: 1px solid #fee2e2; }
      &.badge-gerant { background: #eff6ff; color: #2563eb; border: 1px solid #dbeafe; }
      &.badge-employe { background: #f0fdf4; color: #16a34a; border: 1px solid #dcfce7; }
    }

    .status-pill-success, .status-pill-danger, .status-pill-warning {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.6rem;
      border-radius: 100px;
      
      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
      }
    }
    
    .status-pill-success {
      color: #16a34a;
      background: #f0fdf4;
      .dot { background: #16a34a; box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.2); }
    }
    
    .status-pill-danger {
      color: #dc2626;
      background: #fef2f2;
      .dot { background: #dc2626; box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.2); }
    }

    .status-pill-warning {
      color: #d97706;
      background: #fffbeb;
      .dot { background: #d97706; box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.2); }
    }

    .btn-action {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #f1f5f9;
      background: white;
      color: #64748b;
      transition: all 0.2s;
      text-decoration: none;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
      }
      
      &.action-view:hover { color: #6366f1; border-color: #6366f1; background: #eef2ff; }
      &.action-edit:hover { color: #d97706; border-color: #fef3c7; background: #fffbeb; }
      &.action-delete:hover { color: #dc2626; border-color: #fee2e2; background: #fef2f2; }
    }

    .input-group-text {
      border: 1px solid #e2e8f0;
      border-radius: 0.75rem 0 0 0.75rem;
    }
  `]
})
export class UtilisateurListComponent implements OnInit {
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  users: User[] = [];
  displayedUsers: User[] = [];
  pendingRequests: User[] = [];
  
  activeTab: 'users' | 'requests' = 'users';
  searchTerm: string = '';
  roleFilter: string = '';

  // Form state
  showForm = false;
  isEdit = false;
  selectedUser?: User;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filterUsers();
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Erreur lors du chargement des utilisateurs', err)
    });
  }

  setTab(tab: 'users' | 'requests'): void {
    this.activeTab = tab;
    this.filterUsers();
  }

  filterUsers(): void {
    // 1. Filtrer les demandes en attente (indépendamment de l'affichage)
    this.pendingRequests = this.users.filter(u => u.enAttenteApprobation === true);

    // 2. Filtrer la liste à afficher selon l'onglet
    let sourceList = this.activeTab === 'users' 
      ? this.users.filter(u => u.enAttenteApprobation !== true)
      : this.pendingRequests;

    this.displayedUsers = sourceList.filter(user => {
      const matchesSearch = 
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (user.nomComplet && user.nomComplet.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesRole = this.roleFilter === '' || user.role === this.roleFilter;
      
      return matchesSearch && matchesRole;
    });
    this.cdr.markForCheck();
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
    this.cdr.markForCheck();
  }

  editUser(user: User): void {
    this.isEdit = true;
    this.selectedUser = user;
    this.showForm = true;
    this.cdr.markForCheck();
  }

  onUserSaved(user: User): void {
    this.showForm = false;
    this.loadUsers();
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

  approveUser(user: User): void {
    if (confirm(`Accepter la demande d'inscription de ${user.username} ?`)) {
      this.userService.approveUser(user.id!).subscribe({
        next: () => {
          this.loadUsers(); // Recharger tout
        },
        error: (err) => console.error('Erreur approbation', err)
      });
    }
  }

  rejectUser(user: User): void {
    if (confirm(`Refuser et supprimer la demande de ${user.username} ?`)) {
      this.userService.rejectUser(user.id!).subscribe({
        next: () => {
          this.loadUsers(); // Recharger tout
        },
        error: (err) => console.error('Erreur rejet', err)
      });
    }
  }
}
