package com.gestionstock.backend.service.auth;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.gestionstock.backend.entity.auth.User;
import com.gestionstock.backend.entity.auth.VerificationToken;
import com.gestionstock.backend.repository.auth.VerificationTokenRepository;

import lombok.RequiredArgsConstructor;

/**
 * Implémentation du service de token de vérification.
 */
@Service
@RequiredArgsConstructor
public class VerificationTokenServiceImpl implements VerificationTokenService {

    private final VerificationTokenRepository tokenRepository;
    private static final int EXPIRATION_MINUTES = 60 * 24;

    @Override
    public VerificationToken createToken(User user) {
        VerificationToken token = VerificationToken.create(user, EXPIRATION_MINUTES);
        return tokenRepository.save(token);
    }

    @Override
    public Optional<VerificationToken> findByToken(String token) {
        return tokenRepository.findByToken(token);
    }

    @Override
    public void invalidateToken(VerificationToken token) {
        tokenRepository.delete(token);
    }

    @Override
    public void removeToken(User user) {
        tokenRepository.deleteByUser(user);
    }
}
