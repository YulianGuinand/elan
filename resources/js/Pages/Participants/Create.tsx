import SearchableSelect, {
    SelectOption,
} from "@/Components/Common/SearchableSelect";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm } from "@inertiajs/react";
import { AlertCircle, Save } from "lucide-react";
import { FormEventHandler, useEffect, useState } from "react";

interface Props {
    ecoles: SelectOption[];
    formations: SelectOption[];
    entreprises: SelectOption[];
}

export default function Create({ ecoles, formations, entreprises }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        nom: "",
        prenom: "",
        mail: "",
        telephone: "",
        statut: "actif",
        role: "Apprenti",
        ecole_id: "",
        formation_id: "",
        entreprise_id: "",
        date_entree: "",
    });

    const [selectedEcole, setSelectedEcole] = useState<SelectOption | null>(
        null,
    );
    const [selectedFormation, setSelectedFormation] =
        useState<SelectOption | null>(null);
    const [selectedEntreprise, setSelectedEntreprise] =
        useState<SelectOption | null>(null);

    useEffect(() => {
        setData("ecole_id", selectedEcole ? selectedEcole.id.toString() : "");
    }, [selectedEcole]);

    useEffect(() => {
        setData(
            "formation_id",
            selectedFormation ? selectedFormation.id.toString() : "",
        );
    }, [selectedFormation]);

    useEffect(() => {
        setData(
            "entreprise_id",
            selectedEntreprise ? selectedEntreprise.id.toString() : "",
        );
    }, [selectedEntreprise]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("participants.store"));
    };

    return (
        <>
            <Head title="Ajouter un participant" />

            <DashboardLayout
                title="Ajouter un participant"
                breadcrumbs={[
                    { label: "Accueil", href: "/tableau-de-bord" },
                    {
                        label: "Participants",
                        href: route("participants.index"),
                    },
                    { label: "Ajouter" },
                ]}
                actionButton={{
                    label: "Retour à la liste",
                    onClick: () => window.history.back(),
                }}
            >
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

                            {/* Statut */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Statut
                                </label>
                                <select
                                    value={data.statut}
                                    onChange={(e) =>
                                        setData("statut", e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elan-orange focus:border-transparent outline-none bg-white"
                                >
                                    <option value="actif">Actif</option>
                                    <option value="diplome">Diplômé</option>
                                    <option value="suspendu">Suspendu</option>
                                    <option value="abandon">Abandon</option>
                                </select>
                                {errors.statut && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.statut}
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
                                    <option value="Apprenti">Apprenti</option>
                                    <option value="Alumni">Alumni</option>
                                    <option value="Formateur">Formateur</option>
                                    <option value="Employeur">Employeur</option>
                                </select>
                                {errors.role && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.role}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Renseignements supplémentaires pour Apprentis/Formateurs */}
                        {(data.role === "Apprenti" ||
                            data.role === "Formateur") && (
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Informations Académiques &
                                        Professionnelles
                                    </h3>
                                    <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                                        Nouveau Contrat
                                    </span>
                                </div>
                                <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex gap-3 text-sm mb-6">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <p>
                                        Vous pouvez utiliser la recherche pour
                                        trouver une école, formation ou
                                        entreprise. Si elle n'existe pas, tapez
                                        son nom et utilisez l'option{" "}
                                        <strong>"Créer"</strong> dans la liste !
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Select Ecole */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            École{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <SearchableSelect
                                            options={ecoles}
                                            value={selectedEcole}
                                            onChange={setSelectedEcole}
                                            placeholder="Chercher ou créer une école..."
                                            allowCreate={true}
                                            createLabel="Créer l'école"
                                        />
                                        {errors.ecole_id && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.ecole_id}
                                            </p>
                                        )}
                                    </div>

                                    {/* Select Formation */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Formation{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <SearchableSelect
                                            options={formations}
                                            value={selectedFormation}
                                            onChange={setSelectedFormation}
                                            placeholder="Chercher ou créer une formation..."
                                            allowCreate={true}
                                            createLabel="Créer la formation"
                                        />
                                        {errors.formation_id && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.formation_id}
                                            </p>
                                        )}
                                    </div>

                                    {/* Select Entreprise */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Entreprise d'accueil (Optionnel)
                                        </label>
                                        <SearchableSelect
                                            options={entreprises}
                                            value={selectedEntreprise}
                                            onChange={setSelectedEntreprise}
                                            placeholder="Chercher ou créer une entreprise..."
                                            allowCreate={true}
                                            createLabel="Créer l'entreprise"
                                        />
                                    </div>

                                    {/* Date de début */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Date de début
                                        </label>
                                        <input
                                            type="date"
                                            value={data.date_entree}
                                            onChange={(e) =>
                                                setData(
                                                    "date_entree",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elan-orange focus:border-transparent outline-none bg-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-6 py-3 bg-elan-orange text-white text-sm font-medium rounded-lg hover:bg-elan-dark transition-colors"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {processing
                                    ? "Enregistrement..."
                                    : "Enregistrer"}
                            </button>
                        </div>
                    </form>
                </div>
            </DashboardLayout>
        </>
    );
}
