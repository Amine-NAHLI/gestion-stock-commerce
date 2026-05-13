package com.gestionstock.backend.dto.auth;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String nomComplet;
    private Boolean actif;
    private Boolean enAttenteApprobation;
    private LocalDateTime dateCreation;
    private String role;
}
