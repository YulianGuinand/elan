# Système de Gestion des Notifications

Version: 1.0.0
Date: 31 Mars 2026

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture technique](#architecture-technique)
3. [Fonctionnalités](#fonctionnalités)
4. [Structure de la base de données](#structure-de-la-base-de-données)
5. [Modes de fonctionnement](#modes-de-fonctionnement)
6. [Guide d'utilisation](#guide-dutilisation)
7. [Guide de déploiement](#guide-de-déploiement)
8. [Maintenance et monitoring](#maintenance-et-monitoring)

---

## Vue d'ensemble

Le système de gestion des notifications permet aux utilisateurs de recevoir et gérer des notifications en temps réel concernant les activités du système. Ce système est découpé en trois parties principales:

- Génération automatique des notifications via un système d'événements
- Gestion des préférences utilisateur
- Interface de consultation et gestion des notifications

### Fonctionnalités principales

- Création automatique de notifications via événements Laravel
- Préférences de notifications personnalisables par utilisateur
- Interface de gestion avec filtrage, recherche et pagination
- Marquage des notifications comme lues/non lues
- Suppression des notifications
- Compteur de notifications non lues en temps réel
- Notifications de type: email, enquêtes, réponses, rapports, mises à jour système

---

## Architecture technique

### Stack technologique

- Backend: Laravel 12.49.0
- Frontend: React 18 + TypeScript
- Base de données: MySQL
- ORM: Eloquent
- Framework UI: Tailwind CSS

### Composants système

#### Backend

1. **Models**
   - `Notification`: Représente une notification individuelle
   - `NotificationPreference`: Stocke les préférences utilisateur
   - `Utilisateur`: Modèle utilisateur (relation avec notifications)

2. **Controllers**
   - `NotificationsController`: Gère les opérations CRUD et pagination
   - `SettingsController`: Gère les préférences de notifications

3. **Events**
   - `SurveyCreated`: Déclenché à la création d'une enquête
   - `ResponseReceived`: Déclenché à la réception d'une réponse
   - `SurveyClosingSoon`: Préparé pour alerte de fermeture

4. **Listeners**
   - `CreateNotificationOnSurveyCreated`: Crée une notification pour les utilisateurs intéressés
   - `CreateNotificationOnResponseReceived`: Notifie le créateur de l'enquête
   - `CreateNotificationOnSurveyClosingSoon`: Alerte les utilisateurs

#### Frontend

1. **Pages**
   - `Notifications.tsx`: Page principale avec filtres, recherche et pagination
   - `Settings.tsx`: Paramètres utilisateur incluant préférences de notifications

2. **Composants**
   - `NotificationTable.tsx`: Tableau affichant les notifications
   - `Pagination.tsx`: Composant de pagination réutilisable

3. **Hooks**
   - `useUnreadNotificationCount()`: Récupère le nombre de notifications non lues toutes les 5 secondes

---

## Structure de la base de données

### Table: notifications

```sql
CREATE TABLE notifications (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    type VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message LONGTEXT NOT NULL,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_read_at (read_at),
    FOREIGN KEY (user_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);
```

### Table: notification_preferences

```sql
CREATE TABLE notification_preferences (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    email_notifications BOOLEAN DEFAULT 1,
    survey_reminders BOOLEAN DEFAULT 1,
    response_alerts BOOLEAN DEFAULT 1,
    weekly_reports BOOLEAN DEFAULT 1,
    system_updates BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);
```

### Types de notifications supportées

| Type | Description | Événement |
|------|-------------|-----------|
| `email_notifications` | Notifications email | Manuel |
| `survey_reminders` | Rappels d'enquête | SurveyCreated |
| `response_alerts` | Alertes de réponses | ResponseReceived |
| `weekly_reports` | Rapports hebdomadaires | Planifié (non implémenté) |
| `system_updates` | Mises à jour système | Manuel |

---

## Modes de fonctionnement

### Génération automatique des notifications

Les notifications sont générées automatiquement via le système d'événements Laravel:

#### 1. Création d'enquête

Lorsqu'une enquête est créée:
1. L'événement `SurveyCreated` est déclenché
2. Le listener `CreateNotificationOnSurveyCreated` s'active
3. Une notification est créée pour chaque utilisateur avec `survey_reminders = true`

#### 2. Réception de réponse

Lorsqu'une réponse est soumise:
1. L'événement `ResponseReceived` est déclenché
2. Le listener `CreateNotificationOnResponseReceived` s'active
3. Le créateur de l'enquête est notifié (si `response_alerts = true`)

#### 3. Mise à jour en temps réel

- Le composant `NotificationTable.tsx` affiche les notifications avec pagination
- Le hook `useUnreadNotificationCount()` sondage l'API toutes les 5 secondes pour le nombre non lues
- Le badge dans la sidebar affiche le nombre de notifications non lues

### Architecture événementielle synchrone

Les listeners s'exécutent de manière synchrone après le dispatch de l'événement. La structure transactionnelle garantit que les données sont consistantes en base de données.

---

## Guide d'utilisation

### Accès à la page Notifications

L'utilisateur accède à `/notifications` via:
- Le lien "Notifications" dans la sidebar
- Le badge affichant le nombre de notifications non lues

### Filtrage et recherche

La page offre les filtres suivants:

1. **Recherche**: Par titre ou message (recherche full-text)
2. **Type**: Filtrer par type de notification
3. **Statut**: Afficher les notifications lues/non lues/toutes

### Actions disponibles

1. **Marquer comme lu**: Cliquer sur l'icône de checkmark
2. **Supprimer**: Cliquer sur l'icône de corbeille
3. **Tout marquer comme lu**: Bouton en haut de page si des notifications non lues existent
4. **Pagination**: Navigation entre les pages (15 éléments par page par défaut)

### Gestion des préférences

L'utilisateur accède aux paramètres via `/parametres`:

1. Onglet "Notifications"
2. Activer/désactiver chaque type de notification
3. Soumettre les modifications

---

## Guide de déploiement

### Prérequis

- PHP 8.3+
- MySQL 8.0+
- Node.js 18+
- Composer
- Bun (ou NPM/Yarn)

### Étapes de déploiement

#### 1. Préparation du code

```bash
# Récupérer le code depuis le contrôle de version
git clone <repository>
cd elan

# Installer les dépendances PHP
composer install --optimize-autoloader --no-dev

# Installer les dépendances Node
bun install
```

#### 2. Configuration environnement

```bash
# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé applicative
php artisan key:generate

# Configurer la base de données dans .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=elan_prod
# DB_USERNAME=elan_user
# DB_PASSWORD=<secure_password>
```

#### 3. Exécution des migrations

```bash
# Exécuter les migrations de base de données
php artisan migrate --env=production

# Exécuter les seeders (optionnel, pour données de test)
php artisan db:seed --env=production
```

#### 4. Build des assets

```bash
# Build les assets React/TypeScript
bun run build

# Ou avec production flag explicite
NODE_ENV=production bun run build
```

#### 5. Configuration du cache et optimisation

```bash
# Regénérer le cache de configuration
php artisan config:cache

# Cache les routes
php artisan route:cache

# Cache les vues compilées
php artisan view:cache

# Optimiser l'autoloader Composer
composer install --optimize-autoloader --no-dev
```

#### 6. Configuration du serveur web

##### Apache

```apache
<VirtualHost *:80>
    ServerName elan.example.com
    DocumentRoot /var/www/elan/public

    <Directory /var/www/elan/public>
        AllowOverride All
        Order allow,deny
        Allow from all
        
        <IfModule mod_rewrite.c>
            RewriteEngine On
            RewriteCond %{REQUEST_FILENAME} !-f
            RewriteCond %{REQUEST_FILENAME} !-d
            RewriteRule ^ index.php [QSA,L]
        </IfModule>
    </Directory>

    <FilesMatch \.php$>
        SetHandler "proxy:unix:/run/php/php8.3-fpm.sock|fcgi://localhost"
    </FilesMatch>

    ErrorLog ${APACHE_LOG_DIR}/elan_error.log
    CustomLog ${APACHE_LOG_DIR}/elan_access.log combined
</VirtualHost>
```

##### Nginx

```nginx
server {
    listen 80;
    server_name elan.example.com;
    root /var/www/elan/public;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

#### 7. Permissions des fichiers

```bash
# Donner les permissions appropriées
chown -R www-data:www-data /var/www/elan
chmod -R 755 /var/www/elan
chmod -R 775 /var/www/elan/storage
chmod -R 775 /var/www/elan/bootstrap/cache
```

#### 8. Base de données - Snapshots des migrations

Avant le déploiement, exporter les migrations requises:

1. **Migration 01**: `create_notification_preferences_table.php`
2. **Migration 02**: `create_notifications_table.php`

Ces fichiers sont présents dans `database/migrations/` et exécutées automatiquement par `php artisan migrate`.

#### 9. Vérification post-déploiement

```bash
# Vérifier la santé de l'application
php artisan migrate:status

# Vérifier les permission des dossiers
ls -la public/
ls -la storage/

# Tester la connexion à la base de données
php artisan tinker
# Dans tinker: App\Models\User::count()

# Vérifier la compilation des assets
ls -la public/build/manifest.json
```

#### 10. Configuration des tâches planifiées (optionnel)

Ajouter à crontab pour les tâches schedulées (ex: fermeture d'enquête):

```bash
* * * * * cd /var/www/elan && php artisan schedule:run >> /dev/null 2>&1
```

---

## Maintenance et monitoring

### Logs d'application

Les logs sont situés dans `storage/logs/`:

```bash
# Afficher les logs en temps réel
tail -f storage/logs/laravel.log

# Chercher les erreurs de notifications
grep "Notification" storage/logs/laravel.log
grep "ERROR" storage/logs/laravel.log
```

### Performance

#### Indexation base de données

Les index suivants sont essentiels pour la performance:

```sql
-- Déjà presente dans la migration
-- Index sur user_id pour les requêtes par utilisateur
INDEX idx_user_id (user_id)

-- Index sur read_at pour les requêtes de notifications non lues
INDEX idx_read_at (read_at)
```

#### Optimisation des requêtes

- Les requêtes utilisent Eloquent ORM qui cache les relations
- Pagination: 15 notifications par page (configurable via `per_page`)
- Lazy loading des utilisateurs dans les relations

### Nettoyage des données

Auto-nettoyage via contrainte ON DELETE CASCADE:
- Les notifications d'un utilisateur supprimé sont automatiquement supprimées

### Monitoring recommandé

1. **Métriques de performance**
   - Temps de réponse des endpoints `/notifications`
   - Nombre de notifications créées par jour
   - Taux d'erreur (500)

2. **Alertes**
   - Erreurs lors de la création de notifications
   - Augmentation anormale du nombre de notifications
   - Failures côté base de données

### Mise à jour future

Lors de maintenant une version future:

1. **Scheduler pour SurveyClosingSoon**: Implementation du listener pour les alertes de fermeture
2. **Notifications par email**: Integration avec queue et mail
3. **WebSocket**: Remplacer le polling par une solution temps réel via Pusher/Laravel Echo
4. **Archive des notifications**: Archiver les anciennes notifications automatiquement

---

## Tables de référence rapide

### Routes

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/notifications` | Lister les notifications |
| GET | `/notifications/unread-count` | Nombre de notifications non lues |
| PATCH | `/notifications/{id}/mark-as-read` | Marquer comme lue |
| PATCH | `/notifications/mark-all-as-read` | Marquer tout comme lu |
| DELETE | `/notifications/{id}` | Supprimer |
| GET/PATCH | `/parametres` | Gérer les préférences |

### Points d'extension

Le système est conçu pour permettre l'addition facile de:

1. Nouveaux types de notifications: Ajouter un nouveau type dans les constantes
2. Nouveaux événements: Créer un nouveau Event et Listener
3. Nouvelles actions: Ajouter des méthodes dans `NotificationsController`

---

## Support et documentation supplémentaire

Pour toute question ou amélioration, consulter:

- Documentation Laravel: https://laravel.com/docs/12.x
- Documentation React: https://react.dev
- Documentation TypeScript: https://www.typescriptlang.org/docs

---
