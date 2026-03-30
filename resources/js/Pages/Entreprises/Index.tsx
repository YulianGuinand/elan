import FadeIn from "@/Components/Animations/FadeIn";
import EntrepriseCsvImport from "@/Components/Entreprises/EntrepriseCsvImport";
import EntrepriseForm from "@/Components/Entreprises/EntrepriseForm";
import EntrepriseTable from "@/Components/Entreprises/EntrepriseTable";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, router } from "@inertiajs/react";
import {
    List,
    PenLine,
    Search,
    Upload
} from "lucide-react";
import { useState } from "react";

type Tab = "saisie" | "import" | "liste";

interface Entreprise {
    id: number;
    raison_sociale: string | null;
    mail: string;
    telephone: string | null;
    ville: string | null;
    interlocuteur: string | null;
    created_at: string;
}

interface Props {
    entreprises: {
        data: Entreprise[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
    filters: {
        search: string;
        ville: string;
        contact: "all" | "with_contact" | "without_contact";
    };
    availableVilles: string[];
    stats: {
        total: number;
        with_contact: number;
    };
}

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
        id: "saisie",
        label: "Saisie Manuelle",
        icon: <PenLine className="w-4 h-4" />,
    },
    {
        id: "import",
        label: "Importation CSV",
        icon: <Upload className="w-4 h-4" />,
    },
    {
        id: "liste",
        label: "Liste des Entreprises",
        icon: <List className="w-4 h-4" />,
    },
];

