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
     * Crée les utilisateurs par défaut si la table users est vide
     */
    private void initAdminUser() {
        if (userRepository.count() < 3) {
            log.info("Création des utilisateurs de démo manquants...");

            Role adminRole = roleRepository.findByNom("ADMIN").orElseThrow();
            Role gerantRole = roleRepository.findByNom("GERANT").orElseThrow();
            Role employeRole = roleRepository.findByNom("EMPLOYE").orElseThrow();

            if (!userRepository.existsByUsername("admin")) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@gestionstock.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setNomComplet("Administrateur");
                admin.setRole(adminRole);
                admin.setActif(true);
                admin.setDateCreation(LocalDateTime.now());
                userRepository.save(admin);
            }

            if (!userRepository.existsByUsername("gerant")) {
                User gerant = new User();
                gerant.setUsername("gerant");
                gerant.setEmail("gerant@gestionstock.com");
                gerant.setPassword(passwordEncoder.encode("gerant123"));
                gerant.setNomComplet("Gérant Principal");
                gerant.setRole(gerantRole);
                gerant.setActif(true);
                gerant.setDateCreation(LocalDateTime.now());
                userRepository.save(gerant);
            }

            if (!userRepository.existsByUsername("employe")) {
                User employe = new User();
                employe.setUsername("employe");
                employe.setEmail("employe@gestionstock.com");
                employe.setPassword(passwordEncoder.encode("employe123"));
                employe.setNomComplet("Employé Caisse");
                employe.setRole(employeRole);
                employe.setActif(true);
                employe.setDateCreation(LocalDateTime.now());
                userRepository.save(employe);
            }

            log.info("✓ Utilisateurs de démo vérifiés/créés (admin, gerant, employe)");
        } else {
            log.info("Des utilisateurs existent déjà ({} users en base)", userRepository.count());
        }
    }
}