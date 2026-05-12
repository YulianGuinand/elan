# Documentation des Tests - Elan

## Vue d'ensemble

Le projet utilise **Pest Framework** avec Laravel Testing pour une suite de tests complète qui couvre :
- Tests unitaires pour les modèles
- Tests fonctionnels pour les contrôleurs
- Factories pour la génération de données de test

## Structure des Tests

```
tests/
├── Feature/                          # Tests fonctionnels
│   ├── SeoControllerTest.php         # Tests sitemap.xml et robots.txt
│   ├── SurveyControllerTest.php      # Tests gestion enquêtes
│   ├── DashboardControllerTest.php   # Tests tableau de bord
│   └── ParticipantControllerTest.php # Tests gestion participants
│
├── Unit/
│   └── Models/                       # Tests modèles
│       ├── EnqueteModelTest.php      # Tests modèle Enquete
│       ├── QuestionModelTest.php     # Tests modèle Question
│       └── UtilisateurModelTest.php  # Tests modèle Utilisateur
│
├── Pest.php                          # Configuration Pest
└── TestCase.php                      # Classe de base avec helpers
```

## Factories Disponibles

### UtilisateurFactory
```php
Utilisateur::factory()->create();
Utilisateur::factory()->admin()->create();
Utilisateur::factory()->superAdmin()->create();
```

### EnqueteFactory
```php
Enquete::factory()->create();
Enquete::factory()->active()->create();
Enquete::factory()->closed()->create();
Enquete::factory()->draft()->create();
```

### ParticipantFactory
```php
Participant::factory()->create();
Participant::factory()->count(10)->create();
```

### QuestionFactory
```php
Question::factory()->create();
Question::factory()->count(5)->create();
```

### Type_ReponseFactory
```php
Type_Reponse::factory()->create();
```

## Helpers de Test (dans TestCase)

```php
// Créer et authentifier un utilisateur
$user = $this->createAuthenticatedUser();
$this->actingAsUser($user);

// Créer des utilisateurs avec rôles
$admin = $this->createAdminUser();
$superAdmin = $this->createSuperAdminUser();

// Créer des enquêtes
$survey = $this->createSurvey($user);
$activeSurvey = $this->createActiveSurvey($user);
```

## Exécution des Tests

### Exécuter tous les tests
```bash
php artisan test
```

### Exécuter tests Feature uniquement
```bash
php artisan test --testsuite=Feature
```

### Exécuter tests Unit uniquement
```bash
php artisan test --testsuite=Unit
```

### Exécuter un fichier de test spécifique
```bash
php artisan test tests/Feature/SeoControllerTest.php
```

### Exécuter avec couverture de code
```bash
php artisan test --coverage
```

### Exécuter avec détails verbeux
```bash
php artisan test --verbose
```

## Coverage par Test Suite

### Tests SEO Controller (8 tests)
- ✅ Retourne le sitemap XML avec bon Content-Type
- ✅ Structure XML correcte
- ✅ Inclut pages principales (home, dashboard, surveys)
- ✅ Inclut enquêtes actives
- ✅ Exclut enquêtes inactives
- ✅ Métadonnées (lastmod, changefreq, priority)
- ✅ URLs correctement échappées
- ✅ Gère un grand nombre d'enquêtes

### Tests Survey Controller (11 tests)
- ✅ Listing enquêtes (auth, permissions)
- ✅ Création (admin vs regular user)
- ✅ Remplissage enquête (public)
- ✅ Visualisation réponses (permissions)
- ✅ Édition (permissions)
- ✅ Suppression unique et en masse
- ✅ Duplication (permissions)

### Tests Dashboard Controller (6 tests)
- ✅ Accès (authentification)
- ✅ Affichage statistiques
- ✅ Données utilisateur
- ✅ Section enquêtes actives
- ✅ Informations utilisateur
- ✅ Performance avec nombreuses données

### Tests Participant Controller (14 tests)
- ✅ Listing (permissions)
- ✅ Import CSV (permissions)
- ✅ Créer/lire/modifier/supprimer
- ✅ Validation données
- ✅ Suppression en masse (superadmin)
- ✅ Aperçu CSV

### Tests Modèles (16 tests)

**Enquete** (8 tests):
- ✅ Création
- ✅ Relation utilisateur
- ✅ Relation questions
- ✅ Statuts (active, closed, draft)
- ✅ Filtrage par statut
- ✅ Attributs fillable
- ✅ Cast dates

**Question** (6 tests):
- ✅ Création
- ✅ Relations (enquete, type_reponse)
- ✅ Champs required
- ✅ Ordre par numero
- ✅ Attributs fillable

**Utilisateur** (8 tests):
- ✅ Création
- ✅ Relation enquêtes
- ✅ Rôles (admin, superadmin)
- ✅ Mot de passe caché
- ✅ Authentification hash

## Configuration Tests

### Fichier phpunit.xml
- Base de données: SQLite in-memory
- Environnement: testing
- Suites: Feature et Unit

### Variables d'environnement (.env.testing)
```
APP_ENV=testing
DB_CONNECTION=sqlite
DB_DATABASE=:memory:
MAIL_MAILER=array
QUEUE_CONNECTION=sync
```

## Bonnes Pratiques

1. **Tests isolés**: Chaque test doit être indépendant
2. **Noms explicites**: Les noms décrivent ce qui est testé
3. **Arrange-Act-Assert**: Structure claire
4. **Utiliser describe()**: Grouper les tests logiquement
5. **Réutiliser fixtures**: Utiliser beforeEach() pour setup commun

## Exemple de Test personnalisé

```php
<?php

use App\Models\Enquete;
use App\Models\Utilisateur;

describe('Ma Feature', function () {
    beforeEach(function () {
        $this->user = Utilisateur::factory()->create();
    });

    it('fait quelque chose', function () {
        $survey = Enquete::factory()->for($this->user, 'utilisateur')->create();

        $response = $this->actingAs($this->user)
            ->get("/enquetes/{$survey->id}");

        $response->assertStatus(200);
        expect($survey->titre)->toBeTruthy();
    });
});
```

## Débogage Tests

### Afficher les requêtes SQL
```php
DB::listen(function($query) {
    dump($query->sql);
    dump($query->bindings);
});
```

### Dump des données de test
```php
dump($response->viewData());
$response->dumpSession();
```

### Activer le debug mode
```bash
php artisan test --debug
```

## Intégration Continue

Les tests peuvent s'intégrer à une CI/CD pipeline (GitHub Actions, GitLab CI, etc.) :

```yaml
- name: Run Tests
  run: php artisan test --coverage --min=80
```

## Prochaines Étapes

- [ ] Ajouter tests pour ReportsController
- [ ] Ajouter tests pour FormationController
- [ ] Tester les Événements/Listeners
- [ ] Tests pour ExcelService
- [ ] Tests d'intégration E2E avec Playwright
- [ ] Augmenter coverage à >80%
