\# 🗄️ Configuration de la Base de Données



\## ⚙️ Paramètres de connexion (XAMPP / MariaDB)



| Paramètre | Valeur |

|-----------|--------|

| \*\*SGBD\*\* | MySQL / MariaDB (XAMPP) |

| \*\*Host\*\* | localhost |

| \*\*Port\*\* | 3306 |

| \*\*Nom de la base\*\* | `gestion\_stock\_db` |

| \*\*Username\*\* | `root` |

| \*\*Password\*\* | \*(vide par défaut dans XAMPP)\* |

| \*\*Interclassement\*\* | `utf8mb4\_unicode\_ci` |



\---



\## 🔗 URL JDBC

---

## 📋 Instructions pour les membres de l'équipe

### Étape 1 : Démarrer XAMPP
1. Ouvrir **XAMPP Control Panel**
2. Démarrer **Apache** et **MySQL**

### Étape 2 : Créer la base de données
1. Aller sur http://localhost/phpmyadmin
2. Onglet "Bases de données"
3. Nom : `gestion_stock_db`
4. Interclassement : `utf8mb4_unicode_ci`
5. Cliquer "Créer"

### Étape 3 : Vérifier la connexion dans le projet
Le fichier `backend/src/main/resources/application.properties` contient déjà les paramètres de connexion. Aucune modification nécessaire si XAMPP est utilisé avec les paramètres par défaut.

---

## ⚠️ Notes importantes

- **NE PAS** créer les tables manuellement - Spring Boot/Hibernate les créera automatiquement
- Le mode `spring.jpa.hibernate.ddl-auto=update` est utilisé en développement
- En production, utiliser `validate` ou des migrations Flyway/Liquibase

---

## 🐛 Problèmes courants

### Port 3306 déjà utilisé
- Vérifier qu'aucun autre service MySQL ne tourne
- Ou changer le port dans XAMPP et dans `application.properties`

### Erreur "Access denied for user 'root'"
- Vérifier que le password est bien vide (XAMPP par défaut)
- Si vous avez mis un password à root dans XAMPP, l'ajouter dans `application.properties`

### Erreur de timezone
- L'URL JDBC inclut déjà `serverTimezone=UTC` qui résout ce problème

