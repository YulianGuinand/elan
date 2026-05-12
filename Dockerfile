FROM php:8.3-apache

RUN apt-get update && apt-get install -y \
    libpng-dev libonig-dev libxml2-dev zip unzip nodejs npm \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configuration d'Apache
RUN a2enmod rewrite
COPY ./apache.conf /etc/apache2/sites-available/000-default.conf

WORKDIR /var/www/html

# Copie du code source
COPY . .

# Installation des dépendances projet (production)
RUN composer install --no-dev --no-interaction --optimize-autoloader
RUN npm install && npm run build

# Attribution des permissions requises par Laravel
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache
