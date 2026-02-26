import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";
import {
    BarChart3,
    Check,
    CheckCircle2,
    Globe2,
    MousePointer2,
    Phone,
    Shield,
    Users,
    Zap,
} from "lucide-react";

export default function Welcome({
    auth,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <>
            <Head title="CFA Survey Manager - Pilotage d'enquêtes pour centres de formation" />

            <div className="min-h-screen bg-white">
                {/* Navigation */}
                <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            {/* Logo */}
                            <div className="flex items-center gap-2">
                                <img
                                    src="/logo.svg"
                                    alt="Elan Logo"
                                    className="h-20 w-auto"
                                />
                            </div>

                            {/* Desktop Menu */}
                            <div className="hidden md:flex items-center gap-8">
                                <a
                                    href="#pourquoi-nous"
                                    className="text-sm font-medium text-gray-600 hover:text-elan-orange transition-colors"
                                >
                                    Pourquoi nous ?
                                </a>
                                <a
                                    href="#fonctionnalites"
                                    className="text-sm font-medium text-gray-600 hover:text-elan-orange transition-colors"
                                >
                                    Fonctionnalités
                                </a>
                                <a
                                    href="#temoignages"
                                    className="text-sm font-medium text-gray-600 hover:text-elan-orange transition-colors"
                                >
                                    Témoignages
                                </a>
                            </div>

                            {/* Auth Actions */}
                            <div className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route("dashboard")}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-elan-orange hover:bg-elan-orange/85 transition-colors shadow-sm"
                                    >
                                        Accéder au tableau de bord
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route("login")}
                                            className="hidden sm:block text-sm font-medium text-gray-700 hover:text-gray-900"
                                        >
                                            Connexion
                                        </Link>
                                        <Link
                                            href={route("register")}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-elan-orange hover:bg-elan-orange/85 transition-colors shadow-sm shadow-orange-200"
                                        >
                                            Demander de s&apos;inscrire
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="pt-32 pb-20 relative overflow-hidden">
                    {/* Background Blobs */}
                    <div className="absolute top-0 right-0 -z-10 translate-x-1/3 -translate-y-1/4">
                        <div className="w-[800px] h-[800px] bg-orange-50 rounded-full blur-3xl opacity-50" />
                    </div>
                    <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/3 translate-y-1/4">
                        <div className="w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50" />
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                            {/* Text Content */}
                            <div className="space-y-8 animate-fadeIn">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider">
                                    <Shield className="w-3 h-3" />
                                    Solution certifiée Qualiopi
                                </div>

                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                                    Simplifiez le pilotage de vos{" "}
                                    <span className="text-elan-orange">
                                        enquêtes CFA
                                    </span>
                                </h1>

                                <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                                    La plateforme tout-en-un conçue
                                    spécifiquement pour les Centres de Formation
                                    d'Apprentis. Automatisez vos enquêtes
                                    d'insertion, conformez-vous aux exigences
                                    Qualiopi et boostez votre taux de réponse.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link
                                        href={route("register")}
                                        className="inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-base font-semibold rounded-xl text-white bg-elan-orange hover:bg-elan-orange/85 transition-all"
                                    >
                                        Demander une démo
                                    </Link>
                                    <button className="inline-flex justify-center items-center px-8 py-3.5 border border-gray-200 text-base font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all">
                                        En savoir plus
                                    </button>
                                </div>
                            </div>

                            {/* Visual/Dashboard Mockup */}
                            <div className="relative animate-slideUp delay-200">
                                <div className="relative rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
                                    {/* Fake Browser Header */}
                                    <div className="h-8 bg-gray-50 border-b border-gray-200 flex items-center px-4 gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-400" />
                                        <div className="w-3 h-3 rounded-full bg-amber-400" />
                                        <div className="w-3 h-3 rounded-full bg-green-400" />
                                    </div>

                                    {/* Dashboard Content Mock */}
                                    <div className="p-6 space-y-6">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="font-bold text-gray-900">
                                                    Tableau de bord
                                                </h3>
                                                <p className="text-xs text-gray-500">
                                                    Vue d&apos;ensemble
                                                </p>
                                            </div>
                                            <div className="h-8 w-24 bg-gray-100 rounded-lg animate-pulse" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                                                <div className="text-orange-600 mb-2">
                                                    <Users className="w-5 h-5" />
                                                </div>
                                                <div className="text-2xl font-bold text-gray-900">
                                                    1,240
                                                </div>
                                                <div className="text-xs text-orange-700">
                                                    Apprenants suivis
                                                </div>
                                            </div>
                                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                                <div className="text-blue-600 mb-2">
                                                    <BarChart3 className="w-5 h-5" />
                                                </div>
                                                <div className="text-2xl font-bold text-gray-900">
                                                    92%
                                                </div>
                                                <div className="text-xs text-blue-700">
                                                    Taux d'insertion
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {[1, 2, 3].map((i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-gray-200" />
                                                    <div className="flex-1 space-y-1">
                                                        <div className="h-2 w-24 bg-gray-200 rounded" />
                                                        <div className="h-2 w-16 bg-gray-100 rounded" />
                                                    </div>
                                                    <div className="h-6 w-16 bg-green-100 rounded-full text-xs text-green-700 flex items-center justify-center font-medium">
                                                        Conforme
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Badges - More Dynamic */}
                                <div
                                    className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex flex-col items-center gap-1 animate-bounce-slow"
                                    style={{ animationDelay: "1s" }}
                                >
                                    <div className="text-2xl font-bold text-elan-orange">
                                        7/7
                                    </div>
                                    <div className="text-xs text-gray-500 font-medium">
                                        Critères Qualiopi
                                    </div>
                                </div>

                                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce-slow">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">
                                            Export France Compétences
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Format XML Validé
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Us Section / Bento Grid Redesigned */}
                <section id="pourquoi-nous" className="py-24 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
                                Pour les CFA qui visent l'excellence
                            </h2>
                            <p className="text-lg text-gray-600">
                                Une suite d'outils pensée pour répondre
                                précisément aux besoins des responsables qualité
                                et des directeurs de CFA.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Large Card */}
                            <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex flex-col h-full justify-between">
                                    <div className="mb-6">
                                        <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-elan-orange mb-6">
                                            <Zap className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                            Gestion Centralisée des Relances
                                        </h3>
                                        <p className="text-gray-600 text-lg">
                                            Optimisez vos campagnes de relance.
                                            Notre système vous permet de suivre
                                            précisément chaque participant et de
                                            gérer vos envois d&apos;emails et
                                            appels téléphoniques en quelques
                                            clics.
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-600">
                                            Suivi J+30
                                        </div>
                                        <div className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-600">
                                            Complétion en direct
                                        </div>
                                        <div className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-600">
                                            Alertes Rupture
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tall Card */}
                            <div className="md:row-span-2 bg-elan-blue rounded-3xl p-8 shadow-lg text-white relative overflow-hidden">
                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <div>
                                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-6 backdrop-blur-sm">
                                            <Shield className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3">
                                            Conformité Totale
                                        </h3>
                                        <p className="text-gray-300 mb-6">
                                            Soyez serein face aux audits. Toutes
                                            vos données sont sécurisées, tracées
                                            et exportables au format requis par
                                            France Compétences.
                                        </p>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                                                <span>
                                                    Audit Qualiopi Ready
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                                                <span>Conforme RGPD</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                                                <span>Serveurs en France</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Medium Card */}
                            <div className="bg-elan-orange rounded-3xl p-8 shadow-lg text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-6 backdrop-blur-sm">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">
                                        Suivi Individualisé
                                    </h3>
                                    <p className="text-orange-100 text-sm">
                                        Chaque apprenant dispose d'une fiche
                                        détaillée avec son historique d'enquêtes
                                        et son statut d'insertion.
                                    </p>
                                </div>
                            </div>

                            {/* Small Card */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                                    <BarChart3 className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Statistiques Détaillées
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Exportez vos données et visualisez vos
                                    indicateurs clés pour vos conseils de
                                    perfectionnement.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Detailed Features Section */}
                <section
                    id="fonctionnalites"
                    className="py-24 bg-white overflow-hidden"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-20">
                            <span className="text-elan-orange font-bold tracking-wider uppercase text-sm">
                                Fonctionnalités Clés
                            </span>
                            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mt-2">
                                Tout ce dont vous avez besoin pour piloter
                            </h2>
                        </div>

                        <div className="space-y-24">
                            {/* Feature 1 */}
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div className="order-2 lg:order-1 relative">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-orange-100 to-blue-50 rounded-3xl transform rotate-3 scale-95" />
                                    <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                                        {/* Mock UI for Survey Builder */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between border-b pb-4">
                                                <div className="font-bold text-gray-800">
                                                    Éditeur d'enquête
                                                </div>
                                                <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                                    Actif
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex gap-3">
                                                    <div className="w-4 h-4 mt-1 rounded border-2 border-gray-300" />
                                                    <div className="h-2 w-3/4 bg-gray-200 rounded" />
                                                </div>
                                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex gap-3">
                                                    <div className="w-4 h-4 mt-1 rounded border-2 border-gray-300" />
                                                    <div className="h-2 w-1/2 bg-gray-200 rounded" />
                                                </div>
                                            </div>
                                            <div className="flex gap-2 justify-end mt-4">
                                                <div className="px-4 py-2 bg-elan-orange text-white rounded-lg text-xs font-bold shadow-lg shadow-orange-200">
                                                    Enregistrer
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="order-1 lg:order-2 space-y-6">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                                        <MousePointer2 className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-gray-900">
                                        Créez des enquêtes sur-mesure
                                    </h3>
                                    <p className="text-lg text-gray-600">
                                        Un éditeur Drag & Drop intuitif pour
                                        créer des questionnaires adaptés à vos
                                        filières. Logique conditionnelle,
                                        multiples types de questions et
                                        templates pré-configurés pour
                                        l'insertion professionnelle (6 mois, 12
                                        mois, 24 mois).
                                    </p>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-3 text-gray-700">
                                            <Check className="w-5 h-5 text-elan-orange" />
                                            <span>
                                                Templates "Insertion Jeunes"
                                                inclus
                                            </span>
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-700">
                                            <Check className="w-5 h-5 text-elan-orange" />
                                            <span>
                                                Compatible mobile & tablette
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-gray-900">
                                        Suivi Multicanal Centralisé
                                    </h3>
                                    <p className="text-lg text-gray-600">
                                        Atteignez vos anciens apprentis là où
                                        ils sont. Notre plateforme centralise
                                        les réponses reçues par email ou saisies
                                        lors d'appels téléphoniques. Une vue
                                        unique pour un suivi efficace.
                                    </p>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-3 text-gray-700">
                                            <Check className="w-5 h-5 text-elan-orange" />
                                            <span>
                                                Historique complet des
                                                interactions
                                            </span>
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-700">
                                            <Check className="w-5 h-5 text-elan-orange" />
                                            <span>
                                                Import/Export CSV facile
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-bl from-green-50 to-orange-50 rounded-3xl transform -rotate-3 scale-95" />
                                    <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                                        {/* Mock UI for Communications */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                    JM
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-bold text-gray-900">
                                                        Julien M.
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Réponse via formulaire
                                                    </div>
                                                </div>
                                                <div className="text-xs font-bold text-green-600">
                                                    Complet
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold">
                                                    SL
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-bold text-gray-900">
                                                        Sarah L.
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Appel sortant (12m 30s)
                                                    </div>
                                                </div>
                                                <div className="text-xs font-bold text-orange-600">
                                                    À rappeler
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                                                    TB
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-bold text-gray-900">
                                                        Thomas B.
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Email ouvert
                                                    </div>
                                                </div>
                                                <div className="text-xs font-bold text-gray-400">
                                                    En attente
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="relative rounded-3xl overflow-hidden bg-orange-50 px-8 py-16 sm:px-16 sm:py-20 text-center border border-orange-100">
                            {/* Decorative */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                            <div className="relative z-10 space-y-8">
                                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                                    Prêt à transformer la gestion
                                    <br />
                                    de vos enquêtes ?
                                </h2>
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                    Rejoignez les 200+ centres de formation qui
                                    font confiance à notre expertise pour leur
                                    pilotage qualité et insertion.
                                </p>
                                <div className="flex flex-col sm:flex-row justify-center gap-4">
                                    <Link
                                        href={route("register")}
                                        className="inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-base font-semibold rounded-xl text-white bg-elan-orange hover:bg-elan-orange/85 transition-all shadow-lg shadow-orange-200"
                                    >
                                        Demander une inscription
                                    </Link>
                                    <button className="inline-flex justify-center items-center px-8 py-3.5 border border-gray-200 text-base font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all">
                                        Voir les avantages
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-100 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-4 gap-8">
                            <div className="col-span-1 md:col-span-1 space-y-4">
                                <div className="flex items-center gap-2">
                                    <img
                                        src="/logo.svg"
                                        alt="Elan Logo"
                                        className="h-20 w-auto"
                                    />
                                </div>
                                <p className="text-sm text-gray-500">
                                    Solution de gestion d&apos;enquêtes dédiée
                                    aux CFA. Facilitez le suivi de
                                    l&apos;insertion professionnelle et la
                                    conformité Qualiopi.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-4">
                                    Navigation
                                </h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>
                                        <a
                                            href="#pourquoi-nous"
                                            className="hover:text-elan-orange"
                                        >
                                            Pourquoi nous ?
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#fonctionnalites"
                                            className="hover:text-elan-orange"
                                        >
                                            Fonctionnalités
                                        </a>
                                    </li>
                                    <li>
                                        <Link
                                            href={route("login")}
                                            className="hover:text-elan-orange"
                                        >
                                            Connexion
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={route("register")}
                                            className="hover:text-elan-orange"
                                        >
                                            Inscription
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-4">
                                    Légal
                                </h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-elan-orange"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                alert(
                                                    "Page en cours de développement"
                                                );
                                            }}
                                        >
                                            Mentions légales
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-elan-orange"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                alert(
                                                    "Page en cours de développement"
                                                );
                                            }}
                                        >
                                            Politique de confidentialité
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-elan-orange"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                alert(
                                                    "Page en cours de développement"
                                                );
                                            }}
                                        >
                                            RGPD
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="mailto:contact@elan-formation.fr"
                                            className="hover:text-elan-orange"
                                        >
                                            Contact
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                            <p>
                                © 2024 CFA Survey Manager. Tous droits réservés.
                            </p>
                            <div className="flex gap-4">
                                <Globe2 className="w-4 h-4 cursor-pointer hover:text-gray-900" />
                                <Shield className="w-4 h-4 cursor-pointer hover:text-gray-900" />
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

// Subcomponents for clearer structure
function FeatureCard({
    icon,
    title,
    description,
    color,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
}) {
    return (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 group">
            <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${color} group-hover:scale-110 transition-transform`}
            >
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
    );
}

function BenefitRow({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-elan-orange">
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
        </div>
    );
}
