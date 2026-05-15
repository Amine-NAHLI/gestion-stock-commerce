package com.gestionstock.backend.controller.auth;

import com.gestionstock.backend.dto.auth.MessageResponse;
import com.gestionstock.backend.dto.auth.RegisterRequest;
import com.gestionstock.backend.dto.auth.UserDTO;
import com.gestionstock.backend.entity.auth.User;
import com.gestionstock.backend.service.auth.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody RegisterRequest registerRequest) {
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(registerRequest.getPassword());
        user.setNomComplet(registerRequest.getNomComplet());
        user.setActif(true);

        String role = registerRequest.getRole() != null ? registerRequest.getRole() : "EMPLOYE";
        
        return ResponseEntity.ok(userService.createUser(user, role));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @Valid @RequestBody RegisterRequest updateRequest) {
        User userDetails = new User();
        userDetails.setUsername(updateRequest.getUsername());
        userDetails.setEmail(updateRequest.getEmail());
        userDetails.setPassword(updateRequest.getPassword()); // Peut être null si non modifié
        userDetails.setNomComplet(updateRequest.getNomComplet());
        userDetails.setActif(true); // Par défaut actif, ou gérer via toggle

        return ResponseEntity.ok(userService.updateUser(id, userDetails, updateRequest.getRole()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(new MessageResponse("Utilisateur supprimé avec succès"));
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<UserDTO> toggleUserStatus(@PathVariable Long id) {
        return ResponseEntity.ok(userService.toggleStatus(id));
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<UserDTO> approveUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.approveUser(id));
    }

    @DeleteMapping("/{id}/reject")
    public ResponseEntity<MessageResponse> rejectUser(@PathVariable Long id) {
        userService.rejectUser(id);
        return ResponseEntity.ok(new MessageResponse("Demande d'inscription rejetée et utilisateur supprimé"));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<com.gestionstock.backend.entity.auth.AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(userService.getAuditLogs());
    }
}
