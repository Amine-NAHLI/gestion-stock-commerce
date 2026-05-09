/**
 * Modèle Fournisseur — représente un fournisseur de produits.
 */
export interface Fournisseur {
  id?: number;
  nom: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  dateCreation?: string;
}
