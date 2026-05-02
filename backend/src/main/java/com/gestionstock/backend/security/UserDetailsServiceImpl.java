package com.gestionstock.backend.security;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gestionstock.backend.repository.auth.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * Service qui charge les détails d'un utilisateur depuis la BDD
 * Utilisé par Spring Security pour l'authentification
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Charge un utilisateur par son username
     * Cette méthode est appelée automatiquement par Spring Security lors du login
     */
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 1. Chercher l'utilisateur dans la BDD
        com.gestionstock.backend.entity.auth.User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Utilisateur non trouvé avec le username : " + username));

        // 2. Vérifier que l'utilisateur est actif
        if (!user.getActif()) {
            throw new UsernameNotFoundException("L'utilisateur " + username + " est désactivé");
        }

        // 3. Convertir notre User en UserDetails de Spring Security
        Collection<? extends GrantedAuthority> authorities = getAuthorities(user);

        return new User(
                user.getUsername(),
                user.getPassword(),
                user.getActif(),    // enabled
                true,               // accountNonExpired
                true,               // credentialsNonExpired
                true,               // accountNonLocked
                authorities);
    }

    /**
     * Récupère les rôles (authorities) de l'utilisateur
     * Spring Security utilise le préfixe "ROLE_" par convention
     */
    private Collection<? extends GrantedAuthority> getAuthorities(
            com.gestionstock.backend.entity.auth.User user) {
        if (user.getRole() == null) {
            return List.of();
        }
        // Ex: "ADMIN" devient "ROLE_ADMIN"
        return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().getNom()));
    }
}