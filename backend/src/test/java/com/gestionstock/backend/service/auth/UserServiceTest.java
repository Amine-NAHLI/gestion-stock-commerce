package com.gestionstock.backend.service.auth;

import com.gestionstock.backend.entity.auth.AuditLog;
import com.gestionstock.backend.entity.auth.User;
import com.gestionstock.backend.repository.auth.AuditLogRepository;
import com.gestionstock.backend.repository.auth.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuditLogRepository auditLogRepository;

    @Mock
    private VerificationTokenService verificationTokenService;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private UserService userService;

    @Test
    void toggleStatus_ShouldFlipActifFlagAndLogAction() {
        // Arrange
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setActif(true);

        SecurityContextHolder.setContext(securityContext);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("admin");

        // Act
        userService.toggleStatus(1L);

        // Assert
        assertFalse(user.getActif()); // Should be flipped to false
        verify(auditLogRepository, times(1)).save(any(AuditLog.class));
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void approveUser_ShouldSetActifTrueAndDisablePendingFlag() {
        // Arrange
        User user = new User();
        user.setId(1L);
        user.setUsername("newuser");
        user.setActif(false);
        user.setEmailVerifie(true);
        user.setEnAttenteApprobation(true);

        SecurityContextHolder.setContext(securityContext);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("admin");

        // Act
        userService.approveUser(1L);

        // Assert
        assertTrue(user.getActif());
        assertFalse(user.getEnAttenteApprobation());
        verify(auditLogRepository, times(1)).save(any(AuditLog.class));
    }
    @Test
    void rejectUser_ShouldRemoveVerificationTokenBeforeDeletingUser() {
        User user = new User();
        user.setId(1L);
        user.setUsername("newuser");
        user.setEnAttenteApprobation(true);

        SecurityContextHolder.setContext(securityContext);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("admin");

        userService.rejectUser(1L);

        verify(verificationTokenService, times(1)).removeToken(user);
        verify(userRepository, times(1)).delete(user);
        verify(auditLogRepository, times(1)).save(any(AuditLog.class));
    }
}
