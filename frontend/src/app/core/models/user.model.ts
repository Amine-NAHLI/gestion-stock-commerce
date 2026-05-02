/**
 * Modèle représentant un utilisateur de l'application
 */
export interface User {
  id: number;
  username: string;
  email: string;
  nomComplet?: string;
  role: string;
  actif?: boolean;
  dateCreation?: string;
}