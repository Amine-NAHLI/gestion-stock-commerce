import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

const API_URL = 'http://localhost:8080/api';

/**
 * Service Angular pour l'export de rapports au format Excel.
 * Télécharge les fichiers .xlsx depuis les endpoints /api/export.
 */
@Injectable({
  providedIn: 'root'
})
export class ExportService {

  private http = inject(HttpClient);

  /** Télécharge un fichier Excel pour le type donné */
  exportExcel(type: 'produits' | 'fournisseurs' | 'commandes' | 'clients' | 'ventes'): void {
    this.http.get(`${API_URL}/export/${type}`, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${type}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error(`Erreur lors de l'export ${type}`, err)
    });
  }
}
