import { CommonModule } from '@angular/common';
import { Component, inject, signal, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { LoginRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  private cdr = inject(ChangeDetectorRef);

  private authService = inject(AuthService);
  private router = inject(Router);

  // Données du formulaire
  credentials: LoginRequest = {
    username: '',
    password: ''
  };

  // États du composant
  isLoading = signal(false);
  errorMessage = signal('');

  // Démo accounts
  demoUsers: any[] = [];
  admins: any[] = [];
  gerants: any[] = [];
  employes: any[] = [];

  ngOnInit(): void {
    // Charger les utilisateurs de démo
    this.authService.getDemoUsers().subscribe({
      next: (users) => {
        this.demoUsers = users;
        this.admins = users.filter(u => u.role === 'ADMIN');
        this.gerants = users.filter(u => u.role === 'GERANT');
        this.employes = users.filter(u => u.role === 'EMPLOYE');
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Erreur chargement demo users', err)
    });
  }

  selectDemoUser(user: any): void {
    // Remplir visuellement les champs pour le style
    this.credentials.username = user.username;
    this.credentials.password = '••••••••';
    this.cdr.markForCheck();
    
    this.isLoading.set(true);
    this.errorMessage.set('');

    // Utiliser le nouveau endpoint de démo (bypass du mot de passe)
    this.authService.demoLogin(user.username).subscribe({
      next: (response) => {
        console.log('✅ Connexion démo réussie :', response);
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('❌ Erreur de connexion démo :', err);
        this.isLoading.set(false);
        this.errorMessage.set('Erreur lors de la connexion magique : ' + (err.error?.message || err.message));
        this.cdr.markForCheck();
      }
    });
  }

  /**
   * Soumission du formulaire de connexion
   */
  onSubmit(): void {
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage.set('Veuillez remplir tous les champs');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('✅ Connexion réussie :', response);
        this.isLoading.set(false);
        // Redirection vers le dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('❌ Erreur de connexion :', err);
        this.isLoading.set(false);
        
        const serverMessage = err.error?.message || '';
        
        if (serverMessage.toLowerCase().includes('désactivé')) {
          this.errorMessage.set('⚠️ VOTRE COMPTE EST DÉSACTIVÉ. Veuillez contacter l\'administrateur pour rétablir vos accès.');
        } else if (err.status === 401) {
          this.errorMessage.set('Nom d\'utilisateur ou mot de passe incorrect');
        } else if (err.status === 0) {
          this.errorMessage.set('Impossible de joindre le serveur. Vérifiez que le backend est démarré.');
        } else {
          this.errorMessage.set('Erreur lors de la connexion : ' + (serverMessage || err.message));
        }
        this.cdr.markForCheck();
      }
    });
  }
}