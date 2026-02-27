import EntrepriseCsvImport from "@/Components/Entreprises/EntrepriseCsvImport";
import EntrepriseForm from "@/Components/Entreprises/EntrepriseForm";
import EntrepriseTable from "@/Components/Entreprises/EntrepriseTable";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head } from "@inertiajs/react";
import {
    Building2,
    FileText,
    List,
    PenLine,
    Upload,
    Users,
    Zap,
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
    entreprises: Entreprise[];
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

export default function EntreprisesIndex({ entreprises }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>("saisie");

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
                <div className="space-y-6">
                    {/* Description */}
                    <p className="text-gray-500 text-sm">
                        Ajoutez et gérez les entreprises partenaires de votre
                        centre de formation pour faciliter le suivi des contrats
                        d'apprentissage.
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

                    {/* Contenu principal + panneau latéral */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Contenu principal (2/3) */}
                        <div className="xl:col-span-2">
                            {activeTab === "saisie" && (
                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                    <EntrepriseForm />
                                </div>
                            )}

                            {activeTab === "import" && (
                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                    <EntrepriseCsvImport />
                                </div>
                            )}

                            {activeTab === "liste" && (
                                <EntrepriseTable entreprises={entreprises} />
                            )}
                        </div>

                        {/* Panneau latéral droit (1/3) */}
                        <div className="space-y-4">
                            {/* Bloc importation CSV rapide */}
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-7 h-7 bg-orange-100 rounded-md flex items-center justify-center">
                                        <FileText className="w-4 h-4 text-orange-500" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-800">
                                        Importation CSV
                                    </h3>
                                </div>
                                <p className="text-xs text-gray-500 mb-4">
                                    Ajoutez plusieurs entreprises en une seule
                                    fois en téléchargeant votre fichier.
                                </p>

                                {/* Zone mini drag & drop visuelle */}
                                <button
                                    onClick={() => setActiveTab("import")}
                                    className="w-full border-2 border-dashed border-orange-300 rounded-lg p-5 flex flex-col items-center bg-orange-50 hover:bg-orange-100 transition-colors"
                                >
                                    <Upload className="w-8 h-8 text-orange-400 mb-2" />
                                    <p className="text-xs font-semibold text-gray-700">
                                        Glissez-déposez votre fichier
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Format accepté : .CSV, .XLSX (Max 10Mo)
                                    </p>
                                    <span className="mt-2 text-xs font-medium text-orange-500 underline underline-offset-2">
                                        ou parcourir vos fichiers
                                    </span>
                                </button>

                                <button
                                    onClick={() => setActiveTab("import")}
                                    className="mt-3 w-full flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-orange-500 transition-colors py-1"
                                >
                                    <FileText className="w-3.5 h-3.5" />
                                    Télécharger le modèle
                                </button>
                            </div>

                            {/* Bloc pourquoi ajouter des entreprises */}
                            <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
                                <div className="flex items-start gap-2 mb-3">
                                    <Zap className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                    <h3 className="text-sm font-semibold text-orange-800">
                                        Pourquoi ajouter des entreprises ?
                                    </h3>
                                </div>
                                <ul className="space-y-2">
                                    {[
                                        {
                                            icon: (
                                                <FileText className="w-3.5 h-3.5 text-orange-500 flex-shrink-0 mt-0.5" />
                                            ),
                                            text: "Générer automatiquement les contrats d'apprentissage.",
                                        },
                                        {
                                            icon: (
                                                <Users className="w-3.5 h-3.5 text-orange-500 flex-shrink-0 mt-0.5" />
                                            ),
                                            text: "Suivre les visites en entreprise des tuteurs.",
                                        },
                                        {
                                            icon: (
                                                <Building2 className="w-3.5 h-3.5 text-orange-500 flex-shrink-0 mt-0.5" />
                                            ),
                                            text: "Gérer la facturation de la taxe d'apprentissage.",
                                        },
                                    ].map((item, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-2"
                                        >
                                            {item.icon}
                                            <span className="text-xs text-orange-700">
                                                {item.text}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Bloc statistiques */}
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                                    Aperçu rapide
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                                        <p className="text-2xl font-bold text-orange-500">
                                            {entreprises.length}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Entreprises
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                                        <p className="text-2xl font-bold text-orange-500">
                                            {
                                                entreprises.filter(
                                                    (e) => e.interlocuteur,
                                                ).length
                                            }
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Avec contact
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Récapitulatif dernières entreprises (visible si onglet saisie ou import) */}
                    {activeTab !== "liste" && entreprises.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-3">
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
                                entreprises={entreprises.slice(0, 5)}
                            />
                        </div>
                    )}
                </div>
            </DashboardLayout>
        </>
    );
}
