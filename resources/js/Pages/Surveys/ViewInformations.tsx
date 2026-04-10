import FadeIn from "@/Components/Animations/FadeIn";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head } from "@inertiajs/react";
import { Survey } from "../../types/surveys";
export interface Participant {
    id: number;
    nom: string;
    prenom: string;
    telephone: string;
    mail: string;
    role: string;
    entreprises?: { nom: string }[];
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
    participants: Participant[];
    filters: {
        search: string | null;
        role: string;
    };
    availableRoles: string[];
}

export default function SurveyViewInformation({
    enquete,
    participants,
}: Props) {
    const filteredParticipants = participants.filter(
        (participant) => participant.role === enquete.type_campagne,
    );
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
                                        Ici on affiche le contenu du lien de
                                        l'enquête
                                    </p>
                                </div>
                                <div className="flex items-center justify-between gap-4 flex-col">
                                    <div className="flex gap-4 flex-row">
                                        <span> Nom</span>
                                        <span> Prénom</span>
                                        <span> Role</span>
                                    </div>
                                    {filteredParticipants.map((participant) => (
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
                                <div className="flex items-center justify-between gap-4">
                                    <p>Ici on affiche qui a répondu</p>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </DashboardLayout>
        </>
    );
}
