import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal , ChangeDetectorRef} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartOptions, registerables } from 'chart.js';
import { DashboardService } from '../../core/services/dashboard';
import { DashboardStats } from '../../core/models/dashboard.model';
import { TokenService } from '../../core/services/token.service';
import { JwtResponse } from '../../core/models/auth.model';

// Enregistrer tous les composants Chart.js
Chart.register(...registerables);

import { AiService } from '../../core/services/ai.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private cdr = inject(ChangeDetectorRef);

  private dashboardService = inject(DashboardService);
  private tokenService = inject(TokenService);
  private aiService = inject(AiService);

  currentUser: JwtResponse | null = null;
  stats = signal<DashboardStats | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');
  
  marketingAdvice = signal<string>('');
  isAiLoading = signal(false);

  // ============= CONFIGURATION GRAPHIQUE LIGNES (Ventes par mois) =============
  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Ventes',
        data: [],
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.2)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#667eea',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#2c3e50',
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  // ============= CONFIGURATION GRAPHIQUE DOUGHNUT (Top produits) =============
  doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'],
        borderWidth: 0,
        hoverOffset: 8
      }
    ]
  };

  doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: { size: 12 }
        }
      }
    }
  };

  ngOnInit(): void {
    this.currentUser = this.tokenService.getUser();
    this.loadStats();
    this.loadAiAdvice();
  }

  loadAiAdvice(): void {
    this.isAiLoading.set(true);
    this.aiService.getMarketingAdvice().subscribe({
      next: (advice) => {
        this.marketingAdvice.set(advice);
        this.isAiLoading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.isAiLoading.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  /**
   * Charge les statistiques depuis le backend
   */
  loadStats(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.dashboardService.getStats().subscribe({
      next: (data) => {
        console.log('✅ Stats chargées :', data);
        this.stats.set(data);
        this.updateCharts(data);
        this.isLoading.set(false);
      
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('❌ Erreur chargement stats :', err);
        this.errorMessage.set('Impossible de charger les statistiques. ' + (err.error?.message || err.message));
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Met à jour les graphiques avec les données reçues
   */
  private updateCharts(data: DashboardStats): void {
    // Graphique ventes par mois
    if (data.ventesParMois) {
      this.lineChartData = {
        labels: Object.keys(data.ventesParMois),
        datasets: [
          {
            ...this.lineChartData.datasets[0],
            data: Object.values(data.ventesParMois)
          }
        ]
      };
    }

    // Graphique top produits
    if (data.topProduits) {
      this.doughnutChartData = {
        labels: Object.keys(data.topProduits),
        datasets: [
          {
            ...this.doughnutChartData.datasets[0],
            data: Object.values(data.topProduits)
          }
        ]
      };
    }
  }

  /**
   * Formate un nombre en devise
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2
    }).format(value);
  }
}