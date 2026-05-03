package com.gestionstock.backend.dto.produit;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CategorieDTO {
    private Long id;
    private String nom;
    private String description;
    private LocalDateTime dateCreation;
}
