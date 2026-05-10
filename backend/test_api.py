"""
=============================================================
  STOCKLY — Test Complet de toutes les API Backend
  Simule Postman : teste chaque endpoint du projet
=============================================================
"""
import urllib.request
import urllib.parse
import json
import sys
import time

BASE = "http://localhost:8080"
TOKEN = None
PASSED = 0
FAILED = 0
TOTAL = 0
UNIQUE_SUFFIX = str(int(time.time()))

# Variables d'ID globales pour le nettoyage
cat_id = None
prod_id = None
four_id = None
cli_id = None
cmd_id = None
vente_id = None

# ── Couleurs terminal ──
GREEN = "✅"
RED = "❌"
WARN = "⚠️"
SECTION = "═" * 55

def api(method, path, body=None, expect_status=200, auth=True, raw=False):
    """Envoie une requête HTTP et retourne (status, data)"""
    global TOKEN
    url = BASE + path
    headers = {"Content-Type": "application/json"}
    if auth and TOKEN:
        headers["Authorization"] = "Bearer " + TOKEN

    data_bytes = json.dumps(body).encode("utf-8") if body else None
    req = urllib.request.Request(url, data=data_bytes, headers=headers, method=method)

    try:
        res = urllib.request.urlopen(req)
        raw_bytes = res.read()
        if raw:
            return res.status, f"{len(raw_bytes)} octets"
        body_text = raw_bytes.decode("utf-8")
        return res.status, json.loads(body_text) if body_text else None
    except urllib.error.HTTPError as e:
        try:
            body_text = e.read().decode("utf-8") if e.fp else ""
            return e.code, json.loads(body_text)
        except:
            return e.code, body_text if 'body_text' in dir() else str(e)
    except Exception as e:
        return 0, str(e)

def test(name, method, path, body=None, expect_status=200, auth=True, raw=False):
    """Exécute un test et affiche le résultat"""
    global PASSED, FAILED, TOTAL
    TOTAL += 1
    status, data = api(method, path, body, expect_status, auth, raw)
    ok = status == expect_status

    if ok:
        PASSED += 1
        detail = ""
        if isinstance(data, list):
            detail = f" ({len(data)} éléments)"
        elif isinstance(data, dict) and "id" in data:
            detail = f" (id={data['id']})"
        elif isinstance(data, dict) and "token" in data:
            detail = " (Token JWT reçu)"
        print(f"  {GREEN} {name:45} [{method:6} {status}]{detail}")
    else:
        FAILED += 1
        msg = ""
        if isinstance(data, dict) and "message" in data:
            msg = f" → {data['message']}"
        elif isinstance(data, str) and len(data) < 80:
            msg = f" → {data}"
        print(f"  {RED} {name:45} [{method:6} {status} au lieu de {expect_status}]{msg}")
    return status, data

# ══════════════════════════════════════════════════════════════
print(f"\n{SECTION}")
print("  🧪 STOCKLY — TEST COMPLET DE TOUTES LES API")
print(SECTION)

# ── 1. AUTHENTIFICATION ──
print(f"\n📦 1. AUTHENTIFICATION (POST /api/auth)")
print("─" * 55)

# 1.1 Login avec bons identifiants
s, d = test("Login admin (identifiants corrects)", "POST", "/api/auth/login",
            {"username": "admin", "password": "admin123"}, 200, auth=False)
if s == 200 and "token" in d:
    TOKEN = d["token"]

# 1.2 Login avec mauvais identifiants
test("Login (mauvais mot de passe)", "POST", "/api/auth/login",
     {"username": "admin", "password": "wrongpassword"}, 401, auth=False)

# 1.3 Accès sans token
test("Accès sans token (doit être refusé)", "GET", "/api/produits", expect_status=403, auth=False)

# ── 2. CATÉGORIES ──
print(f"\n📦 2. CATÉGORIES (CRUD /api/categories)")
print("─" * 55)

