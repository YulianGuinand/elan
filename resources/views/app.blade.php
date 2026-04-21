<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- SEO Meta Tags -->
    <meta name="description" content="Elan - Plateforme de gestion d'enquêtes pour centres de formation">
    <meta name="keywords" content="enquête CFA, centre formation, apprentis, insertion">
    <meta name="author" content="Elan">
    <meta name="theme-color" content="#FF6B35">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

    <!-- Open Graph Meta Tags -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="{{ config('app.name', 'Elan') }}">
    <meta property="og:description"
        content="Plateforme complète de gestion d'enquêtes pour centres de formation d'apprentis">
    <meta property="og:image" content="{{ asset('logo.svg') }}">
    <meta property="og:site_name" content="{{ config('app.name', 'Elan') }}">
    <meta property="og:locale" content="fr_FR">

    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ config('app.name', 'Elan') }}">
    <meta name="twitter:description" content="Plateforme de gestion d'enquêtes pour centres de formation">
    <meta name="twitter:image" content="{{ asset('logo.svg') }}">

    <!-- Search Engine Optimization -->
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <link rel="canonical" href="{{ url()->current() }}">
    <link rel="alternate" hrefLang="fr" href="{{ url()->current() }}">

    <!-- Apple Tags -->
    <link rel="apple-touch-icon" href="{{ asset('logo.svg') }}">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link rel="dns-prefetch" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <title inertia>{{ config('app.name', 'Elan') }}</title>

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
