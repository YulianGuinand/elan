import FadeIn from "@/Components/Animations/FadeIn";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Survey } from "@/types/surveys";
import { Head, router } from "@inertiajs/react";
import {
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    HelpCircle,
    Info,
    Search,
    Send,
    Tag,
    User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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
    participants: PaginationData<Participant>;
    filters: {
        search: string | null;
        role: string;
    };
    availableRoles: string[];
}

export default function SurveyFill({
    enquete,
    participants,
    filters,
    availableRoles,
}: Props) {
    const [selectedParticipant, setSelectedParticipant] =
        useState<Participant | null>(null);
    const [isParticipantConfirmed, setIsParticipantConfirmed] = useState(false);
    const [answers, setAnswers] = useState<Record<number, any>>({});

    // State pour la sélection du participant
    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    const [roleFilter, setRoleFilter] = useState(filters.role || "Tous");

    const roles = useMemo(() => {
        return ["Tous", ...availableRoles];
    }, [availableRoles]);

    // Système de recherche avec debounce
    useEffect(() => {
        if (searchQuery === (filters.search || "")) return;

        const timeoutId = setTimeout(() => {
            router.get(
                route("surveys.fill", { id: enquete.id }),
                { search: searchQuery, role: roleFilter },
                {
                    preserveState: true,
                    replace: true,
                    only: ["participants"],
                },
            );
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleRoleChange = (role: string) => {
        setRoleFilter(role);
        router.get(
            route("surveys.fill", { id: enquete.id }),
            { search: searchQuery, role: role },
            {
                preserveState: true,
                replace: true,
                only: ["participants"],
            },
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            route("surveys.fill", { id: enquete.id }),
            { search: searchQuery, role: roleFilter, page: page },
            { preserveState: true, replace: true, only: ["participants"] },
        );
    };

    const paginatedParticipants = participants.data;
    const totalPages = participants.last_page;
    const currentPage = participants.current_page;

    const total = enquete.questions.length;
    const answered = Object.keys(answers).length;
    const progress = total > 0 ? Math.round((answered / total) * 100) : 0;

    const handleChange = (questionId: number, value: any) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleCheckboxChange = (
        questionId: number,
        value: string,
        checked: boolean,
    ) => {
        setAnswers((prev) => {
            const current = Array.isArray(prev[questionId])
                ? prev[questionId]
                : [];
            if (checked) {
                return { ...prev, [questionId]: [...current, value] };
            } else {
                return {
                    ...prev,
                    [questionId]: current.filter((v: string) => v !== value),
                };
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formattedAnswers = { ...answers };
        Object.keys(formattedAnswers).forEach((key) => {
            if (Array.isArray(formattedAnswers[Number(key)])) {
                formattedAnswers[Number(key)] = JSON.stringify(
                    formattedAnswers[Number(key)],
                );
            }
        });

        router.post(route("surveys.fill.submit", { id: enquete.id }), {
            participant_id: selectedParticipant?.id,
            reponses: formattedAnswers,
        });
    };

    const handleSelectParticipant = (participant: Participant) => {
        setSelectedParticipant(participant);
        setIsParticipantConfirmed(true);
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
    };

    return (
        <>
            <Head title={`Remplir — ${enquete.titre}`} />
            <DashboardLayout
                title="Remplir l'enquête"
                breadcrumbs={[
                    { label: "Accueil", href: "/tableau-de-bord" },
                    { label: "Enquêtes", href: "/enquetes" },
                    { label: "Sélection du participant" },
                ]}
            >
                <div className="max-w-6xl mx-auto">
                    {!isParticipantConfirmed ? (
                        <div className="space-y-6">
                            <FadeIn delay={0}>
                                <div className="mb-8">
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        Sélection du Participant
                                    </h1>
                                    <p className="text-gray-500 mt-2">
                                        Veuillez identifier la personne qui
                                        répondra au questionnaire.
                                    </p>
                                </div>
                            </FadeIn>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Colonne Gauche: Détails et Aide */}
                                <div className="space-y-6">
                                    <FadeIn delay={100}>
                                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                                            <div className="flex items-center gap-2 mb-6 text-gray-800">
                                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                                                    <Info className="w-5 h-5" />
                                                </div>
                                                <h3 className="font-bold text-lg">
                                                    Détails de l'enquête
                                                </h3>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                                                        Titre
                                                    </span>
                                                    <p className="text-gray-900 font-semibold">
                                                        {enquete.titre}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                                                        Description
                                                    </span>
                                                    <p className="text-gray-600 text-sm leading-relaxed">
                                                        {enquete.description ||
                                                            "Aucune description fournie."}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                                                        Catégorie
                                                    </span>
                                                    <span className="inline-block px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold">
                                                        {enquete.type_campagne ||
                                                            "Générale"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </FadeIn>

                                    <FadeIn delay={200}>
                                        <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-200">
                                            <div className="flex items-center gap-2 mb-4">
                                                <HelpCircle className="w-6 h-6" />
                                                <h3 className="font-bold text-lg">
                                                    Besoin d'aide ?
                                                </h3>
                                            </div>
                                            <p className="text-orange-50 text-sm mb-6 leading-relaxed">
                                                Si le participant n'est pas dans
                                                la liste, assurez-vous qu'il a
                                                bien été importé dans la base de
                                                données globale des contacts.
                                            </p>
                                            <button
                                                onClick={() =>
                                                    router.get(
                                                        route(
                                                            "participants.index",
                                                        ),
                                                    )
                                                }
                                                className="w-full py-3 bg-white text-orange-500 font-bold rounded-xl hover:bg-orange-50 transition-colors shadow-sm"
                                            >
                                                Consulter les contacts
                                            </button>
                                        </div>
                                    </FadeIn>
                                </div>

                                {/* Colonne Droite: Filtres et Liste */}
                                <div className="lg:col-span-2">
                                    <FadeIn delay={150}>
                                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                            {/* Header Filtres */}
                                            <div className="p-4 border-b border-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between">
                                                <div className="flex bg-gray-50 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
                                                    {roles.map((role) => (
                                                        <button
                                                            key={role}
                                                            onClick={() =>
                                                                handleRoleChange(
                                                                    role,
                                                                )
                                                            }
                                                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                                                                roleFilter ===
                                                                role
                                                                    ? "bg-white text-gray-900 shadow-sm"
                                                                    : "text-gray-500 hover:text-gray-700"
                                                            }`}
                                                        >
                                                            {role}
                                                        </button>
                                                    ))}
                                                </div>

                                                <div className="relative w-full md:w-64">
                                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        value={searchQuery}
                                                        onChange={(e) => {
                                                            setSearchQuery(
                                                                e.target.value,
                                                            );
                                                        }}
                                                        placeholder="Rechercher..."
                                                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                                                    />
                                                </div>
                                            </div>

                                            {/* Table */}
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">
                                                            <th className="px-6 py-4 text-left">
                                                                Participant
                                                            </th>
                                                            <th className="px-6 py-4 text-left">
                                                                Rôle
                                                            </th>
                                                            <th className="px-6 py-4 text-right">
                                                                Actions
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-50">
                                                        {paginatedParticipants.length >
                                                        0 ? (
                                                            paginatedParticipants.map(
                                                                (
                                                                    participant,
                                                                ) => (
                                                                    <tr
                                                                        key={
                                                                            participant.id
                                                                        }
                                                                        className="group hover:bg-gray-50/50 transition-colors"
                                                                    >
                                                                        <td className="px-6 py-4">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs ring-4 ring-white shadow-sm overflow-hidden">
                                                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-orange-50 group-hover:to-orange-100 transition-colors">
                                                                                        {getInitials(
                                                                                            participant.prenom,
                                                                                            participant.nom,
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-sm font-bold text-gray-900">
                                                                                        {
                                                                                            participant.prenom
                                                                                        }{" "}
                                                                                        {
                                                                                            participant.nom
                                                                                        }
                                                                                    </p>
                                                                                    <p className="text-xs text-gray-500">
                                                                                        {
                                                                                            participant.mail
                                                                                        }
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-6 py-4">
                                                                            <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold uppercase tracking-tight">
                                                                                {participant.role ||
                                                                                    "Participant"}
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-6 py-4 text-right">
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleSelectParticipant(
                                                                                        participant,
                                                                                    )
                                                                                }
                                                                                className="px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition-all shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-95"
                                                                            >
                                                                                Sélectionner
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ),
                                                            )
                                                        ) : (
                                                            <tr>
                                                                <td
                                                                    colSpan={3}
                                                                    className="px-6 py-12 text-center text-gray-400 text-sm"
                                                                >
                                                                    Aucun
                                                                    participant
                                                                    trouvé pour
                                                                    cette
                                                                    recherche.
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Footer Pagination */}
                                            <div className="p-4 border-t border-gray-50 flex items-center justify-between">
                                                <p className="text-xs text-gray-500 italic">
                                                    Affichage de{" "}
                                                    {participants.total > 0
                                                        ? (participants.current_page -
                                                              1) *
                                                              participants.per_page +
                                                          1
                                                        : 0}{" "}
                                                    à{" "}
                                                    {Math.min(
                                                        participants.current_page *
                                                            participants.per_page,
                                                        participants.total,
                                                    )}{" "}
                                                    sur {participants.total}{" "}
                                                    participants
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        disabled={
                                                            currentPage === 1
                                                        }
                                                        onClick={() =>
                                                            handlePageChange(
                                                                currentPage - 1,
                                                            )
                                                        }
                                                        className="p-2 border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <ChevronLeft className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        disabled={
                                                            currentPage >=
                                                            totalPages
                                                        }
                                                        onClick={() =>
                                                            handlePageChange(
                                                                currentPage + 1,
                                                            )
                                                        }
                                                        className="p-2 border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </FadeIn>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* SECTION 2: REMPLISSAGE DE L'ENQUÊTE (Ancien code conservé et amélioré) */
                        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <FadeIn delay={0}>
                                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner text-orange-600">
                                            <Send className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-lg font-bold text-gray-900">
                                                {enquete.titre}
                                            </h2>
                                            <p className="text-gray-600 mt-1">
                                                {enquete.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>

                            {/* Recap profil avec progression */}
                            <FadeIn delay={100}>
                                <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm sticky top-4 z-10">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                <User className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                    Participant Actuel
                                                </p>
                                                <p className="text-sm font-bold text-gray-900">
                                                    {
                                                        selectedParticipant?.prenom
                                                    }{" "}
                                                    {selectedParticipant?.nom}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsParticipantConfirmed(false)
                                            }
                                            className="text-xs font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            Changer de participant
                                        </button>
                                    </div>

                                    <div className="pt-3 border-t border-gray-100">
                                        <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
                                            <span>
                                                {answered} sur {total} questions
                                                répondues
                                            </span>
                                            <span className="text-orange-600">
                                                {progress}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-300 ease-out"
                                                style={{
                                                    width: `${progress}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>

                            {total === 0 ? (
                                <FadeIn delay={200}>
                                    <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                                            Aucune question
                                        </h3>
                                        <p className="text-gray-500">
                                            Cette enquête ne contient pas encore
                                            de questions.
                                        </p>
                                    </div>
                                </FadeIn>
                            ) : (
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    {enquete.questions.map((q, idx) => (
                                        <FadeIn
                                            key={q.id}
                                            delay={150 + idx * 50}
                                        >
                                            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:border-orange-200 transition-colors duration-300 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-400">
                                                <div className="flex items-start gap-4 mb-5">
                                                    <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 text-sm font-black flex items-center justify-center flex-shrink-0 mt-0.5 ring-4 ring-white shadow-sm">
                                                        {q.numero}
                                                    </span>
                                                    <div className="flex-1 mt-1">
                                                        <p className="text-base font-semibold text-gray-900 leading-snug">
                                                            {q.libelle}
                                                        </p>
                                                        {q.theme && (
                                                            <span className="inline-flex items-center gap-1.5 mt-2 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100">
                                                                <Tag className="w-3 h-3" />
                                                                {q.theme.libelle}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="ml-12">
                                                    {/* Saisie de la réponse */}
                                                    {q.choix &&
                                                    q.choix.length > 0 ? (
                                                        q.type_reponse ===
                                                            "select" ||
                                                        q.type_reponse ===
                                                            "Liste déroulante" ? (
                                                            <select
                                                                value={
                                                                    answers[
                                                                        q.id
                                                                    ] ?? ""
                                                                }
                                                                onChange={(e) =>
                                                                    handleChange(
                                                                        q.id,
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-sm"
                                                            >
                                                                <option value="">
                                                                    --
                                                                    Sélectionnez
                                                                    une option
                                                                    --
                                                                </option>
                                                                {q.choix.map(
                                                                    (c) => (
                                                                        <option
                                                                            key={
                                                                                c.id
                                                                            }
                                                                            value={String(
                                                                                c.id,
                                                                            )}
                                                                        >
                                                                            {
                                                                                c.libelle
                                                                            }
                                                                        </option>
                                                                    ),
                                                                )}
                                                            </select>
                                                        ) : q.type_reponse ===
                                                              "likert" ||
                                                          q.type_reponse ===
                                                              "Échelle linéaire" ? (
                                                            <div className="flex flex-wrap justify-around sm:justify-center items-center gap-2 sm:gap-6 py-4">
                                                                {q.choix.map(
                                                                    (c) => (
                                                                        <label
                                                                            key={
                                                                                c.id
                                                                            }
                                                                            className="flex flex-col items-center gap-2 cursor-pointer group"
                                                                        >
                                                                            <div
                                                                                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${answers[q.id] === String(c.id) ? "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/30" : "border-gray-200 bg-white text-gray-600 group-hover:border-orange-300 group-hover:bg-orange-50"}`}
                                                                            >
                                                                                <input
                                                                                    type="radio"
                                                                                    name={`q_${q.id}`}
                                                                                    value={String(
                                                                                        c.id,
                                                                                    )}
                                                                                    checked={
                                                                                        answers[
                                                                                            q
                                                                                                .id
                                                                                        ] ===
                                                                                        String(
                                                                                            c.id,
                                                                                        )
                                                                                    }
                                                                                    onChange={() =>
                                                                                        handleChange(
                                                                                            q.id,
                                                                                            String(
                                                                                                c.id,
                                                                                            ),
                                                                                        )
                                                                                    }
                                                                                    className="sr-only"
                                                                                />
                                                                                <span className="text-base sm:text-lg font-bold">
                                                                                    {
                                                                                        c.libelle
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        </label>
                                                                    ),
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-3">
                                                                {q.choix.map(
                                                                    (c) => {
                                                                        const isMultiple =
                                                                            q.type_reponse ===
                                                                                "checkbox" ||
                                                                            q.type_reponse ===
                                                                                "Choix multiples";
                                                                        const isSelected =
                                                                            isMultiple
                                                                                ? Array.isArray(
                                                                                      answers[
                                                                                          q
                                                                                              .id
                                                                                      ],
                                                                                  ) &&
                                                                                  answers[
                                                                                      q
                                                                                          .id
                                                                                  ].includes(
                                                                                      String(
                                                                                          c.id,
                                                                                      ),
                                                                                  )
                                                                                : answers[
                                                                                      q
                                                                                          .id
                                                                                  ] ===
                                                                                  String(
                                                                                      c.id,
                                                                                  );

                                                                        return (
                                                                            <label
                                                                                key={
                                                                                    c.id
                                                                                }
                                                                                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${isSelected ? "border-orange-500 bg-orange-50/50 shadow-sm" : "border-gray-100 hover:border-orange-200 hover:bg-gray-50"}`}
                                                                            >
                                                                                <input
                                                                                    type={
                                                                                        isMultiple
                                                                                            ? "checkbox"
                                                                                            : "radio"
                                                                                    }
                                                                                    name={
                                                                                        isMultiple
                                                                                            ? `q_${q.id}_${c.id}`
                                                                                            : `q_${q.id}`
                                                                                    }
                                                                                    value={String(
                                                                                        c.id,
                                                                                    )}
                                                                                    checked={
                                                                                        isSelected
                                                                                    }
                                                                                    onChange={(
                                                                                        e,
                                                                                    ) =>
                                                                                        isMultiple
                                                                                            ? handleCheckboxChange(
                                                                                                  q.id,
                                                                                                  String(
                                                                                                      c.id,
                                                                                                  ),
                                                                                                  e
                                                                                                      .target
                                                                                                      .checked,
                                                                                              )
                                                                                            : handleChange(
                                                                                                  q.id,
                                                                                                  String(
                                                                                                      c.id,
                                                                                                  ),
                                                                                              )
                                                                                    }
                                                                                    className={`w-5 h-5 text-orange-500 border-gray-300 focus:ring-orange-500 ${isMultiple ? "rounded" : "rounded-full"}`}
                                                                                />
                                                                                <span className="text-sm font-medium text-gray-800">
                                                                                    {
                                                                                        c.libelle
                                                                                    }
                                                                                </span>
                                                                            </label>
                                                                        );
                                                                    },
                                                                )}
                                                            </div>
                                                        )
                                                    ) : q.type_reponse ===
                                                      "textarea" ? (
                                                        <textarea
                                                            rows={4}
                                                            value={
                                                                answers[q.id] ??
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleChange(
                                                                    q.id,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Saisissez votre réponse..."
                                                            className="w-full p-4 border-2 border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-0 focus:border-orange-500 bg-gray-50 focus:bg-white transition-all resize-none shadow-inner"
                                                        />
                                                    ) : (
                                                        <input
                                                            type={
                                                                q.type_reponse ===
                                                                "number"
                                                                    ? "number"
                                                                    : q.type_reponse ===
                                                                        "date"
                                                                      ? "date"
                                                                      : "text"
                                                            }
                                                            value={
                                                                answers[q.id] ??
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleChange(
                                                                    q.id,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder={
                                                                q.type_reponse ===
                                                                "number"
                                                                    ? "Ex: 42"
                                                                    : q.type_reponse ===
                                                                        "date"
                                                                      ? ""
                                                                      : "Saisissez votre réponse..."
                                                            }
                                                            className="w-full p-4 border-2 border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-0 focus:border-orange-500 bg-gray-50 focus:bg-white transition-all shadow-inner"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </FadeIn>
                                    ))}

                                    <div className="flex justify-end gap-4 pt-4 pb-10">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.visit(
                                                    route("surveys.index"),
                                                )
                                            }
                                            className="px-6 py-3 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={progress < 100}
                                            className="flex items-center gap-2 px-8 py-3 text-sm font-bold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed group"
                                        >
                                            <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            {progress < 100
                                                ? "Répondre à toutes les questions"
                                                : "Soumettre le formulaire"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </DashboardLayout>
        </>
    );
}
