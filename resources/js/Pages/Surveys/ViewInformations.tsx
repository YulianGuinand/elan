import FadeIn from "@/Components/Animations/FadeIn";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Survey } from "@/types/surveys";
import { Head, router } from "@inertiajs/react";
export interface Participant {
    id: number;
    nom: string;
    prenom: string;
    telephone: string;
    mail: string;
    role: string;
    entreprises?: { nom: string }[];
}

interface Utilisateur {
    id: number;
    nom: string;
    prenom: string;
    fonction: string;
}

interface PaginationData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    enquete: Survey;
    utilisateur: Utilisateur;
    participants: Participant[];
    filters: {
        search: string | null;
        role: string;
    };
    availableRoles: string[];
}
function parseDateOnly(dateString: string) {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
}

export default function SurveyViewInformation({
    enquete,
    participants,
    utilisateur,
}: Props) {
    const current = new Date();
    const dateDebut = parseDateOnly(enquete.date_debut);
    const dateFin = parseDateOnly(enquete.date_fin);
    let statut = "";
    if (current < dateDebut) {
        statut = "à venir";
    } else if (current > dateFin) {
        statut = "terminée";
    } else {
        statut = "actif";
    }
    return (
        <>
            <Head title="Voir les informations" />
            <DashboardLayout
                title="Voir les informations"
                breadcrumbs={[
                    { label: "Accueil", href: "/tableau-de-bord" },
                    { label: "Enquêtes", href: "/enquetes" },
                    { label: "Informations" },
                ]}
            >
                <div className="lg:col-span-9 w-full min-w-0 flex flex-col gap-6">
                    <FadeIn delay={300}>
                        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden flex flex-col">
                            <div className="p-6 md:p-8 space-y-6">
                                <div className="flex items-center justify-between gap-4">
                                    <p>Nom de l'enquête : {enquete.titre}</p>
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <p>
                                        L'enquête débute le :{" "}
                                        {enquete.date_debut} et fini le :{" "}
                                        {enquete.date_fin}{" "}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <p>Le statut de l'enquête est :{statut}</p>
                                </div>
                                <div className="flex flex-col items-center justify-between gap-4">
                                    {enquete.themes?.map((theme) => (
                                        <div key={theme.id}>
                                            <p>{theme.libelle}</p>
                                            {theme.questions?.map(
                                                (question) => (
                                                    <p key={question.id}>
                                                        {question.libelle}
                                                    </p>
                                                ),
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <p>
                                        Cette enquête est à destination des :{" "}
                                        {enquete.type_campagne}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <p>
                                        Cette enquête a été créée par :{" "}
                                        {utilisateur.prenom} {utilisateur.nom}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between gap-4 flex-col">
                                    <p>
                                        {" "}
                                        Les personnes ayant répondues à
                                        l'enquête sont :{" "}
                                    </p>
                                    <div className="flex gap-4 flex-row">
                                        <span> Nom</span>
                                        <span> Prénom</span>
                                        <span> Role</span>
                                    </div>
                                    {participants.map((participant) => (
                                        <div
                                            key={participant.id}
                                            className="flex gap-4 border p-3 rounded mb-2"
                                        >
                                            <p>{participant.nom}</p>
                                            <p>{participant.prenom}</p>
                                            <p>{participant.role}</p>
                                        </div>
                                    ))}
                                </div>
                                {statut === "actif" && (
                                    <div className=" items-center justify-between flex flex-col gap-4">
                                        <button
                                            onClick={() =>
                                                router.visit(
                                                    route("surveys.fill", {
                                                        id: enquete.id,
                                                    }),
                                                )
                                            }
                                        >
                                            {" "}
                                            Bouton pour remplir l'enquete
                                        </button>
                                        <p>
                                            {" "}
                                            Cette enquête n'est plus modifiable
                                        </p>
                                        <button> Envoyer</button>
                                        <button>
                                            Récupérer toutes les réponses
                                        </button>
                                    </div>
                                )}
                                {statut === "à venir" && (
                                    <div className="flex items-center justify-between gap-4">
                                        <button>Modifier l'enquête</button>
                                    </div>
                                )}
                                {statut === "terminée" && (
                                    <div className="flex items-center justify-between gap-4">
                                        <button>
                                            Récupérer toutes les réponses
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </DashboardLayout>
        </>
    );
}
