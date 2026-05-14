package com.gestionstock.backend.service.auth;

import java.util.Optional;

import com.gestionstock.backend.entity.auth.User;
import com.gestionstock.backend.entity.auth.VerificationToken;

/**
 * Service qui gère la création et la validation des tokens de vérification.
 */
public interface VerificationTokenService {

    VerificationToken createToken(User user);

    Optional<VerificationToken> findByToken(String token);

    void invalidateToken(VerificationToken token);

    void removeToken(User user);
}
