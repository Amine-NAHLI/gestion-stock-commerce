package com.gestionstock.backend.controller.fournisseur;

import com.gestionstock.backend.service.fournisseur.ExcelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

/**
 * Contrôleur REST pour l'export de rapports au format Excel.
 * Chaque endpoint retourne un fichier .xlsx téléchargeable.
 */
@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
public class ExportController {

    private final ExcelService excelService;

    /** GET /api/export/produits — Export Excel des produits */
    @GetMapping("/produits")
    public ResponseEntity<byte[]> exportProduits() throws IOException {
        byte[] data = excelService.exportProduits();
        return buildExcelResponse(data, "produits.xlsx");
    }

    /** GET /api/export/fournisseurs — Export Excel des fournisseurs */
    @GetMapping("/fournisseurs")
    public ResponseEntity<byte[]> exportFournisseurs() throws IOException {
        byte[] data = excelService.exportFournisseurs();
        return buildExcelResponse(data, "fournisseurs.xlsx");
    }

    /** GET /api/export/commandes — Export Excel des commandes */
    @GetMapping("/commandes")
    public ResponseEntity<byte[]> exportCommandes() throws IOException {
        byte[] data = excelService.exportCommandes();
        return buildExcelResponse(data, "commandes.xlsx");
    }

    /** GET /api/export/clients — Export Excel des clients */
    @GetMapping("/clients")
    public ResponseEntity<byte[]> exportClients() throws IOException {
        byte[] data = excelService.exportClients();
        return buildExcelResponse(data, "clients.xlsx");
    }

    /** GET /api/export/ventes — Export Excel des ventes */
    @GetMapping("/ventes")
    public ResponseEntity<byte[]> exportVentes() throws IOException {
        byte[] data = excelService.exportVentes();
        return buildExcelResponse(data, "ventes.xlsx");
    }

    /**
     * Construit une réponse HTTP avec le fichier Excel en pièce jointe.
     */
    private ResponseEntity<byte[]> buildExcelResponse(byte[] data, String filename) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", filename);
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        return ResponseEntity.ok().headers(headers).body(data);
    }
}
