import FadeIn from "@/Components/Animations/FadeIn";
import PageHead from "@/Components/Seo/PageHead";
import SurveyTable from "@/Components/Surveys/SurveyTable";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Survey, SurveyFilters, SurveyStats } from "@/types/surveys";
import { router } from "@inertiajs/react";
import { Calendar, CheckCircle2, Clock, FileText } from "lucide-react";
import { useMemo, useState } from "react";

interface Auteur {
    id: number;
    nom: string;
    prenom: string;
}

interface SurveysProps {
    stats: SurveyStats;
    surveys: Survey[];
    userRole: string;
    userId: number;
    auteurs: Auteur[];
}

const STATUTS = [
    { value: "all", label: "Tous les statuts" },
    { value: "active", label: "Active" },
    { value: "terminee", label: "Terminée" },
    { value: "a_venir", label: "À venir" },
    { value: "brouillon", label: "Brouillon" },
];

export default function Surveys({
    stats,
    surveys,
    userRole,
    userId,
    auteurs,
}: SurveysProps) {
    const [filters, setFilters] = useState<SurveyFilters>({
        search: "",
        statut: "all",
        type_campagne: "",
        auteur: "all",
        date_debut: "",
        date_fin: "",
    });

    const filtered = useMemo(() => {
        return surveys.filter((s) => {
            const matchSearch =
                filters.search === "" ||
                s.titre.toLowerCase().includes(filters.search.toLowerCase()) ||
                s.description
                    .toLowerCase()
                    .includes(filters.search.toLowerCase());

            const matchStatut =
                filters.statut === "all" || s.statut === filters.statut;

            const matchType =
                filters.type_campagne === "" ||
                s.type_campagne
                    .toLowerCase()
                    .includes(filters.type_campagne.toLowerCase());

            const matchAuteur =
                filters.auteur === "all" ||
                s.utilisateur_id === Number(filters.auteur);

            // Parsing dates for comparison (Format: DD/MM/YYYY)
            const parseDate = (dString: string) => {
                if (!dString) return null;
                const parts = dString.split("/");
                if (parts.length === 3)
                    return new Date(
                        `${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`,
                    );
                return null;
            };

            const sDebut = s.date_debut ? parseDate(s.date_debut) : null;
            const sFin = s.date_fin ? parseDate(s.date_fin) : null;
            const fDebut = filters.date_debut
                ? new Date(`${filters.date_debut}T00:00:00`)
                : null;
            const fFin = filters.date_fin
                ? new Date(`${filters.date_fin}T23:59:59`)
                : null;

            const matchDebut =
                !fDebut ||
                (sDebut && sDebut >= fDebut) ||
                (sFin && sFin >= fDebut);
            const matchFin =
                !fFin || (sFin && sFin <= fFin) || (sDebut && sDebut <= fFin);

            return (
                matchSearch &&
                matchStatut &&
                matchType &&
                matchAuteur &&
                matchDebut &&
                matchFin
            );
        });
    }, [surveys, filters]);

    const canCreate = userRole === "admin" || userRole === "superadmin";
    return (
        <>
            <PageHead
                title="Gestion des Enquêtes"
                description={`Gérez toutes vos enquêtes CFA. ${stats.total} enquêtes dans le système avec suivi détaillé des participations et conformité Qualiopi.`}
                keywords="gestion enquête, enquête CFA, suivi participation, réponses enquête"
            />

            <DashboardLayout
                title="Liste des Enquêtes"
                breadcrumbs={[
                    { label: "Accueil", href: "/tableau-de-bord" },
                    { label: "Enquêtes" },
                ]}
                actionButton={
                    canCreate
                        ? {
                              label: "Créer une enquête",
                              onClick: () => router.visit("/enquetes/creer"),
                          }
                        : undefined
                }
            >
                <div className="space-y-6 w-full">
                    {/* Stats */}
                    <FadeIn delay={0}>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                {
                                    label: "Total",
                                    value: stats.total,
                                    icon: FileText,
                                    color: "text-orange-500 bg-orange-50",
                                },
                                {
                                    label: "Actives",
                                    value: stats.active,
                                    icon: CheckCircle2,
                                    color: "text-green-600 bg-green-50",
                                },
                                {
                                    label: "Terminées",
                                    value: stats.terminee,
                                    icon: Clock,
                                    color: "text-gray-500 bg-gray-50",
                                },
                                {
                                    label: "À venir",
                                    value: stats.a_venir,
                                    icon: Calendar,
                                    color: "text-blue-500 bg-blue-50",
                                },
                            ].map(({ label, value, icon: Icon, color }) => (
                                <div
                                    key={label}
                                    className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {value}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {label}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </FadeIn>

                    {/* Filtres */}
                    <FadeIn delay={100}>
                        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
                            <div className="flex flex-wrap gap-3 items-center">
                                <input
                                    type="text"
                                    placeholder="Rechercher une enquête..."
                                    value={filters.search}
                                    onChange={(e) =>
                                        setFilters((f) => ({
                                            ...f,
                                            search: e.target.value,
                                        }))
                                    }
                                    className="flex-1 min-w-[200px] px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                />

                                <select
                                    value={filters.statut}
                                    onChange={(e) =>
                                        setFilters((f) => ({
                                            ...f,
                                            statut: e.target
                                                .value as SurveyFilters["statut"],
                                        }))
                                    }
                                    className="px-3 pr-8 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer text-gray-700 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.2em_1.2em] bg-[right_0.5rem_center] bg-no-repeat"
                                >
                                    {STATUTS.map((s) => (
                                        <option key={s.value} value={s.value}>
                                            {s.label}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={filters.auteur}
                                    onChange={(e) =>
                                        setFilters((f) => ({
                                            ...f,
                                            auteur:
                                                e.target.value === "all"
                                                    ? "all"
                                                    : Number(e.target.value),
                                        }))
                                    }
                                    className="px-3 pr-8 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer text-gray-700 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.2em_1.2em] bg-[right_0.5rem_center] bg-no-repeat"
                                >
                                    <option value="all">
                                        Tous les auteurs
                                    </option>
                                    {auteurs?.map((a) => (
                                        <option key={a.id} value={a.id}>
                                            {a.prenom} {a.nom}
                                        </option>
                                    ))}
                                </select>

                                <input
                                    type="text"
                                    placeholder="Type de campagne..."
                                    value={filters.type_campagne}
                                    onChange={(e) =>
                                        setFilters((f) => ({
                                            ...f,
                                            type_campagne: e.target.value,
                                        }))
                                    }
                                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 w-full sm:w-auto"
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
                                <div className="text-sm font-medium text-gray-700 flex items-center gap-2 mr-2">
                                    <div className="p-1.5 bg-orange-50 text-orange-600 rounded-md">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    Période de l'enquête :
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Du
                                    </span>
                                    <input
                                        type="date"
                                        value={filters.date_debut}
                                        onChange={(e) =>
                                            setFilters((f) => ({
                                                ...f,
                                                date_debut: e.target.value,
                                            }))
                                        }
                                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700 bg-gray-50 hover:bg-white transition-colors cursor-pointer"
                                    />
                                </div>

                                <div className="flex items-center gap-2 ml-2">
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Au
                                    </span>
                                    <input
                                        type="date"
                                        value={filters.date_fin}
                                        onChange={(e) =>
                                            setFilters((f) => ({
                                                ...f,
                                                date_fin: e.target.value,
                                            }))
                                        }
                                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700 bg-gray-50 hover:bg-white transition-colors cursor-pointer"
                                    />
                                </div>

                                {(filters.date_debut ||
                                    filters.date_fin ||
                                    filters.search ||
                                    filters.statut !== "all" ||
                                    filters.auteur !== "all" ||
                                    filters.type_campagne) && (
                                    <button
                                        onClick={() =>
                                            setFilters({
                                                search: "",
                                                statut: "all",
                                                type_campagne: "",
                                                auteur: "all",
                                                date_debut: "",
                                                date_fin: "",
                                            })
                                        }
                                        className="ml-auto px-4 py-2 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-transparent hover:border-orange-200"
                                    >
                                        Réinitialiser les filtres
                                    </button>
                                )}
                            </div>
                        </div>
                    </FadeIn>

                    {/* Tableau */}
                    <FadeIn delay={200}>
                        <SurveyTable
                            surveys={filtered}
                            userRole={userRole}
                            userId={userId}
                        />
                    </FadeIn>
                </div>
            </DashboardLayout>
        </>
    );
}
