package com.gestionstock.backend.repository.produit;

import com.gestionstock.backend.entity.produit.MouvementStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MouvementStockRepository extends JpaRepository<MouvementStock, Long> {
    List<MouvementStock> findByProduitIdOrderByDateMouvementDesc(Long produitId);
    List<MouvementStock> findAllByOrderByDateMouvementDesc();
}
