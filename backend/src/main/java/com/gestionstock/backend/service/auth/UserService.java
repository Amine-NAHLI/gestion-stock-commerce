package com.gestionstock.backend.service.auth;

import com.gestionstock.backend.dto.auth.UserDTO;
import com.gestionstock.backend.entity.auth.AuditLog;
import com.gestionstock.backend.entity.auth.Role;
import com.gestionstock.backend.entity.auth.User;
import com.gestionstock.backend.repository.auth.AuditLogRepository;
import com.gestionstock.backend.repository.auth.RoleRepository;
import com.gestionstock.backend.repository.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogRepository auditLogRepository;
    private final VerificationTokenService verificationTokenService;

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé avec l'id : " + id));
        return mapToDTO(user);
    }

    @Transactional
    public UserDTO createUser(User user, String roleName) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Le nom d'utilisateur est déjà utilisé");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("L'email est déjà utilisé");
        }

        Role role = roleRepository.findByNom(roleName)
                .orElseThrow(() -> new IllegalArgumentException("Rôle non trouvé : " + roleName));
        
        user.setRole(role);
        user.setEmailVerifie(true);
        user.setEnAttenteApprobation(false);
        user.setActif(true);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        return mapToDTO(userRepository.save(user));
    }

    @Transactional
    public UserDTO updateUser(Long id, User userDetails, String roleName) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé avec l'id : " + id));

        // Vérifier si le nouveau username/email est déjà pris par un autre utilisateur
        if (!user.getUsername().equals(userDetails.getUsername()) && userRepository.existsByUsername(userDetails.getUsername())) {
            throw new IllegalArgumentException("Le nom d'utilisateur est déjà utilisé");
        }
        if (!user.getEmail().equals(userDetails.getEmail()) && userRepository.existsByEmail(userDetails.getEmail())) {
            throw new IllegalArgumentException("L'email est déjà utilisé");
        }

        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        user.setNomComplet(userDetails.getNomComplet());
        // On ne modifie PAS l'état 'actif' ou 'approbation' ici, 
        // cela doit passer par toggleStatus ou approveUser

        if (roleName != null && !roleName.isEmpty()) {
            Role role = roleRepository.findByNom(roleName)
                    .orElseThrow(() -> new IllegalArgumentException("Rôle non trouvé : " + roleName));
            user.setRole(role);
        }
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }

        saveAuditLog("MODIFICATION", "Mise à jour des informations", user.getUsername());
        return mapToDTO(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé avec l'id : " + id));
        
        saveAuditLog("SUPPRESSION", "Suppression définitive du compte", user.getUsername());
        verificationTokenService.removeToken(user);
        userRepository.delete(user);
    }

    @Transactional
    public UserDTO toggleStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé avec l'id : " + id));
        user.setActif(!user.getActif());
        
        String action = user.getActif() ? "ACTIVATION" : "DESACTIVATION";
        saveAuditLog(action, "Changement de statut manuel", user.getUsername());
        
        return mapToDTO(userRepository.save(user));
    }

    @Transactional
    public UserDTO approveUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé avec l'id : " + id));
        if (!Boolean.TRUE.equals(user.getEmailVerifie())) {
            throw new IllegalArgumentException("L adresse email doit etre verifiee avant l approbation");
        }
        user.setActif(true);
        user.setEnAttenteApprobation(false);
        
        saveAuditLog("APPROBATION", "Demande d'inscription approuvée", user.getUsername());
        
        return mapToDTO(userRepository.save(user));
    }

    @Transactional
    public void rejectUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé avec l'id : " + id));
        if (!user.getEnAttenteApprobation()) {
            throw new IllegalArgumentException("Cet utilisateur n'est pas en attente d'approbation");
        }
        
        saveAuditLog("REJET", "Demande d'inscription refusée", user.getUsername());
        verificationTokenService.removeToken(user);
        userRepository.delete(user);
    }

    private void saveAuditLog(String action, String details, String targetUsername) {
        String adminUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        
        AuditLog log = AuditLog.builder()
                .action(action)
                .details(details)
                .adminUsername(adminUsername)
                .targetUsername(targetUsername)
                .dateAction(LocalDateTime.now())
                .build();
        
        auditLogRepository.save(log);
    }

    public List<AuditLog> getAuditLogs() {
        return auditLogRepository.findAllByOrderByDateActionDesc();
    }

    private UserDTO mapToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .nomComplet(user.getNomComplet())
                .actif(user.getActif())
                .emailVerifie(user.getEmailVerifie())
                .enAttenteApprobation(user.getEnAttenteApprobation())
                .dateCreation(user.getDateCreation())
                .role(user.getRole() != null ? user.getRole().getNom() : null)
                .build();
    }
}
