import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-coming-soon',
  imports: [CommonModule],
  templateUrl: './coming-soon.html',
  styleUrl: './coming-soon.scss'
})
export class ComingSoon {
  private route = inject(ActivatedRoute);

  pageName = '';
  developer = '';

  constructor() {
    // Récupère le nom de la page depuis l'URL
    const path = this.route.snapshot.url[0]?.path || 'Page';
    this.pageName = path.charAt(0).toUpperCase() + path.slice(1);

    // Attribuer le développeur en charge selon le module
    const adnaneModules = ['produits', 'categories', 'mouvements'];
    const kenzaModules = ['fournisseurs', 'commandes', 'clients', 'ventes', 'rapports'];

    if (adnaneModules.includes(path)) {
      this.developer = 'El Menouar Adnane';
    } else if (kenzaModules.includes(path)) {
      this.developer = 'Boutarfass Kenza';
    } else {
      this.developer = 'L\'équipe';
    }
  }
}