/**
 * Données envoyées au backend lors du login
 * Correspond au DTO LoginRequest côté Spring Boot
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Données envoyées au backend lors de l'inscription
 * Correspond au DTO RegisterRequest côté Spring Boot
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  nomComplet?: string;
  role?: string;
}

/**
 * Réponse reçue du backend après un login réussi
 * Contient le token JWT et les infos utilisateur
 * Correspond au DTO JwtResponse côté Spring Boot
 */
export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  nomComplet?: string;
  role: string;
}

/**
 * Réponse générique du backend (succès/erreur)
 * Correspond au DTO MessageResponse côté Spring Boot
 */
export interface MessageResponse {
  message: string;
  success: boolean;
}