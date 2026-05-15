package com.gestionstock.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        // Charger le fichier .env
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();

        // Injecter les variables dans le système pour que Spring puisse les lire
        dotenv.entries().forEach(entry -> {
            System.setProperty(entry.getKey(), entry.getValue());
        });

        SpringApplication.run(BackendApplication.class, args);
    }

}