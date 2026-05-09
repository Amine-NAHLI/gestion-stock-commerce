/**
 * Modes de paiement disponibles pour une vente.
 */
export enum ModePaiement {
  ESPECES = 'ESPECES',
  CARTE = 'CARTE',
  CHEQUE = 'CHEQUE'
}

/**
 * Modèle LigneVente — une ligne de produit dans une vente.
 */
export interface LigneVente {
  id?: number;
  produitId: number;
  produitNom?: string;
  produitCode?: string;
  quantite: number;
  prixUnitaire: number;
  sousTotal?: number;
}

/**
 * Modèle Vente — une vente réalisée au point de vente.
 */
export interface Vente {
  id?: number;
  numero?: string;
  dateVente?: string;
  montantTotal?: number;
  modePaiement?: ModePaiement;
  clientId?: number;
  clientNom?: string;
  userId?: number;
  userNom?: string;
  lignes: LigneVente[];
}

/**
 * Requête de création de vente (envoyée au backend).
 */
export interface VenteRequest {
  clientId?: number;
  modePaiement: ModePaiement;
  lignes: LigneVente[];
}
