import FadeIn from "@/Components/Animations/FadeIn";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm } from "@inertiajs/react";
import { ChevronLeft, UserRound } from "lucide-react";

const allRoleOptions = [
    { value: "utilisateur", label: "Utilisateur" },
    { value: "admin", label: "Admin" },
] as const;

interface Props {
    availableRoles: string[];
}

export default function Create({ availableRoles }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        nom: "",
        prenom: "",
        email: "",
        fonction: "",
        role: "utilisateur",
        mdp: "",
        mdp_confirmation: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("users.store"));
    };

    return (
        <>
            <Head title="Ajouter un utilisateur" />

            <DashboardLayout
                title="Ajouter un utilisateur"
                breadcrumbs={[
                    { label: "Accueil", href: "/tableau-de-bord" },
                    { label: "Utilisateurs", href: route("users.index") },
                    { label: "Ajouter" },
                ]}
                actionButton={{
                    icon: <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />,
                    label: "Retour",
                    onClick: () => window.history.back(),
                }}
            >
                <div className="max-w-2xl mx-auto">
                    <FadeIn delay={0}>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <UserRound className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">
                                        Nouvel Utilisateur
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        Créez un nouveau compte utilisateur.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Prénom{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.prenom}
                                            onChange={(e) =>
                                                setData("prenom", e.target.value)
                                            }
                                            placeholder="Ex: Jean"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-shadow"
                                        />
                                        {errors.prenom && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {errors.prenom}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nom{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.nom}
                                            onChange={(e) =>
                                                setData("nom", e.target.value)
                                            }
                                            placeholder="Ex: Dupont"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-shadow"
                                        />
                                        {errors.nom && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {errors.nom}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Adresse e-mail{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        placeholder="Ex: jean.dupont@exemple.fr"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-shadow"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fonction
                                    </label>
                                    <input
                                        type="text"
                                        value={data.fonction}
                                        onChange={(e) =>
                                            setData("fonction", e.target.value)
                                        }
                                        placeholder="Ex: Responsable pédagogique"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-shadow"
                                    />
                                    {errors.fonction && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {errors.fonction}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Rôle{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.role}
                                        onChange={(e) =>
                                            setData("role", e.target.value)
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-shadow bg-white"
                                    >
                                        {allRoleOptions
                                            .filter((r) =>
                                                availableRoles.includes(
                                                    r.value,
                                                ),
                                            )
                                            .map((r) => (
                                                <option
                                                    key={r.value}
                                                    value={r.value}
                                                >
                                                    {r.label}
                                                </option>
                                            ))}
                                    </select>
                                    {errors.role && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {errors.role}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mot de passe{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            value={data.mdp}
                                            onChange={(e) =>
                                                setData("mdp", e.target.value)
                                            }
                                            placeholder="Minimum 8 caractères"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-shadow"
                                        />
                                        {errors.mdp && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {errors.mdp}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Confirmer le mot de passe{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            value={data.mdp_confirmation}
                                            onChange={(e) =>
                                                setData(
                                                    "mdp_confirmation",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Répétez le mot de passe"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-shadow"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => window.history.back()}
                                        className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2.5 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-colors shadow-sm"
                                    >
                                        Créer l'utilisateur
                                    </button>
                                </div>
                            </form>
                        </div>
                    </FadeIn>
                </div>
            </DashboardLayout>
        </>
    );
}
