import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { RegisterRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  private authService = inject(AuthService);
  private router = inject(Router);

  // Données du formulaire
  data: RegisterRequest = {
    username: '',
    email: '',
    password: '',
    nomComplet: '',
    role: 'EMPLOYE'
  };

  // Confirmation du mot de passe
  confirmPassword = '';

  // États du composant
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  /**
   * Soumission du formulaire d'inscription
   */
  onSubmit(): void {
    // Validation côté client
    if (!this.data.username || !this.data.email || !this.data.password) {
      this.errorMessage.set('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (this.data.password.length < 6) {
      this.errorMessage.set('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (this.data.password !== this.confirmPassword) {
      this.errorMessage.set('Les mots de passe ne correspondent pas');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.authService.register(this.data).subscribe({
      next: (response) => {
        console.log('✅ Inscription :', response);
        this.isLoading.set(false);

        if (response.success) {
          this.successMessage.set('✅ ' + response.message + ' Redirection vers la connexion...');
          // Redirection après 2 secondes
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage.set(response.message);
        }
      },
      error: (err) => {
        console.error('❌ Erreur :', err);
        this.isLoading.set(false);
        if (err.status === 0) {
          this.errorMessage.set('Impossible de joindre le serveur. Vérifiez que le backend est démarré.');
        } else if (err.error?.message) {
          this.errorMessage.set(err.error.message);
        } else {
          this.errorMessage.set('Erreur lors de l\'inscription');
        }
      }
    });
  }
}