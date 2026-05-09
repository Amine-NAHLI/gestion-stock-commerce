/**
 * Modèle Client — représente un client du magasin.
 */
export interface Client {
  id?: number;
  nom: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  dateCreation?: string;
}