test("GET toutes les catégories", "GET", "/api/categories")

# Créer une catégorie de test
s, cat = test("POST créer catégorie 'Test Auto'", "POST", "/api/categories",
              {"nom": "Test Auto", "description": "Catégorie créée par test"}, 201)
cat_id = cat.get("id") if isinstance(cat, dict) else None

if cat_id:
    test(f"GET catégorie par ID ({cat_id})", "GET", f"/api/categories/{cat_id}")
    test(f"PUT modifier catégorie ({cat_id})", "PUT", f"/api/categories/{cat_id}",
         {"nom": "Test Auto Modifié", "description": "Modifiée"})
    test(f"DELETE supprimer catégorie ({cat_id})", "DELETE", f"/api/categories/{cat_id}", expect_status=204)
    test(f"GET catégorie supprimée ({cat_id}) — 500 attendu", "GET", f"/api/categories/{cat_id}", expect_status=500)

# ── 3. PRODUITS ──
print(f"\n📦 3. PRODUITS (CRUD /api/produits)")
print("─" * 55)

test("GET tous les produits", "GET", "/api/produits")

# Récupérer un produit existant pour les tests suivants
s, produits = api("GET", "/api/produits")
existing_produit_id = produits[0]["id"] if isinstance(produits, list) and len(produits) > 0 else None

if existing_produit_id:
    test(f"GET produit par ID ({existing_produit_id})", "GET", f"/api/produits/{existing_produit_id}")

# Récupérer une catégorie existante pour le produit
s, cats = api("GET", "/api/categories")
existing_cat_id = cats[0]["id"] if isinstance(cats, list) and len(cats) > 0 else None

# Créer un produit de test
s, prod = test("POST créer produit 'Produit Test'", "POST", "/api/produits",
               {"nom": "Produit Test API " + UNIQUE_SUFFIX, "code": "TEST-API-" + UNIQUE_SUFFIX, "prixAchat": 10.0, "prixVente": 15.0,
                "quantiteStock": 100, "seuilAlerte": 5, "unite": "pièce",
                "categorieId": existing_cat_id}, 201)
prod_id = prod.get("id") if isinstance(prod, dict) else None

if prod_id:
    test(f"GET produit par code (TEST-API-{UNIQUE_SUFFIX})", "GET", f"/api/produits/code/TEST-API-{UNIQUE_SUFFIX}")
    test(f"PUT modifier produit ({prod_id})", "PUT", f"/api/produits/{prod_id}",
         {"nom": "Produit Test Modifié " + UNIQUE_SUFFIX, "code": "TEST-API-" + UNIQUE_SUFFIX, "prixAchat": 12.0, "prixVente": 18.0,
          "quantiteStock": 100, "seuilAlerte": 5, "unite": "pièce", "categorieId": existing_cat_id})

# ── 4. MOUVEMENTS DE STOCK ──
print(f"\n📦 4. MOUVEMENTS DE STOCK (/api/mouvements)")
print("─" * 55)

test("GET tous les mouvements", "GET", "/api/mouvements")

if prod_id:
    test(f"GET mouvements du produit ({prod_id})", "GET", f"/api/mouvements/produit/{prod_id}")
    test("POST mouvement ENTREE (+10)", "POST", "/api/mouvements",
         {"produitId": prod_id, "type": "ENTREE", "quantite": 10, "motif": "Test entrée stock"}, 201)
    test("POST mouvement SORTIE (-5)", "POST", "/api/mouvements",
         {"produitId": prod_id, "type": "SORTIE", "quantite": 5, "motif": "Test sortie stock"}, 201)

# ── 5. FOURNISSEURS ──
print(f"\n📦 5. FOURNISSEURS (CRUD /api/fournisseurs)")
print("─" * 55)

test("GET tous les fournisseurs", "GET", "/api/fournisseurs")

