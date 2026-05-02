package com.gestionstock.backend.security;

import java.io.IOException;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

/**
 * Filtre qui intercepte chaque requête HTTP pour vérifier le token JWT
 * Si le token est valide, l'utilisateur est authentifié dans Spring Security
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        // 1. Récupérer le header "Authorization" de la requête
        final String authHeader = request.getHeader("Authorization");

        // 2. Si le header est absent ou ne commence pas par "Bearer ",
        //    laisser passer la requête (pas de JWT à vérifier)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Extraire le token (après "Bearer ")
        final String jwt = authHeader.substring(7);

        try {
            // 4. Extraire le username du token
            final String username = jwtService.extractUsername(jwt);

            // 5. Si on a un username ET qu'aucun utilisateur n'est encore authentifié
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // 6. Charger les détails de l'utilisateur depuis la BDD
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

                // 7. Vérifier que le token est valide pour cet utilisateur
                if (jwtService.isTokenValid(jwt, userDetails)) {

                    // 8. Créer un objet d'authentification Spring Security
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // 9. Enregistrer l'authentification dans le contexte de sécurité
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // En cas d'erreur (token invalide, expiré, etc.), on log et on continue
            logger.error("Erreur lors de la validation du token JWT : " + e.getMessage());
        }

        // 10. Passer la requête au filtre suivant (ou au controller)
        filterChain.doFilter(request, response);
    }
}