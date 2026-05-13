package com.gestionstock.backend.repository.auth;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestionstock.backend.entity.auth.User;
import com.gestionstock.backend.entity.auth.VerificationToken;

/**
 * Repository JPA pour les tokens de vérification.
 */
@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {

    Optional<VerificationToken> findByToken(String token);

    void deleteByUser(User user);
}
