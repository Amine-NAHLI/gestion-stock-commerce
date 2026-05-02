package com.gestionstock.backend.controller.dashboard;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gestionstock.backend.dto.dashboard.DashboardStatsDTO;
import com.gestionstock.backend.service.dashboard.DashboardService;

import lombok.RequiredArgsConstructor;

/**
 * Controller REST pour le dashboard
 * Endpoints :
 * - GET /api/dashboard/stats
 */
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * Récupère les statistiques globales pour le dashboard
     * Nécessite une authentification (token JWT)
     */
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getStats() {
        return ResponseEntity.ok(dashboardService.getStats());
    }
}