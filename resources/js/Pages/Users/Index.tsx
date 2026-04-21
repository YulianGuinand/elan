import FadeIn from "@/Components/Animations/FadeIn";
import DropdownMenu, {
    DropdownDivider,
    DropdownItem,
} from "@/Components/Common/DropdownMenu";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { PageProps } from "@/types";
import { Head, router, usePage } from "@inertiajs/react";
import { Edit, MoreVertical, Trash2, UserRound } from "lucide-react";
import { useState } from "react";

interface UserItem {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    fonction: string | null;
    role: string;
    created_at: string;
}

interface Props {
    users: any;
    filters: { search?: string };
    availableRoles: string[];
}

const roleLabel: Record<string, string> = {
    superadmin: "Super Admin",
    admin: "Admin",
    utilisateur: "Utilisateur",
};

const roleColor: Record<string, string> = {
    superadmin: "bg-red-100 text-red-700",
    admin: "bg-orange-100 text-orange-700",
    utilisateur: "bg-gray-100 text-gray-600",
};

export default function UsersIndex({ users, filters }: Props) {
    const { auth } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search || "");

    // Détermine si l'utilisateur connecté peut gérer un compte donné
    const canManageUser = (targetRole: string) => {
        if (auth.user.role === "superadmin") return targetRole !== "superadmin";
        if (auth.user.role === "admin") return targetRole === "utilisateur";
        return false;
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route("users.index"), { search }, { preserveState: true });
    };

    return (
        <>
            <Head title="Gestion des Utilisateurs" />

            <DashboardLayout
                title="Gestion des Utilisateurs"
                breadcrumbs={[
                    { label: "Accueil", href: "/tableau-de-bord" },
                    { label: "Utilisateurs" },
                ]}
                actionButton={{
                    label: "Ajouter un utilisateur",
                    onClick: () => router.get(route("users.create")),
                }}
            >
                <div className="space-y-6 w-full">
                    <FadeIn
                        delay={0}
                        className="flex flex-col sm:flex-row justify-between gap-4"
                    >
                        <p className="text-gray-600 text-sm">
                            Gérez les comptes utilisateurs de la plateforme.
                        </p>

                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher un utilisateur..."
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
                                            Utilisateur
                                        </th>
                                        <th className="px-6 py-4 font-semibold hidden md:table-cell">
                                            Fonction
                                        </th>
                                        <th className="px-6 py-4 font-semibold hidden lg:table-cell">
                                            Rôle
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
                                    {users.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-6 py-12 text-center text-gray-500"
                                            >
                                                Aucun utilisateur trouvé.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.data.map((user: UserItem) => (
                                            <tr
                                                key={user.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                                                            <UserRound className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">
                                                                {user.prenom}{" "}
                                                                {user.nom}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 hidden md:table-cell text-gray-600">
                                                    {user.fonction || (
                                                        <span className="text-gray-400 italic">
                                                            —
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 hidden lg:table-cell">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColor[user.role] ?? "bg-gray-100 text-gray-600"}`}
                                                    >
                                                        {roleLabel[user.role] ??
                                                            user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 hidden md:table-cell text-gray-600">
                                                    {new Date(
                                                        user.created_at,
                                                    ).toLocaleDateString(
                                                        "fr-FR",
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {canManageUser(
                                                        user.role,
                                                    ) && (
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
                                                                            "users.edit",
                                                                            user.id,
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
                                                                            "Supprimer cet utilisateur ?",
                                                                        )
                                                                    ) {
                                                                        router.delete(
                                                                            route(
                                                                                "users.destroy",
                                                                                user.id,
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
                                                        </DropdownMenu>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {users.last_page > 1 && (
                            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                                <p className="text-sm text-gray-500">
                                    {users.total} utilisateur
                                    {users.total > 1 ? "s" : ""}
                                </p>
                                <div className="flex gap-2">
                                    {users.links.map(
                                        (
                                            link: {
                                                url: string | null;
                                                label: string;
                                                active: boolean;
                                            },
                                            i: number,
                                        ) => (
                                            <button
                                                key={i}
                                                disabled={!link.url}
                                                onClick={() =>
                                                    link.url &&
                                                    router.get(link.url)
                                                }
                                                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                                                    link.active
                                                        ? "bg-orange-500 text-white border-orange-500"
                                                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                                }`}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        ),
                                    )}
                                </div>
                            </div>
                        )}
                    </FadeIn>
                </div>
            </DashboardLayout>
        </>
    );
}
