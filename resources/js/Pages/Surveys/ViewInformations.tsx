import FadeIn from "@/Components/Animations/FadeIn";
import ConfirmDialog from "@/Components/ConfirmDialog";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { PageProps } from "@/types";
import { Survey } from "@/types/surveys";
import { Head, router, usePage } from "@inertiajs/react";
import {
    AlertCircle,
    CheckCheck,
    CheckCircle2,
    Clock,
    Eye,
    Mail,
    Phone,
    Search,
    Send,
    Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export interface Participant {
    id: number;
    nom: string;
    prenom: string;
    telephone?: string;
    mail: string;
    role: string;
    has_responded: boolean;
    status_envoi?: string | null;
    date_envoi?: string | null;
    canal?: string | null;
    global_status?: string;
    entreprises?: { nom: string }[];
}

interface Utilisateur {
    id: number;
    nom: string;
    prenom: string;
    fonction: string;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    enquete: Survey;
    utilisateur: Utilisateur;
    participants: PaginatedData<Participant>;
    filters: {
        search: string | null;
        role: string;
    };
    availableRoles: string[];
}

function parseDateOnly(dateString: string | null): Date {
    if (!dateString) {
        return new Date();
    }

    const parts = dateString.split("/");

    if (parts.length !== 3) {
        return new Date();
    }

    // Format DD/MM/YYYY (français)
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return new Date();
    }

    return new Date(year, month - 1, day);
}

function formatDate(dateString: string | null): string {
    if (!dateString) {
        return "Non disponible";
    }

    const date = parseDateOnly(dateString);

    // Vérifier que la date est valide
    if (isNaN(date.getTime())) {
        return "Non disponible";
    }

    return new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date);
}

