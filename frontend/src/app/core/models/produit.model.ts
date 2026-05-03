export interface Categorie {
  id?: number;
  nom: string;
  description?: string;
  dateCreation?: string;
}

export interface Produit {
  id?: number;
  code: string;
  nom: string;
  description?: string;
  prixAchat: number;
  prixVente: number;
  quantiteStock: number;
  seuilAlerte: number;
  unite?: string;
  image?: string;
  dateCreation?: string;
  dateModification?: string;
  categorieId?: number;
  categorieNom?: string;
  fournisseurId?: number;
  fournisseurNom?: string;
}
