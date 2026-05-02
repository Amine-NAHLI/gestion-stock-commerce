import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
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
export class Login {

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
        if (err.status === 401) {
          this.errorMessage.set('Nom d\'utilisateur ou mot de passe incorrect');
        } else if (err.status === 0) {
          this.errorMessage.set('Impossible de joindre le serveur. Vérifiez que le backend est démarré.');
        } else {
          this.errorMessage.set('Erreur lors de la connexion : ' + (err.error?.message || err.message));
        }
      }
    });
  }
}