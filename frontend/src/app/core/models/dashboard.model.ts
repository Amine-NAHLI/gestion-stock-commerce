/**
 * Modèle des statistiques du dashboard
 * Correspond au DTO DashboardStatsDTO côté Spring Boot
 */
export interface DashboardStats {
  totalProduits: number;
  totalCategories: number;
  totalFournisseurs: number;
  totalClients: number;
  totalCommandes: number;
  totalVentes: number;
  totalUtilisateurs: number;
  produitsStockBas: number;
  produitsAlerteNoms: string[];
  valeurStockTotal: number;
  caTotalVentes: number;
  ventesParMois: { [key: string]: number };
  topProduits: { [key: string]: number };
}