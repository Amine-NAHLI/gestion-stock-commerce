package com.gestionstock.backend.service.fournisseur;

import com.gestionstock.backend.entity.fournisseur.*;
import com.gestionstock.backend.entity.produit.Produit;
import com.gestionstock.backend.repository.fournisseur.*;
import com.gestionstock.backend.repository.produit.ProduitRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.transaction.annotation.Transactional;

/**
 * Service pour l'export de rapports au format Excel (.xlsx).
 * Génère des fichiers Excel pour les produits, fournisseurs, commandes, clients et ventes.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExcelService {

    private final ProduitRepository produitRepository;
    private final FournisseurRepository fournisseurRepository;
    private final CommandeRepository commandeRepository;
    private final ClientRepository clientRepository;
    private final VenteRepository venteRepository;

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    /**
     * Exporte la liste des produits au format Excel
     */
    public byte[] exportProduits() throws IOException {
        List<Produit> produits = produitRepository.findAll();

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Produits");

            // Style d'en-tête
            CellStyle headerStyle = createHeaderStyle(workbook);

            // En-têtes
            String[] headers = {"ID", "Code", "Nom", "Description", "Prix Achat", "Prix Vente",
                    "Quantité Stock", "Seuil Alerte", "Unité", "Catégorie", "Fournisseur", "Date Création"};
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Données
            int rowNum = 1;
            for (Produit p : produits) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(p.getId());
                row.createCell(1).setCellValue(p.getCode() != null ? p.getCode() : "");
                row.createCell(2).setCellValue(p.getNom());
                row.createCell(3).setCellValue(p.getDescription() != null ? p.getDescription() : "");
                row.createCell(4).setCellValue(p.getPrixAchat() != null ? p.getPrixAchat() : 0);
                row.createCell(5).setCellValue(p.getPrixVente() != null ? p.getPrixVente() : 0);
                row.createCell(6).setCellValue(p.getQuantiteStock());
                row.createCell(7).setCellValue(p.getSeuilAlerte() != null ? p.getSeuilAlerte() : 0);
                row.createCell(8).setCellValue(p.getUnite() != null ? p.getUnite() : "");
                row.createCell(9).setCellValue(p.getCategorie() != null ? p.getCategorie().getNom() : "");
                row.createCell(10).setCellValue(p.getFournisseur() != null ? p.getFournisseur().getNom() : "");
                row.createCell(11).setCellValue(p.getDateCreation() != null ? p.getDateCreation().format(DATE_FORMAT) : "");
            }

            // Auto-dimensionner les colonnes
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            return toByteArray(workbook);
        }
    }

    /**
     * Exporte la liste des fournisseurs au format Excel
     */
    public byte[] exportFournisseurs() throws IOException {
        List<Fournisseur> fournisseurs = fournisseurRepository.findAll();

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Fournisseurs");
            CellStyle headerStyle = createHeaderStyle(workbook);

            String[] headers = {"ID", "Nom", "Email", "Téléphone", "Adresse", "Ville", "Pays", "Date Création"};
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowNum = 1;
            for (Fournisseur f : fournisseurs) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(f.getId());
                row.createCell(1).setCellValue(f.getNom());
                row.createCell(2).setCellValue(f.getEmail() != null ? f.getEmail() : "");
                row.createCell(3).setCellValue(f.getTelephone() != null ? f.getTelephone() : "");
                row.createCell(4).setCellValue(f.getAdresse() != null ? f.getAdresse() : "");
                row.createCell(5).setCellValue(f.getVille() != null ? f.getVille() : "");
                row.createCell(6).setCellValue(f.getPays() != null ? f.getPays() : "");
                row.createCell(7).setCellValue(f.getDateCreation() != null ? f.getDateCreation().format(DATE_FORMAT) : "");
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            return toByteArray(workbook);
        }
    }

    /**
     * Exporte la liste des commandes au format Excel
     */
    public byte[] exportCommandes() throws IOException {
        List<Commande> commandes = commandeRepository.findAllByOrderByDateCommandeDesc();

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Commandes");
            CellStyle headerStyle = createHeaderStyle(workbook);

            String[] headers = {"ID", "Numéro", "Date Commande", "Date Livraison", "Statut",
                    "Montant Total", "Fournisseur", "Utilisateur"};
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowNum = 1;
            for (Commande c : commandes) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(c.getId());
                row.createCell(1).setCellValue(c.getNumero());
                row.createCell(2).setCellValue(c.getDateCommande() != null ? c.getDateCommande().format(DATE_FORMAT) : "");
                row.createCell(3).setCellValue(c.getDateLivraison() != null ? c.getDateLivraison().format(DATE_FORMAT) : "");
                row.createCell(4).setCellValue(c.getStatut().name());
                row.createCell(5).setCellValue(c.getMontantTotal() != null ? c.getMontantTotal() : 0);
                row.createCell(6).setCellValue(c.getFournisseur() != null ? c.getFournisseur().getNom() : "");
                row.createCell(7).setCellValue(c.getUser() != null ? c.getUser().getNomComplet() : "");
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            return toByteArray(workbook);
        }
    }

    /**
     * Exporte la liste des clients au format Excel
     */
    public byte[] exportClients() throws IOException {
        List<Client> clients = clientRepository.findAll();

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Clients");
            CellStyle headerStyle = createHeaderStyle(workbook);

            String[] headers = {"ID", "Nom", "Prénom", "Email", "Téléphone", "Adresse", "Date Création"};
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowNum = 1;
            for (Client c : clients) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(c.getId());
                row.createCell(1).setCellValue(c.getNom() != null ? c.getNom() : "");
                row.createCell(2).setCellValue(c.getPrenom() != null ? c.getPrenom() : "");
                row.createCell(3).setCellValue(c.getEmail() != null ? c.getEmail() : "");
                row.createCell(4).setCellValue(c.getTelephone() != null ? c.getTelephone() : "");
                row.createCell(5).setCellValue(c.getAdresse() != null ? c.getAdresse() : "");
                row.createCell(6).setCellValue(c.getDateCreation() != null ? c.getDateCreation().format(DATE_FORMAT) : "");
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            return toByteArray(workbook);
        }
    }

    /**
     * Exporte la liste des ventes au format Excel
     */
    public byte[] exportVentes() throws IOException {
        List<Vente> ventes = venteRepository.findAllByOrderByDateVenteDesc();

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Ventes");
            CellStyle headerStyle = createHeaderStyle(workbook);

            String[] headers = {"ID", "Numéro", "Date Vente", "Montant Total", "Mode Paiement",
                    "Client", "Vendeur"};
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowNum = 1;
            for (Vente v : ventes) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(v.getId());
                row.createCell(1).setCellValue(v.getNumero());
                row.createCell(2).setCellValue(v.getDateVente() != null ? v.getDateVente().format(DATE_FORMAT) : "");
                row.createCell(3).setCellValue(v.getMontantTotal() != null ? v.getMontantTotal() : 0);
                row.createCell(4).setCellValue(v.getModePaiement() != null ? v.getModePaiement().name() : "");
                row.createCell(5).setCellValue(v.getClient() != null ? v.getClient().getNom() : "Client occasionnel");
                row.createCell(6).setCellValue(v.getUser() != null ? v.getUser().getNomComplet() : "");
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            return toByteArray(workbook);
        }
    }

    /**
     * Crée un style pour les en-têtes de colonnes (fond bleu, texte blanc, gras)
     */
    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.WHITE.getIndex());
        font.setFontHeightInPoints((short) 12);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }

    /**
     * Convertit un workbook en tableau d'octets
     */
    private byte[] toByteArray(XSSFWorkbook workbook) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        return out.toByteArray();
    }
}