export default function SurveyViewInformation({
    enquete,
    participants,
    utilisateur,
}: Props) {
    const { auth } = usePage<PageProps>().props;
    const canManageSurveys =
        (auth as any)?.permissions?.canManageSurveys || false;
    const current = new Date();
    const dateDebut = parseDateOnly(enquete.date_debut);
    const dateFin = parseDateOnly(enquete.date_fin);

    // Vérifier que les dates sont valides
    const datesValides =
        !isNaN(dateDebut.getTime()) && !isNaN(dateFin.getTime());

    let statut = "actif";
    if (datesValides) {
        if (current < dateDebut) {
            statut = "a_venir";
        } else if (current > dateFin) {
            statut = "terminee";
        } else {
            statut = "actif";
        }
    }

    // États locaux
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("Tous");
    const [statusFilter, setStatusFilter] = useState("Tous");
    const [selectedParticipants, setSelectedParticipants] = useState<number[]>(
        [],
    );
    const [isSendingMails, setIsSendingMails] = useState(false);
    const [showSendAllDialog, setShowSendAllDialog] = useState(false);
    const [showRelanceDialog, setShowRelanceDialog] = useState(false);
    const [showPhoneContactAlert, setShowPhoneContactAlert] = useState(false);

    // Debounce la recherche (500ms)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Si > 1000 participants, recherche côté serveur
    useEffect(() => {
        if (participants.total > 1000) {
            const params: Record<string, any> = {
                id: enquete.id,
            };

            if (debouncedSearchQuery) {
                params.search = debouncedSearchQuery;
            }
            if (roleFilter !== "Tous") {
                params.role = roleFilter;
            }
            if (statusFilter !== "Tous") {
                params.status = statusFilter;
            }

            router.get(
                route("surveys.informations", params),
                {},
                {
                    preserveScroll: true,
                    only: ["participants"],
                },
            );
        }
    }, [
        debouncedSearchQuery,
        roleFilter,
        statusFilter,
        participants.total,
        enquete.id,
    ]);

    // Filtrer les participants localement (seulement si <= 1000 participants)
    const filteredParticipants = useMemo(() => {
        if (participants.total > 1000) {
            // Si recherche serveur, utiliser les données déjà filtrées du serveur
            return participants.data;
        }

        return participants.data.filter((p) => {
            const matchesSearch =
                !debouncedSearchQuery ||
                p.nom
                    .toLowerCase()
                    .includes(debouncedSearchQuery.toLowerCase()) ||
                p.prenom
                    .toLowerCase()
                    .includes(debouncedSearchQuery.toLowerCase()) ||
                p.mail
                    .toLowerCase()
                    .includes(debouncedSearchQuery.toLowerCase());

            const matchesRole = roleFilter === "Tous" || p.role === roleFilter;

            const matchesStatus =
                statusFilter === "Tous" || p.global_status === statusFilter;

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [
        participants.data,
        debouncedSearchQuery,
        roleFilter,
        statusFilter,
        participants.total,
    ]);

    // Statistiques
    const respondedCount = filteredParticipants.filter(
        (p) => p.has_responded,
    ).length;
    const notRespondedCount = filteredParticipants.length - respondedCount;

    const handleSendInvitations = () => {
        setShowSendAllDialog(true);
    };

    const handleConfirmSendAll = () => {
        setIsSendingMails(true);
        router.post(
            route("surveys.send-invitations", { id: enquete.id }),
            {},
            {
                onFinish: () => {
                    setIsSendingMails(false);
                    setShowSendAllDialog(false);
                },
            },
        );
    };

    const handleToggleParticipant = (participantId: number) => {
        setSelectedParticipants((prev) =>
            prev.includes(participantId)
                ? prev.filter((id) => id !== participantId)
                : [...prev, participantId],
        );
    };

    const handleSelectAll = () => {
        if (selectedParticipants.length === filteredParticipants.length) {
            setSelectedParticipants([]);
        } else {
            setSelectedParticipants(filteredParticipants.map((p) => p.id));
        }
    };

    const handleRelance = () => {
        if (selectedParticipants.length === 0) {
            setShowPhoneContactAlert(true);
            return;
        }

        setShowRelanceDialog(true);
    };

    const handleConfirmRelance = () => {
        setIsSendingMails(true);
        router.post(
            route("surveys.send-invitations", { id: enquete.id }),
            { participant_ids: selectedParticipants },
            {
                onFinish: () => {
                    setIsSendingMails(false);
                    setSelectedParticipants([]);
                    setShowRelanceDialog(false);
                },
            },
        );
    };

    return (
        <>
            <Head title={enquete.titre} />
            <DashboardLayout
                title={enquete.titre}
                breadcrumbs={[
                    { label: "Accueil", href: "/tableau-de-bord" },
                    { label: "Enquêtes", href: "/enquetes" },
                    { label: "Informations" },
                ]}
            >
                <FadeIn delay={300} className="space-y-6 w-full">
                    {/* Header avec dates et progression */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex flex-col lg:flex-row gap-6 justify-between items-start">
                            {/* Dates */}
                            <div className="flex gap-6">
                                <div className="text-center">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Date de début
                                    </p>
                                    <p className="text-lg font-bold text-gray-900 mt-1">
                                        {formatDate(enquete.date_debut)}
                                    </p>
                                </div>
                                <div className="border-l border-gray-200"></div>
                                <div className="text-center">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Date de clôture
                                    </p>
                                    <p className="text-lg font-bold text-gray-900 mt-1">
                                        {formatDate(enquete.date_fin)}
                                    </p>
                                </div>
                            </div>

                            {/* Boutons d'action */}
                            <div className="flex flex-col gap-2 w-full lg:w-auto">
                                {canManageSurveys && (
                                    <button
                                        onClick={() =>
                                            router.visit(
                                                route("surveys.responses", {
                                                    id: enquete.id,
                                                }),
                                            )
                                        }
                                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Voir les réponses
                                    </button>
                                )}
                                <button
                                    onClick={() =>
                                        router.visit(
                                            route("surveys.fill", {
                                                id: enquete.id,
                                            }),
                                        )
                                    }
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-elan-orange text-white hover:bg-orange-500 rounded-lg transition-colors text-sm font-medium"
                                >
                                    <Send className="w-4 h-4" />
                                    Remplir une enquête
                                </button>
                            </div>
                        </div>

                        {/* Indicateur modifiabilité */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                                {statut === "actif" ? (
                                    <>
                                        <Clock className="w-4 h-4 text-blue-500" />
                                        <p className="text-sm text-blue-600">
                                            Plus modifiable (En cours)
                                        </p>
                                    </>
                                ) : statut === "a_venir" ? (
                                    <>
                                        <AlertCircle className="w-4 h-4 text-orange-500" />
                                        <p className="text-sm text-orange-600">
                                            À venir
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 text-gray-400" />
                                        <p className="text-sm text-gray-600">
                                            Terminée
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Structure de l'enquête */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">
                            Structure de l'enquête
                        </h2>

                        <div className="space-y-6">
                            {enquete.themes && enquete.themes.length > 0 ? (
                                enquete.themes.map((theme) => (
                                    <div
                                        key={theme.id}
                                        className="bg-gray-50 rounded-lg p-4"
                                    >
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center flex-shrink-0">
                                                <span className="text-sm font-bold text-orange-700">
                                                    {theme.questions?.length ||
                                                        0}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    {theme.libelle}
                                                </h3>
                                            </div>
                                        </div>

                                        {theme.questions &&
                                            theme.questions.length > 0 && (
                                                <div className="ml-11 space-y-2">
                                                    {theme.questions.map(
                                                        (q, idx) => (
                                                            <div
                                                                key={q.id}
                                                                className="text-sm text-gray-700"
                                                            >
                                                                <span className="font-medium">
                                                                    {String(
                                                                        idx + 1,
                                                                    ).padStart(
                                                                        2,
                                                                        "0",
                                                                    )}
                                                                    .
                                                                </span>{" "}
                                                                {q.libelle}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">
                                    Aucun thème ou question défini
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Publics visés */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">
                            Publics visés
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                "Apprentis",
                                "Alumnis",
                                "Formateurs",
                                "Employeurs",
                            ].map((public_type) => {
                                const isTarget =
                                    enquete.type_campagne === public_type;
                                return (
                                    <div
                                        key={public_type}
                                        className={`text-center p-4 rounded-lg border transition-colors ${
                                            isTarget
                                                ? "bg-blue-50 border-blue-200"
                                                : "bg-gray-50 border-gray-200"
                                        }`}
                                    >
                                        <Users
                                            className={`w-6 h-6 mx-auto mb-2 ${
                                                isTarget
                                                    ? "text-blue-600"
                                                    : "text-gray-400"
                                            }`}
                                        />
                                        <p
                                            className={`text-sm font-medium ${
                                                isTarget
                                                    ? "text-blue-900"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            {public_type}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Suivi des participants */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                            <h2 className="text-lg font-bold text-gray-900">
                                Suivi des participants
                            </h2>
                            <div className="flex gap-2">
                                {!isSendingMails &&
                                    selectedParticipants.length !== 0 && (
                                        <button
                                            onClick={handleRelance}
                                            disabled={
                                                isSendingMails ||
                                                selectedParticipants.length ===
                                                    0
                                            }
                                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium"
                                        >
                                            <Send className="w-4 h-4" />
                                            Relancer par mail
                                        </button>
                                    )}
                                <button
                                    onClick={handleSendInvitations}
                                    disabled={isSendingMails}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-elan-orange text-white hover:bg-orange-500 disabled:bg-gray-400 rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
                                >
                                    <Mail className="w-4 h-4" />
                                    Envoyer à tous
                                </button>
                            </div>
                        </div>

                        {/* Statistiques */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <p className="text-xs font-semibold text-blue-600 uppercase">
                                    Total
                                </p>
                                <p className="text-2xl font-bold text-blue-900 mt-1">
                                    {filteredParticipants.length}
                                </p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <p className="text-xs font-semibold text-green-600 uppercase">
                                    Répondus
                                </p>
                                <p className="text-2xl font-bold text-green-900 mt-1">
                                    {respondedCount}
                                </p>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-4">
                                <p className="text-xs font-semibold text-orange-600 uppercase">
                                    En attente
                                </p>
                                <p className="text-2xl font-bold text-orange-900 mt-1">
                                    {notRespondedCount}
                                </p>
                            </div>
                        </div>

                        {/* Recherche et filtres */}
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="flex-1 relative">
                                <label htmlFor="search">
                                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                </label>
                                <input
                                    id="search"
                                    type="text"
                                    placeholder="Rechercher par nom, prénom ou email..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {searchQuery !== debouncedSearchQuery &&
                                    participants.total > 1000 && (
                                        <div className="absolute right-3 top-3">
                                            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                                        </div>
                                    )}
                            </div>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="px-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="Tous">Tous les rôles</option>
                                <option value="Apprentis">Apprentis</option>
                                <option value="Alumnis">Alumnis</option>
                                <option value="Formateurs">Formateurs</option>
                                <option value="Employeurs">Employeurs</option>
                            </select>
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                className="px-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="Tous">Tous les statuts</option>
                                <option value="Répondu">Répondu</option>
                                <option value="En attente">En attente</option>
                                <option value="Relancé par mail">
                                    Relancé par mail
                                </option>
                                <option value="Relancé par téléphone">
                                    Relancé par téléphone
                                </option>
                            </select>
                        </div>

                        {/* Tableau des participants */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className="px-4 py-3 text-left font-semibold text-gray-900 w-12">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    selectedParticipants.length ===
                                                        filteredParticipants.length &&
                                                    filteredParticipants.length >
                                                        0
                                                }
                                                onChange={handleSelectAll}
                                                className="rounded border border-gray-300 cursor-pointer"
                                            />
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-900">
                                            Participant
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-900">
                                            Email
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-900">
                                            Rôle
                                        </th>
                                        <th className="px-4 py-3 text-center font-semibold text-gray-900">
                                            Statut
                                        </th>
                                        <th className="px-4 py-3 text-center font-semibold text-gray-900">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredParticipants.map((participant) => (
                                        <tr
                                            key={participant.id}
                                            className={`transition-colors ${
                                                selectedParticipants.includes(
                                                    participant.id,
                                                )
                                                    ? "bg-blue-50"
                                                    : "hover:bg-gray-50"
                                            }`}
                                        >
                                            <td className="px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedParticipants.includes(
                                                        participant.id,
                                                    )}
                                                    onChange={() =>
                                                        handleToggleParticipant(
                                                            participant.id,
                                                        )
                                                    }
                                                    className="rounded border border-gray-300 cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-elan-orange to-elan-blue flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                                        {participant.prenom
                                                            ?.charAt(0)
                                                            .toUpperCase()}
                                                        {participant.nom
                                                            ?.charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {participant.prenom}{" "}
                                                            {participant.nom}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                <a
                                                    href={`mailto:${participant.mail}`}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {participant.mail}
                                                </a>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    {participant.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {participant.global_status ===
                                                "Répondu" ? (
                                                    <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                                                        <CheckCheck className="w-4 h-4" />
                                                        Répondu
                                                    </span>
                                                ) : participant.global_status ===
                                                  "Relancé par mail" ? (
                                                    <span className="inline-flex items-center gap-1 text-blue-600 font-medium">
                                                        <Mail className="w-4 h-4" />
                                                        Mail
                                                    </span>
                                                ) : participant.global_status ===
                                                  "Relancé par téléphone" ? (
                                                    <span className="inline-flex items-center gap-1 text-purple-600 font-medium">
                                                        <Phone className="w-4 h-4" />
                                                        Téléphone
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-orange-600 font-medium">
                                                        <AlertCircle className="w-4 h-4" />
                                                        En attente
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center text-xs text-gray-500">
                                                {participant.date_envoi
                                                    ? formatDate(
                                                          participant.date_envoi,
                                                      )
                                                    : "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredParticipants.length === 0 && (
                            <div className="text-center py-8">
                                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">
                                    Aucun participant trouvé
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {participants.last_page > 1 && (
                            <div className="mt-6 flex justify-center gap-2">
                                {participants.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (link.url) {
                                                window.location.href = link.url;
                                            }
                                        }}
                                        disabled={link.url === null}
                                        className={`px-3 py-1 rounded text-sm ${
                                            link.active
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </FadeIn>
            </DashboardLayout>

            {/* Send All Invitations Dialog */}
            <ConfirmDialog
                isOpen={showSendAllDialog}
                onClose={() => setShowSendAllDialog(false)}
                onConfirm={handleConfirmSendAll}
                title="Envoyer les invitations"
                message="Envoyer les invitations par mail à tous les participants (sauf à ceux qui ont déjà répondu) ?"
                confirmText="Envoyer"
                cancelText="Annuler"
                variant="default"
                isLoading={isSendingMails}
            />

            {/* Relance Dialog */}
            <ConfirmDialog
                isOpen={showRelanceDialog}
                onClose={() => setShowRelanceDialog(false)}
                onConfirm={handleConfirmRelance}
                title="Relancer les participants"
                message={`Envoyer les invitations par mail à ${selectedParticipants.length} participant(s) sélectionné(s) ?`}
                confirmText="Envoyer"
                cancelText="Annuler"
                variant="default"
                isLoading={isSendingMails}
            />

            {/* Phone Contact Alert Dialog */}
            <ConfirmDialog
                isOpen={showPhoneContactAlert}
                onClose={() => setShowPhoneContactAlert(false)}
                onConfirm={() => setShowPhoneContactAlert(false)}
                title="Aucune sélection"
                message="Veuillez sélectionner au moins un participant"
                confirmText="OK"
                variant="default"
            />
        </>
    );
}
