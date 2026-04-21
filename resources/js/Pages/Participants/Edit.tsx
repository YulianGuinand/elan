import FadeIn from "@/Components/Animations/FadeIn";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Participant } from "@/types/participants";
import { Head, useForm } from "@inertiajs/react";
import { ChevronLeft, Save } from "lucide-react";
import { FormEventHandler } from "react";

export default function Edit({ participant }: { participant: Participant }) {
    const { data, setData, put, processing, errors } = useForm({
        nom: participant.nom || "",
        prenom: participant.prenom || "",
        mail: participant.mail || "",
        telephone: participant.telephone || "",
        role: participant.role || "Apprentis",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route("participants.update", participant.id));
    };

    return (
        <>
            <Head title={`Modifier ${participant.prenom} ${participant.nom}`} />

            <DashboardLayout
                title="Modifier un participant"
                breadcrumbs={[
                    { label: "Accueil", href: "/tableau-de-bord" },
                    {
                        label: "Participants",
                        href: route("participants.index"),
                    },
                    { label: `${participant.prenom} ${participant.nom}` },
                ]}
                actionButton={{
                    icon: <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />,
                    label: "Retour à la liste",
                    onClick: () => window.history.back(),
                }}
            >
                <FadeIn delay={0}>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <form onSubmit={submit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nom */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nom
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nom}
                                        onChange={(e) =>
                                            setData("nom", e.target.value)
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elan-orange focus:border-transparent outline-none"
                                        required
                                    />
                                    {errors.nom && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.nom}
                                        </p>
                                    )}
                                </div>

                                {/* Prénom */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Prénom
                                    </label>
                                    <input
                                        type="text"
                                        value={data.prenom}
                                        onChange={(e) =>
                                            setData("prenom", e.target.value)
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elan-orange focus:border-transparent outline-none"
                                        required
                                    />
                                    {errors.prenom && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.prenom}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={data.mail}
                                        onChange={(e) =>
                                            setData("mail", e.target.value)
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elan-orange focus:border-transparent outline-none"
                                        required
                                    />
                                    {errors.mail && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.mail}
                                        </p>
                                    )}
                                </div>

                                {/* Téléphone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Téléphone
                                    </label>
                                    <input
                                        type="tel"
                                        value={data.telephone}
                                        onChange={(e) =>
                                            setData("telephone", e.target.value)
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elan-orange focus:border-transparent outline-none"
                                        required
                                    />
                                    {errors.telephone && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.telephone}
                                        </p>
                                    )}
                                </div>

                                {/* Role */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Rôle
                                    </label>
                                    <select
                                        value={data.role}
                                        onChange={(e) =>
                                            setData("role", e.target.value)
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elan-orange focus:border-transparent outline-none bg-white"
                                    >
                                        <option value="Apprentis">
                                            Apprentis
                                        </option>
                                        <option value="Alumnis">Alumni</option>
                                        <option value="Formateurs">
                                            Formateurs
                                        </option>
                                        <option value="Employeurs">
                                            Employeurs
                                        </option>
                                    </select>
                                    {errors.role && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.role}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center px-6 py-3 bg-elan-orange text-white text-sm font-medium rounded-lg hover:bg-elan-dark transition-colors"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {processing
                                        ? "Enregistrement..."
                                        : "Mettre à jour"}
                                </button>
                            </div>
                        </form>
                    </div>
                </FadeIn>
            </DashboardLayout>
        </>
    );
}
