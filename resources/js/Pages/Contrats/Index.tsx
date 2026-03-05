import FadeIn from "@/Components/Animations/FadeIn";
import DropdownMenu, {
    DropdownDivider,
    DropdownItem,
} from "@/Components/Common/DropdownMenu";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { PageProps } from "@/types";
import { Head, router, usePage } from "@inertiajs/react";
import { Briefcase, Edit, Eye, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";

interface Participant {
    id: number;
    nom: string;
    prenom: string;
    role: string;
}

interface Ecole {
    id: number;
    libelle: string;
}

interface Entreprise {
    id: number;
    raison_sociale: string;
}

interface Formation {
    id: number;
    libelle: string;
}

interface Contrat {
    id: number;
    participant: Participant;
    ecole: Ecole;
    entreprise?: Entreprise;
    formation: Formation;
    utilisateur_id: number;
    date_entree?: string;
    date_sortiee?: string;
    created_at: string;
}

interface Props {
    contrats: any; // Paginator instance
    filters: { search?: string };
}

export default function ContratsIndex({ contrats, filters }: Props) {
    const { auth } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route("contrats.index"),
            { search },
            { preserveState: true },
        );
    };

    return (
        <>
            <Head title="Gestion des Contrats" />

            <DashboardLayout
                title="Gestion des Contrats"
                breadcrumbs={[
                    { label: "Accueil", href: "/tableau-de-bord" },
                    { label: "Contrats" },
                ]}
                actionButton={
                    auth.user.role === "superadmin" ||
                    auth.user.role === "admin"
                        ? {
                              label: "Créer un contrat",
                              onClick: () =>
                                  router.get(route("contrats.create")),
                          }
                        : undefined
                }
            >
                <div className="space-y-6">
                    <FadeIn delay={0}>
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <p className="text-gray-600 text-sm">
                                Visualisez et gérez les contrats liant les
                                participants, les écoles et les entreprises.
                            </p>

                            <form
                                onSubmit={handleSearch}
                                className="flex gap-2"
                            >
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Chercher un participant..."
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elan-orange focus:border-transparent outline-none"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Chercher
                                </button>
                            </form>
                        </div>
                    </FadeIn>

                    <FadeIn delay={100}>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                                            <th className="px-6 py-4 font-semibold">
                                                Participant
                                            </th>
                                            <th className="px-6 py-4 font-semibold hidden md:table-cell">
                                                Formation & École
                                            </th>
                                            <th className="px-6 py-4 font-semibold hidden lg:table-cell">
                                                Entreprise
                                            </th>
                                            <th className="px-6 py-4 font-semibold text-right">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {contrats.data.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="px-6 py-12 text-center text-gray-500"
                                                >
                                                    Aucun contrat trouvé.
                                                </td>
                                            </tr>
                                        ) : (
                                            contrats.data.map(
                                                (contrat: Contrat) => (
                                                    <tr
                                                        key={contrat.id}
                                                        className="hover:bg-gray-50 transition-colors"
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                                                                    {contrat.participant.prenom
                                                                        .charAt(
                                                                            0,
                                                                        )
                                                                        .toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-gray-900">
                                                                        {
                                                                            contrat
                                                                                .participant
                                                                                .prenom
                                                                        }{" "}
                                                                        {
                                                                            contrat
                                                                                .participant
                                                                                .nom
                                                                        }
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        {
                                                                            contrat
                                                                                .participant
                                                                                .role
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 hidden md:table-cell text-gray-600">
                                                            <p className="font-medium text-gray-900">
                                                                {
                                                                    contrat
                                                                        .formation
                                                                        .libelle
                                                                }
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {
                                                                    contrat
                                                                        .ecole
                                                                        .libelle
                                                                }
                                                            </p>
                                                        </td>
                                                        <td className="px-6 py-4 hidden lg:table-cell text-gray-500">
                                                            {contrat.entreprise ? (
                                                                <div className="flex items-center gap-1.5">
                                                                    <Briefcase className="w-4 h-4 text-gray-400" />
                                                                    {
                                                                        contrat
                                                                            .entreprise
                                                                            .raison_sociale
                                                                    }
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400 italic">
                                                                    Non
                                                                    renseignée
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <DropdownMenu
                                                                trigger={
                                                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                                        <MoreVertical className="w-5 h-5 text-gray-600" />
                                                                    </button>
                                                                }
                                                            >
                                                                <DropdownItem
                                                                    onClick={() =>
                                                                        router.get(
                                                                            route(
                                                                                "contrats.show",
                                                                                contrat.id,
                                                                            ),
                                                                        )
                                                                    }
                                                                    icon={
                                                                        <Eye className="w-4 h-4" />
                                                                    }
                                                                >
                                                                    Voir
                                                                </DropdownItem>

                                                                {(auth.user
                                                                    .role ===
                                                                    "superadmin" ||
                                                                    (auth.user
                                                                        .role ===
                                                                        "admin" &&
                                                                        contrat.utilisateur_id ===
                                                                            auth
                                                                                .user
                                                                                .id)) && (
                                                                    <>
                                                                        <DropdownItem
                                                                            onClick={() =>
                                                                                router.get(
                                                                                    route(
                                                                                        "contrats.edit",
                                                                                        contrat.id,
                                                                                    ),
                                                                                )
                                                                            }
                                                                            icon={
                                                                                <Edit className="w-4 h-4" />
                                                                            }
                                                                        >
                                                                            Modifier
                                                                        </DropdownItem>
                                                                        <DropdownDivider />
                                                                        <DropdownItem
                                                                            onClick={() => {
                                                                                if (
                                                                                    confirm(
                                                                                        "Supprimer ce contrat ?",
                                                                                    )
                                                                                ) {
                                                                                    router.delete(
                                                                                        route(
                                                                                            "contrats.destroy",
                                                                                            contrat.id,
                                                                                        ),
                                                                                    );
                                                                                }
                                                                            }}
                                                                            icon={
                                                                                <Trash2 className="w-4 h-4" />
                                                                            }
                                                                            danger
                                                                        >
                                                                            Supprimer
                                                                        </DropdownItem>
                                                                    </>
                                                                )}
                                                            </DropdownMenu>
                                                        </td>
                                                    </tr>
                                                ),
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </DashboardLayout>
        </>
    );
}
