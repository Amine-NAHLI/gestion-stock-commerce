/**
 * Statuts possibles d'une commande fournisseur.
 */
export enum StatutCommande {
  EN_ATTENTE = 'EN_ATTENTE',
  CONFIRMEE = 'CONFIRMEE',
  LIVREE = 'LIVREE',
  ANNULEE = 'ANNULEE'
}

/**
 * Modèle LigneCommande — une ligne de produit dans une commande.
 */
export interface LigneCommande {
  id?: number;
  produitId: number;
  produitNom?: string;
  produitCode?: string;
  quantite: number;
  prixUnitaire: number;
  sousTotal?: number;
}

/**
 * Modèle Commande — une commande passée à un fournisseur.
 */
export interface Commande {
  id?: number;
  numero?: string;
  dateCommande?: string;
  dateLivraison?: string;
  statut?: StatutCommande;
  montantTotal?: number;
  fournisseurId: number;
  fournisseurNom?: string;
  userId?: number;
  userNom?: string;
  lignes: LigneCommande[];
}

/**
 * Requête de création de commande (envoyée au backend).
 */
export interface CommandeRequest {
  fournisseurId: number;
  lignes: LigneCommande[];
}
