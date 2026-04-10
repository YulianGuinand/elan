import { Head } from "@inertiajs/react";

interface PageHeadProps {
    title: string;
    description?: string;
    canonical?: string;
    ogImage?: string;
    ogType?: string;
    twitterCard?: "summary" | "summary_large_image" | "app" | "player";
    keywords?: string;
}

export default function PageHead({
    title,
    description = "Elan - Système complet de gestion d'enquêtes pour centres de formation",
    canonical,
    ogImage = "/logo.svg",
    ogType = "website",
    twitterCard = "summary_large_image",
    keywords,
}: PageHeadProps) {
    const siteName = "Elan - CFA Survey Manager";
    const fullTitle = title === siteName ? title : `${title} | ${siteName}`;

    return (
        <Head title={fullTitle}>
            {/* Meta Tags essentiels */}
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="theme-color" content="#FF6B35" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta
                name="apple-mobile-web-app-status-bar-style"
                content="black-translucent"
            />

            {/* Open Graph */}
            <meta property="og:type" content={ogType} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content="fr_FR" />

            {/* Twitter Card */}
            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* Canonical */}
            {canonical && <link rel="canonical" href={canonical} />}

            {/* Additional SEO */}
            <meta
                name="robots"
                content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
            />
            <link rel="alternate" hrefLang="fr" href={canonical} />
        </Head>
    );
}
