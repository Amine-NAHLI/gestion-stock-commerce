package com.gestionstock.backend.dto.produit;

import com.gestionstock.backend.entity.enums.TypeMouvement;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MouvementStockDTO {
    private Long id;
    private Long produitId;
    private String produitNom;
    private String produitCode;
    private Double quantite;
    private TypeMouvement type;
    private String motif;
    private LocalDateTime dateMouvement;
    private Long userId;
    private String userNom;
}
