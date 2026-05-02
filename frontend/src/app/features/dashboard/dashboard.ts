import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { TokenService } from '../../core/services/token.service';
import { JwtResponse } from '../../core/models/auth.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  currentUser: JwtResponse | null = null;

  ngOnInit(): void {
    this.currentUser = this.tokenService.getUser();
  }

  /**
   * Déconnexion
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}