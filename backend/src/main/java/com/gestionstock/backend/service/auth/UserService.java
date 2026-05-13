package com.gestionstock.backend.service.auth;

import com.gestionstock.backend.dto.auth.UserDTO;
import com.gestionstock.backend.entity.auth.Role;
import com.gestionstock.backend.entity.auth.User;
import com.gestionstock.backend.repository.auth.RoleRepository;
import com.gestionstock.backend.repository.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

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
        user.setActif(userDetails.getActif());

        if (roleName != null && !roleName.isEmpty()) {
            Role role = roleRepository.findByNom(roleName)
                    .orElseThrow(() -> new IllegalArgumentException("Rôle non trouvé : " + roleName));
            user.setRole(role);
        }

        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }

        return mapToDTO(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("Utilisateur non trouvé avec l'id : " + id);
        }
        userRepository.deleteById(id);
    }

    @Transactional
    public UserDTO toggleStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé avec l'id : " + id));
        user.setActif(!user.getActif());
        return mapToDTO(userRepository.save(user));
    }

    @Transactional
    public UserDTO approveUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé avec l'id : " + id));
        user.setActif(true);
        user.setEnAttenteApprobation(false);
        return mapToDTO(userRepository.save(user));
    }

    @Transactional
    public void rejectUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé avec l'id : " + id));
        if (!user.getEnAttenteApprobation()) {
            throw new IllegalArgumentException("Cet utilisateur n'est pas en attente d'approbation");
        }
        userRepository.delete(user);
    }

    private UserDTO mapToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .nomComplet(user.getNomComplet())
                .actif(user.getActif())
                .enAttenteApprobation(user.getEnAttenteApprobation())
                .dateCreation(user.getDateCreation())
                .role(user.getRole() != null ? user.getRole().getNom() : null)
                .build();
    }
}