s, four = test("POST créer fournisseur 'Fournisseur Test'", "POST", "/api/fournisseurs",
               {"nom": "Fournisseur Test API", "email": "test@fournisseur.com",
                "telephone": "0600000001", "adresse": "123 Rue Test", "ville": "Fès", "pays": "Maroc"}, 201)
four_id = four.get("id") if isinstance(four, dict) else None

if four_id:
    test(f"GET fournisseur par ID ({four_id})", "GET", f"/api/fournisseurs/{four_id}")
    test("GET recherche fournisseur par nom", "GET", "/api/fournisseurs/search?nom=Test")
    test(f"PUT modifier fournisseur ({four_id})", "PUT", f"/api/fournisseurs/{four_id}",
         {"nom": "Fournisseur Test Modifié", "email": "modifie@test.com",
          "telephone": "0600000002", "adresse": "456 Rue Modifiée", "ville": "Casablanca", "pays": "Maroc"})

# ── 6. CLIENTS ──
print(f"\n📦 6. CLIENTS (CRUD /api/clients)")
print("─" * 55)

test("GET tous les clients", "GET", "/api/clients")

s, cli = test("POST créer client 'Client Test'", "POST", "/api/clients",
              {"nom": "Client", "prenom": "Test API", "email": "test@client.com",
               "telephone": "0611111112", "adresse": "789 Rue Client"}, 201)
cli_id = cli.get("id") if isinstance(cli, dict) else None

if cli_id:
    test(f"GET client par ID ({cli_id})", "GET", f"/api/clients/{cli_id}")
    test("GET recherche client par nom", "GET", "/api/clients/search?q=Test")
    test(f"PUT modifier client ({cli_id})", "PUT", f"/api/clients/{cli_id}",
         {"nom": "Client Modifié", "prenom": "Test", "email": "modifie@client.com",
          "telephone": "0611111113", "adresse": "Adresse modifiée"})

# ── 7. COMMANDES FOURNISSEURS ──
print(f"\n📦 7. COMMANDES FOURNISSEURS (/api/commandes)")
print("─" * 55)

test("GET toutes les commandes", "GET", "/api/commandes")

if four_id and prod_id:
    s, cmd = test("POST créer commande multi-lignes", "POST", "/api/commandes",
                  {"fournisseurId": four_id,
                   "lignes": [{"produitId": prod_id, "quantite": 20, "prixUnitaire": 10.0}]}, 201)
    cmd_id = cmd.get("id") if isinstance(cmd, dict) else None

    if cmd_id:
        test(f"GET commande par ID ({cmd_id})", "GET", f"/api/commandes/{cmd_id}")
        test(f"GET commandes du fournisseur ({four_id})", "GET", f"/api/commandes/fournisseur/{four_id}")
        test("GET commandes par statut EN_ATTENTE", "GET", "/api/commandes/statut/EN_ATTENTE")
        test(f"PUT confirmer commande ({cmd_id})", "PUT", f"/api/commandes/{cmd_id}/statut?statut=CONFIRMEE")
        test(f"PUT livrer commande ({cmd_id})", "PUT", f"/api/commandes/{cmd_id}/statut?statut=LIVREE")

# ── 8. VENTES ──
print(f"\n📦 8. VENTES (/api/ventes)")
print("─" * 55)

test("GET toutes les ventes", "GET", "/api/ventes")

if prod_id:
    s, vente = test("POST créer vente (client occasionnel)", "POST", "/api/ventes",
                    {"modePaiement": "ESPECES",
                     "lignes": [{"produitId": prod_id, "quantite": 2, "prixUnitaire": 18.0}]}, 201)
    vente_id = vente.get("id") if isinstance(vente, dict) else None

    if vente_id:
        test(f"GET vente par ID ({vente_id})", "GET", f"/api/ventes/{vente_id}")

    if cli_id:
        test("POST créer vente (avec client)", "POST", "/api/ventes",
             {"clientId": cli_id, "modePaiement": "CARTE",
              "lignes": [{"produitId": prod_id, "quantite": 1, "prixUnitaire": 18.0}]}, 201)
        test(f"GET ventes du client ({cli_id})", "GET", f"/api/ventes/client/{cli_id}")

