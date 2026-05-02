package com.gestionstock.backend.repository.auth;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestionstock.backend.entity.auth.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    /**
     * Trouve un rôle par son nom (ex: "ADMIN", "GERANT", "EMPLOYE")
     */
    Optional<Role> findByNom(String nom);

    /**
     * Vérifie si un rôle avec ce nom existe déjà
     */
    boolean existsByNom(String nom);
}