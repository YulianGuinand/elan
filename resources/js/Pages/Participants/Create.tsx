import FadeIn from "@/Components/Animations/FadeIn";
import Card from "@/Components/Common/Card";
import CSVImport from "@/Components/Participants/CSVImport";
import ManualEntryForm from "@/Components/Participants/ManualEntryForm";
import RecentParticipantsTable from "@/Components/Participants/RecentParticipantsTable";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Participant, RecentParticipant } from "@/types/participant";
import { Head } from "@inertiajs/react";
import { FileText, Users } from "lucide-react";
import { useState } from "react";

// Donnees mockees pour la demonstration
const mockRecentParticipants: RecentParticipant[] = [
    {
        id: 1,
        prenom: "Sophie",
        nom: "Martin",
        email: "sophie.martin@cfacc.fr",
        telephone: "06 12 34 56 78",
        role: "apprenant",
        programme_formation: "BTS Management Commercial Opérationnel",
        created_at: new Date().toISOString(),
        statut: "validé",
    },
    {
        id: 2,
        prenom: "Lucas",
        nom: "Bernard",
        email: "l.bernard@tech-corp.fr",
        telephone: "06 23 45 67 89",
        role: "employeur",
        created_at: new Date(Date.now() - 86400000).toISOString(), // Hier
        statut: "validé",
    },
];

interface CreateParticipantsProps {
    recentParticipants?: RecentParticipant[];
}

export default function CreateParticipants({
    recentParticipants = [],
}: CreateParticipantsProps) {
    const [activeTab, setActiveTab] = useState<"manual" | "csv">("manual");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleManualSubmit = (participant: Participant) => {
        setIsSubmitting(true);

        // Simulation d'envoi (visuel seulement)
        console.log("Participant ajouté:", participant);

        setTimeout(() => {
            setIsSubmitting(false);
            alert(
                `Participant ${participant.prenom} ${participant.nom} ajouté avec succès !`
            );
        }, 1000);
    };

    const handleCSVImport = (participants: Participant[]) => {
        setIsSubmitting(true);

        // Simulation d'import (visuel seulement)
        console.log("Import CSV:", participants);

        setTimeout(() => {
            setIsSubmitting(false);
            alert(
                `${participants.length} participant${
                    participants.length > 1 ? "s" : ""
                } importé${participants.length > 1 ? "s" : ""} avec succès !`
            );
        }, 1500);
    };

    return (
        <DashboardLayout title="Ajouter des Participants">
            <Head title="Ajouter des Participants" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <FadeIn delay={0}>
                    <div>
                        {/* Breadcrumbs */}
                        <nav className="text-sm text-gray-600 mb-2">
                            <span>Participants</span>
                            <span className="mx-2">›</span>
                            <span className="text-elan-orange font-medium">
                                Ajouter
                            </span>
                        </nav>

                        {/* Title */}
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                            Ajouter des Participants
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Gérez l&apos;intégration de vos apprenants,
                            employeurs et formateurs dans la plateforme.
                        </p>
                    </div>
                </FadeIn>

                {/* Tabs */}
                <FadeIn delay={100}>
                    <div className="border-b border-gray-200">
                        <nav
                            className="-mb-px flex gap-2 sm:gap-8"
                            aria-label="Tabs"
                        >
                            <button
                                onClick={() => setActiveTab("manual")}
                                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm inline-flex items-center gap-2
                  transition-colors
                  ${
                      activeTab === "manual"
                          ? "border-elan-orange text-elan-orange"
                          : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }
                `}
                            >
                                <Users className="w-4 h-4" />
                                <span>Saisie Manuelle</span>
                            </button>
                            <button
                                onClick={() => setActiveTab("csv")}
                                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm inline-flex items-center gap-2
                  transition-colors
                  ${
                      activeTab === "csv"
                          ? "border-elan-orange text-elan-orange"
                          : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }
                `}
                            >
                                <FileText className="w-4 h-4" />
                                <span>Importation CSV</span>
                            </button>
                        </nav>
                    </div>
                </FadeIn>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Manual Entry */}
                    <FadeIn delay={200}>
                        <Card
                            className={
                                activeTab === "manual"
                                    ? ""
                                    : "hidden lg:block opacity-50"
                            }
                        >
                            <ManualEntryForm
                                onSubmit={handleManualSubmit}
                                isSubmitting={
                                    isSubmitting && activeTab === "manual"
                                }
                            />
                        </Card>
                    </FadeIn>

                    {/* Right Column - CSV Import */}
                    <FadeIn delay={250}>
                        <Card
                            className={
                                activeTab === "csv"
                                    ? ""
                                    : "hidden lg:block opacity-50"
                            }
                        >
                            <CSVImport
                                onImport={handleCSVImport}
                                isImporting={
                                    isSubmitting && activeTab === "csv"
                                }
                            />
                        </Card>
                    </FadeIn>
                </div>

                {/* Recent Participants Table */}
                <FadeIn delay={300}>
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Ajouts récents
                            </h2>
                            <a
                                href="/participants"
                                className="text-sm text-elan-orange hover:text-elan-orange/80 font-medium"
                            >
                                Voir tout l&apos;historique →
                            </a>
                        </div>
                        <RecentParticipantsTable
                            participants={
                                recentParticipants || mockRecentParticipants
                            }
                        />
                    </Card>
                </FadeIn>
            </div>
        </DashboardLayout>
    );
}
