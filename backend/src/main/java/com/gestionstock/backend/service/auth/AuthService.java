package com.gestionstock.backend.service.auth;

import java.time.LocalDateTime;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gestionstock.backend.dto.auth.JwtResponse;
import com.gestionstock.backend.dto.auth.LoginRequest;
import com.gestionstock.backend.dto.auth.MessageResponse;
import com.gestionstock.backend.dto.auth.RegisterRequest;
import com.gestionstock.backend.entity.auth.Role;
import com.gestionstock.backend.entity.auth.User;
import com.gestionstock.backend.repository.auth.RoleRepository;
import com.gestionstock.backend.repository.auth.UserRepository;
import com.gestionstock.backend.security.JwtService;

import lombok.RequiredArgsConstructor;

/**
 * Service de gestion de l'authentification
 * - Login (connexion)
 * - Register (inscription)
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    /**
     * Authentifie un utilisateur et génère un token JWT
     */
    public JwtResponse login(LoginRequest request) {
        // 1. Authentifier l'utilisateur via Spring Security
        //    Cela appelle UserDetailsServiceImpl.loadUserByUsername()
        //    et vérifie le mot de passe avec BCrypt
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()));

        // 2. Récupérer l'utilisateur depuis la BDD
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // 3. Créer un UserDetails pour générer le token
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities("ROLE_" + user.getRole().getNom())
                .build();

        // 4. Générer le token JWT
        String token = jwtService.generateToken(userDetails);

        // 5. Retourner la réponse avec le token et les infos utilisateur
        return new JwtResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getNomComplet(),
                user.getRole().getNom());
    }

    /**
     * Enregistre un nouvel utilisateur
     */
    @Transactional
    public MessageResponse register(RegisterRequest request) {
        // 1. Vérifier que le username n'existe pas déjà
        if (userRepository.existsByUsername(request.getUsername())) {
            return new MessageResponse("Ce nom d'utilisateur est déjà pris", false);
        }

        // 2. Vérifier que l'email n'existe pas déjà
        if (userRepository.existsByEmail(request.getEmail())) {
            return new MessageResponse("Cet email est déjà utilisé", false);
        }

        // 3. Récupérer le rôle (par défaut EMPLOYE)
        String roleName = (request.getRole() != null && !request.getRole().isEmpty())
                ? request.getRole().toUpperCase()
                : "EMPLOYE";

        Role role = roleRepository.findByNom(roleName)
                .orElseThrow(() -> new RuntimeException("Rôle introuvable : " + roleName));

        // 4. Créer le nouvel utilisateur
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // ⚠️ BCrypt
        user.setNomComplet(request.getNomComplet());
        user.setRole(role);
        user.setActif(true);
        user.setDateCreation(LocalDateTime.now());

        // 5. Sauvegarder en BDD
        userRepository.save(user);

        return new MessageResponse("Utilisateur créé avec succès !", true);
    }
}