# ── 9. VALIDATIONS MÉTIER ──
print(f"\n📦 9. VALIDATIONS MÉTIER (Sécurité des données)")
print("─" * 55)

if prod_id:
    test("POST vente quantité négative (doit échouer)", "POST", "/api/ventes",
         {"modePaiement": "ESPECES",
          "lignes": [{"produitId": prod_id, "quantite": -5, "prixUnitaire": 18.0}]}, 400)
    test("POST vente prix négatif (doit échouer)", "POST", "/api/ventes",
         {"modePaiement": "ESPECES",
          "lignes": [{"produitId": prod_id, "quantite": 1, "prixUnitaire": -10.0}]}, 400)
    test("POST vente quantité zéro (doit échouer)", "POST", "/api/ventes",
         {"modePaiement": "ESPECES",
          "lignes": [{"produitId": prod_id, "quantite": 0, "prixUnitaire": 18.0}]}, 400)

# ── 10. DASHBOARD ──
print(f"\n📦 10. DASHBOARD (/api/dashboard)")
print("─" * 55)

s, stats = test("GET statistiques dashboard", "GET", "/api/dashboard/stats")
if isinstance(stats, dict):
    for k, v in stats.items():
        if not isinstance(v, (dict, list)):
            print(f"     ├── {k}: {v}")

# ── 11. EXPORT EXCEL ──
print(f"\n📦 11. EXPORT EXCEL (/api/export)")
print("─" * 55)

for module in ["produits", "fournisseurs", "commandes", "clients", "ventes"]:
    test(f"GET export Excel {module}", "GET", f"/api/export/{module}", raw=True)

# ── 12. NETTOYAGE (suppression des données de test) ──
# Ordre : Ventes → Commandes → Produits → Clients → Fournisseurs (respecter les clés étrangères)
print(f"\n📦 12. NETTOYAGE (Suppression des données de test)")
print("─" * 55)

# Supprimer TOUTES les ventes créées pendant le test
if vente_id:
    test(f"DELETE vente de test ({vente_id})", "DELETE", f"/api/ventes/{vente_id}", expect_status=204)
# La 2ème vente (avec client) a l'id vente_id+1
if vente_id:
    test(f"DELETE 2ème vente de test ({vente_id+1})", "DELETE", f"/api/ventes/{vente_id+1}", expect_status=204)
# Supprimer la commande créée
if cmd_id:
    test(f"DELETE commande de test ({cmd_id})", "DELETE", f"/api/commandes/{cmd_id}", expect_status=204)
# Maintenant on peut supprimer les entités liées
if prod_id:
    test(f"DELETE produit de test ({prod_id})", "DELETE", f"/api/produits/{prod_id}", expect_status=204)
if cli_id:
    test(f"DELETE client de test ({cli_id})", "DELETE", f"/api/clients/{cli_id}", expect_status=204)
if four_id:
    test(f"DELETE fournisseur de test ({four_id})", "DELETE", f"/api/fournisseurs/{four_id}", expect_status=204)

# ══════════════════════════════════════════════════════════════
print(f"\n{SECTION}")
print(f"  🏁 RÉSULTAT FINAL")
print(f"     Tests réussis : {PASSED}/{TOTAL}")
print(f"     Tests échoués : {FAILED}/{TOTAL}")
if FAILED == 0:
    print(f"\n  🎉 TOUS LES TESTS SONT PASSÉS AVEC SUCCÈS !")
else:
    print(f"\n  {WARN} {FAILED} test(s) ont échoué. Vérifiez les erreurs ci-dessus.")
print(SECTION + "\n")
