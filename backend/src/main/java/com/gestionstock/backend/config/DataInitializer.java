package com.gestionstock.backend.config;

import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.gestionstock.backend.entity.auth.Role;
import com.gestionstock.backend.entity.auth.User;
import com.gestionstock.backend.repository.auth.RoleRepository;
import com.gestionstock.backend.repository.auth.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Initialise les données de base au démarrage de l'application
 * - Crée les 3 rôles (ADMIN, GERANT, EMPLOYE)
 * - Crée un utilisateur admin par défaut (admin / admin123)
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("=================================================");
        log.info("  Initialisation des données de base...");
        log.info("=================================================");

        // 1. Initialiser les rôles
        initRoles();

        // 2. Initialiser l'utilisateur admin par défaut
        initAdminUser();

        log.info("=================================================");
        log.info("  Initialisation terminée !");
        log.info("=================================================");
    }

    /**
     * Crée les 3 rôles si la table roles est vide
     */
    private void initRoles() {
        if (roleRepository.count() == 0) {
            log.info("Création des rôles par défaut...");

            Role adminRole = new Role();
            adminRole.setNom("ADMIN");
            adminRole.setDescription("Administrateur : accès complet à l'application");
            roleRepository.save(adminRole);

            Role gerantRole = new Role();
            gerantRole.setNom("GERANT");
            gerantRole.setDescription("Gérant : gère les produits, commandes, ventes");
            roleRepository.save(gerantRole);

            Role employeRole = new Role();
            employeRole.setNom("EMPLOYE");
            employeRole.setDescription("Employé : accès limité (consultation, ventes)");
            roleRepository.save(employeRole);

            log.info("✓ 3 rôles créés : ADMIN, GERANT, EMPLOYE");
        } else {
            log.info("Les rôles existent déjà ({} rôles en base)", roleRepository.count());
        }
    }

    /**
     * Crée un utilisateur admin par défaut si la table users est vide
     */
    private void initAdminUser() {
        if (userRepository.count() == 0) {
            log.info("Création de l'utilisateur admin par défaut...");

            Role adminRole = roleRepository.findByNom("ADMIN")
                    .orElseThrow(() -> new RuntimeException("Le rôle ADMIN est introuvable"));

            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@gestionstock.com");
            admin.setPassword(passwordEncoder.encode("admin123")); // ⚠️ BCrypt
            admin.setNomComplet("Administrateur");
            admin.setRole(adminRole);
            admin.setActif(true);
            admin.setDateCreation(LocalDateTime.now());

            userRepository.save(admin);

            log.info("✓ Utilisateur admin créé :");
            log.info("    Username : admin");
            log.info("    Password : admin123");
            log.info("    ⚠️  À changer en production !");
        } else {
            log.info("Des utilisateurs existent déjà ({} users en base)", userRepository.count());
        }
    }
}