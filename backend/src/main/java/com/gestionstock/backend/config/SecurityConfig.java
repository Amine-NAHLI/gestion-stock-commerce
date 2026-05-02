package com.gestionstock.backend.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.gestionstock.backend.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

/**
 * Configuration de Spring Security
 * Définit la sécurité de l'application :
 * - Routes publiques / privées
 * - Authentification par JWT
 * - CORS pour le frontend Angular
 * - Encodage BCrypt pour les mots de passe
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;

    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    /**
     * Configure les règles de sécurité HTTP
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Désactive CSRF (pas nécessaire car on utilise JWT, pas de session)
            .csrf(csrf -> csrf.disable())

            // Active CORS avec notre configuration
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // Pas de session : on utilise JWT (stateless)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Définition des routes publiques et protégées
            .authorizeHttpRequests(auth -> auth
                // Routes PUBLIQUES (pas besoin d'être connecté)
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/test/**").permitAll()
                .requestMatchers("/error").permitAll()

                // Toutes les autres routes nécessitent une authentification
                .anyRequest().authenticated()
            )

            // Utiliser notre AuthenticationProvider personnalisé
            .authenticationProvider(authenticationProvider())

            // Ajouter notre filtre JWT AVANT le filtre standard de Spring
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Configuration CORS pour permettre les requêtes depuis Angular
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Origines autorisées (depuis application.properties)
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));

        // Méthodes HTTP autorisées
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

        // Headers autorisés
        configuration.setAllowedHeaders(List.of("*"));

        // Headers exposés (pour que Angular puisse lire le token JWT en réponse si besoin)
        configuration.setExposedHeaders(List.of("Authorization"));

        // Autoriser les credentials (cookies, auth headers)
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * Provider d'authentification : combine UserDetailsService + PasswordEncoder
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * Manager d'authentification : utilisé par AuthService pour authentifier un user
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Encoder de mot de passe : BCrypt (recommandé)
     * Tous les mots de passe seront hashés avant d'être stockés en BDD
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}