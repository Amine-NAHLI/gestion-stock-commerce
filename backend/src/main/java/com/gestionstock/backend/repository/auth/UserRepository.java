package com.gestionstock.backend.repository.auth;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestionstock.backend.entity.auth.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Trouve un utilisateur par son nom d'utilisateur
     * Utilisé lors de la connexion (login)
     */
    Optional<User> findByUsername(String username);

    /**
     * Trouve un utilisateur par son email
     */
    Optional<User> findByEmail(String email);

    /**
     * Vérifie si un username existe déjà (pour l'inscription)
     */
    Boolean existsByUsername(String username);

    /**
     * Vérifie si un email existe déjà (pour l'inscription)
     */
    Boolean existsByEmail(String email);
}