export default function EntreprisesIndex({
    entreprises,
    filters: initialFilters,
    availableVilles,
    stats,
}: Props) {
    const [activeTab, setActiveTab] = useState<Tab>("liste");
    const [search, setSearch] = useState(initialFilters.search || "");
    const [ville, setVille] = useState(initialFilters.ville || "all");
    const [contact, setContact] = useState<
        "all" | "with_contact" | "without_contact"
    >(initialFilters.contact || "all");

    const applyFilters = (page: number = 1) => {
        router.get(
            route("entreprises.index"),
            {
                search: search || undefined,
                ville: ville !== "all" ? ville : undefined,
                contact: contact !== "all" ? contact : undefined,
                page,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const resetFilters = () => {
        setSearch("");
        setVille("all");
        setContact("all");
        router.get(
            route("entreprises.index"),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const getVisiblePages = (): Array<number | "..."> => {
        const current = entreprises.current_page;
        const last = entreprises.last_page;

        if (last <= 7) {
            return Array.from({ length: last }, (_, i) => i + 1) as Array<
                number | "..."
            >;
        }

        if (current <= 4) {
            return [1, 2, 3, 4, 5, "...", last];
        }

        if (current >= last - 3) {
            return [1, "...", last - 4, last - 3, last - 2, last - 1, last];
        }

        return [
            1,
            "...",
            current - 1,
            current,
            current + 1,
            "...",
            last,
        ];
    };

    return (
        <>
            <Head title="Gestion des Entreprises" />

            <DashboardLayout
                title="Gestion des Entreprises"
                breadcrumbs={[
                    { label: "Accueil", href: "/tableau-de-bord" },
                    { label: "Entreprises" },
                ]}
            >
                <div className="space-y-6 mb-24 w-full">
                    <FadeIn delay={0}>
                        {/* Description */}
                        <p className="text-gray-500 text-sm">
                            Ajoutez et gérez les entreprises partenaires de
                            votre centre de formation pour faciliter le suivi
                            des contrats d'apprentissage.
                        </p>

                        {/* Onglets */}
                        <div className="flex items-center border-b border-gray-200 gap-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                                        activeTab === tab.id
                                            ? "border-orange-500 text-orange-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </FadeIn>

                    <FadeIn delay={100} className="w-full">
                                {activeTab === "saisie" && (
                                    <div className="bg-white rounded-xl border border-gray-200 p-6 w-full">
                                        <EntrepriseForm />
                                    </div>
                                )}

                                {activeTab === "import" && (
                                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                                        <EntrepriseCsvImport />
                                    </div>
                                )}

                                {activeTab === "liste" && (
                                    <div className="space-y-4">
                                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    applyFilters(1);
                                                }}
                                                className="grid grid-cols-1 md:grid-cols-4 gap-3"
                                            >
                                                <div className="md:col-span-2 relative">
                                                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                                    <input
                                                        type="text"
                                                        value={search}
                                                        onChange={(e) =>
                                                            setSearch(
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Rechercher une entreprise..."
                                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                                    />
                                                </div>

                                                <select
                                                    value={ville}
                                                    onChange={(e) =>
                                                        setVille(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                                >
                                                    <option value="all">
                                                        Toutes les villes
                                                    </option>
                                                    {availableVilles.map((v) => (
                                                        <option
                                                            key={v}
                                                            value={v}
                                                        >
                                                            {v}
                                                        </option>
                                                    ))}
                                                </select>

                                                <select
                                                    value={contact}
                                                    onChange={(e) =>
                                                        setContact(
                                                            e.target
                                                                .value as
                                                                | "all"
                                                                | "with_contact"
                                                                | "without_contact",
                                                        )
                                                    }
                                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                                >
                                                    <option value="all">
                                                        Tous les contacts
                                                    </option>
                                                    <option value="with_contact">
                                                        Avec interlocuteur
                                                    </option>
                                                    <option value="without_contact">
                                                        Sans interlocuteur
                                                    </option>
                                                </select>

                                                <div className="md:col-span-4 flex flex-wrap gap-2 justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={resetFilters}
                                                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                                    >
                                                        Réinitialiser
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                                    >
                                                        Appliquer
                                                    </button>
                                                </div>
                                            </form>
                                        </div>

                                        <EntrepriseTable
                                            entreprises={entreprises.data}
                                            totalCount={entreprises.total}
                                        />

                                        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-4">
                                                <p className="text-sm text-gray-600">
                                                    Affichage de{" "}
                                                    <span className="font-semibold">
                                                        {entreprises.from ?? 0}
                                                    </span>{" "}
                                                    à{" "}
                                                    <span className="font-semibold">
                                                        {entreprises.to ?? 0}
                                                    </span>{" "}
                                                    sur{" "}
                                                    <span className="font-semibold">
                                                        {entreprises.total}
                                                    </span>
                                                </p>
                                                <div className="flex items-center gap-2 flex-wrap justify-end">
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            entreprises.current_page <=
                                                            1
                                                        }
                                                        onClick={() =>
                                                            applyFilters(
                                                                entreprises.current_page -
                                                                    1,
                                                            )
                                                        }
                                                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                                    >
                                                        Précédent
                                                    </button>

                                                    {getVisiblePages().map(
                                                        (page, index) =>
                                                            page === "..." ? (
                                                                <span
                                                                    key={`ellipsis-${index}`}
                                                                    className="px-2 text-sm text-gray-400"
                                                                >
                                                                    ...
                                                                </span>
                                                            ) : (
                                                                <button
                                                                    key={page}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        applyFilters(
                                                                            page,
                                                                        )
                                                                    }
                                                                    className={`min-w-[36px] px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                                                                        entreprises.current_page ===
                                                                        page
                                                                            ? "bg-orange-500 text-white border-orange-500"
                                                                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                                                    }`}
                                                                >
                                                                    {page}
                                                                </button>
                                                            ),
                                                    )}

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            entreprises.current_page >=
                                                            entreprises.last_page
                                                        }
                                                        onClick={() =>
                                                            applyFilters(
                                                                entreprises.current_page +
                                                                    1,
                                                            )
                                                        }
                                                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                                    >
                                                        Suivant
                                                    </button>
                                                </div>
                                            </div>
                                    </div>
                                )}

                        {activeTab !== "liste" && entreprises.data.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between my-4">
                                    <h2 className="text-sm font-semibold text-gray-800">
                                        Dernières entreprises ajoutées
                                    </h2>
                                    <button
                                        onClick={() => setActiveTab("liste")}
                                        className="text-xs font-medium text-orange-500 hover:text-orange-600 transition-colors"
                                    >
                                        Voir tout →
                                    </button>
                                </div>
                                <EntrepriseTable
                                    entreprises={entreprises.data.slice(0, 5)}
                                    totalCount={stats.total}
                                />
                            </div>
                        )}
                    </FadeIn>
                </div>
            </DashboardLayout>
        </>
    );
}
