import FadeIn from "@/Components/Animations/FadeIn";
import DropdownMenu, {
    DropdownDivider,
    DropdownItem,
} from "@/Components/Common/DropdownMenu";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { PageProps } from "@/types";
import { Head, router, usePage } from "@inertiajs/react";
import { BookOpen, Edit, Eye, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";

interface Formation {
    id: number;
    libelle: string;
    created_at: string;
}

interface Props {
    formations: any; // Paginator instance
    filters: { search?: string };
}

export default function FormationsIndex({ formations, filters }: Props) {
    const { auth } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route("formations.index"),
            { search },
            { preserveState: true },
        );
    };

    return (
        <>
            <Head title="Gestion des Formations" />

            <DashboardLayout
                title="Gestion des Formations"
                breadcrumbs={[
                    { label: "Accueil", href: "/tableau-de-bord" },
                    { label: "Formations" },
                ]}
                actionButton={
                    auth.user.role_id !== 3
                        ? {
                              label: "Ajouter une formation",
                              onClick: () =>
                                  router.get(route("formations.create")),
                          }
                        : undefined
                }
            >
                <div className="space-y-6">
                    <FadeIn
                        delay={0}
                        className="flex flex-col sm:flex-row justify-between gap-4"
                    >
                        <p className="text-gray-600 text-sm">
                            Gérez les formations proposées et associées aux
                            étudiants.
                        </p>

                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher une formation..."
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elan-orange focus:border-transparent outline-none"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Chercher
                            </button>
                        </form>
                    </FadeIn>

                    <FadeIn
                        delay={100}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                                        <th className="px-6 py-4 font-semibold">
                                            Libellé de la formation
                                        </th>
                                        <th className="px-6 py-4 font-semibold hidden md:table-cell">
                                            Date d'ajout
                                        </th>
                                        <th className="px-6 py-4 font-semibold text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {formations.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="px-6 py-12 text-center text-gray-500"
                                            >
                                                Aucune formation trouvée.
                                            </td>
                                        </tr>
                                    ) : (
                                        formations.data.map(
                                            (formation: Formation) => (
                                                <tr
                                                    key={formation.id}
                                                    className="hover:bg-gray-50 transition-colors"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                                                                <BookOpen className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-900">
                                                                    {
                                                                        formation.libelle
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 hidden md:table-cell text-gray-600">
                                                        {new Date(
                                                            formation.created_at,
                                                        ).toLocaleDateString(
                                                            "fr-FR",
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
                                                                            "formations.show",
                                                                            formation.id,
                                                                        ),
                                                                    )
                                                                }
                                                                icon={
                                                                    <Eye className="w-4 h-4" />
                                                                }
                                                            >
                                                                Voir
                                                            </DropdownItem>

                                                            {auth.user
                                                                .role_id !==
                                                                3 && (
                                                                <>
                                                                    <DropdownItem
                                                                        onClick={() =>
                                                                            router.get(
                                                                                route(
                                                                                    "formations.edit",
                                                                                    formation.id,
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
                                                                                    "Supprimer cette formation ?",
                                                                                )
                                                                            ) {
                                                                                router.delete(
                                                                                    route(
                                                                                        "formations.destroy",
                                                                                        formation.id,
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
                    </FadeIn>
                </div>
            </DashboardLayout>
        </>
    );
}
