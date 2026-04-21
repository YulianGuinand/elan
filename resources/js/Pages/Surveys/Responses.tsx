import FadeIn from "@/Components/Animations/FadeIn";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, router } from "@inertiajs/react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {QuestionEnquete, Survey, ThemeEnquete} from "../../types/surveys";
import { Question } from "@/types/surveyBuilder";
import ParticipantSelection from "./Partials/Fill/ParticipantSelection";
import { Participant } from "./Fill";
import QuestionTypeSelector from "@/Components/SurveyBuilder/QuestionTypeSelector";
import {QUESTION_TYPES} from "@/constants/questionTypes";

interface PivotReponse {
    valeur: string;
    display_value: string;
    created_at: string;
}

interface QuestionWithPivot {
    id: number;
    libelle: string;
    type: string;
    pivot: PivotReponse;
}

interface ParticipantWithAnswers extends Participant {
    questions: QuestionWithPivot[];
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
    participants: PaginationData<Participant>;     // pour la sélection (sans réponses)
    selectedParticipantData: ParticipantWithAnswers | null; // chargé après sélection
    filters: { search: string | null; role: string };
    availableRoles: string[];
}

const getEmojiForLikert = (index: number, total: number) => {
    const emojis = ['😡', '😐', '😶', '🙂', '🤩'];
    const mockupEmojis = ['😫', '☹️', '😐', '🙂', '🤩']; // More like mockup
    if (total === 5) return mockupEmojis[index];
    const ratio = index / (total - 1);
    return mockupEmojis[Math.round(ratio * 4)];
};

function ResponseValue({ pivot , question }: { pivot: PivotReponse ,question: QuestionEnquete}) {
    if (!pivot?.valeur) {
        return <span className="text-gray-400 italic text-sm">—</span>;
    }

    const display = pivot.display_value || pivot.valeur;
    const type = question.type_reponse;
    // Essai de parsing JSON (choix multiples)
    try {
        const parsed = JSON.parse(pivot.valeur);
        if (Array.isArray(parsed)) {
            const labels = display.split(",").map((s) => s.trim());
            return (
                <div className="flex flex-wrap gap-1.5">
                    {labels.map((label, i) => (
                        <span
                            key={i}
                            className="inline-block bg-orange-50 text-orange-800 text-xs font-medium px-2.5 py-1 rounded-full"
                        >
                            {label}
                        </span>
                    ))}
                </div>
            );
        }
    } catch {}

    if (type == "likert") {

        return (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {Array.from({
                    length: (question.choix) ? question.choix.length : 0
                }).map((_, idx) => {
                    const isSelected = question.choix[idx].id === parseInt(pivot.valeur); // compare against parsed index
                    return (
                        <label key={idx} className="cursor-pointer group">
                            <input
                                type="radio"
                                name={`q_${question.id}`}
                                value={String(idx)}
                                checked={isSelected}
                                readOnly // add readOnly since this is display-only
                                className="sr-only"
                            />
                            <div className={`
                            flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 h-full
                            ${isSelected
                                ? "border-orange-500 bg-white shadow-md shadow-orange-500/5 ring-4 ring-orange-500/5"
                                : "border-gray-100 bg-white hover:border-gray-200"}
                        `}>
                            <span className={`text-2xl transition-all duration-300 ${isSelected ? "scale-110" : "filter grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0"}`}>
                                {getEmojiForLikert(idx, question.choix?.length || 0)}
                            </span>
                                <span className={`text-[10px] font-black text-center uppercase tracking-tighter leading-tight ${isSelected ? "text-gray-900" : "text-gray-400"}`}>
                                {question.choix ? question.choix[idx].libelle : idx + 1}
                            </span>
                            </div>
                        </label>
                    );
                })}
            </div>
        );
    }
    // Valeur simple — numérique ou texte long
    const isNumeric = !isNaN(Number(display)) && display.trim() !== "";
    if (isNumeric) {
        return (
            <span className="text-2 font-black text-orange-500">
                {display}
            </span>
        );
    }

    return <p className="text-sm text-gray-700 leading-relaxed">{display}</p>;
}

export default function SurveyResponses({
                                            enquete,
                                            participants,
                                            selectedParticipantData,
                                            filters,
                                            availableRoles,
                                        }: Props) {
    const [selectedParticipant, setSelectedParticipant] =
        useState<Participant | null>(null);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    const [roleFilter, setRoleFilter] = useState(filters.role || "Tous");

    // Même logique de thèmes que SurveyFill
    const themes = useMemo((): ThemeEnquete[] => {
        const surveyWithThemes = enquete as Survey & { themes?: ThemeEnquete[] };
        if (surveyWithThemes.themes?.length) return surveyWithThemes.themes;
        return [{ id: 0, libelle: "Général", ordre: 0, questions: enquete.questions || [] }];
    }, [enquete]);

    const currentTheme = themes[currentThemeIndex] || themes[0];
    const isFirstTheme = currentThemeIndex === 0;
    const isLastTheme = currentThemeIndex === themes.length - 1;

    // Réponses indexées par question_id pour accès rapide
    const answersByQuestionId = useMemo(() => {
        if (!selectedParticipantData) return {};
        return Object.fromEntries(
            selectedParticipantData.questions.map((q) => [q.id, q.pivot])
        );
    }, [selectedParticipantData]);

    // Debounce recherche
    useEffect(() => {
        if (searchQuery === (filters.search || "")) return;
        const t = setTimeout(() => {
            router.get(
                route("surveys.responses", { id: enquete.id }),
                { search: searchQuery, role: roleFilter },
                { preserveState: true, replace: true, only: ["participants"] }
            );
        }, 300);
        return () => clearTimeout(t);
    }, [searchQuery, filters.search, enquete.id, roleFilter]);

    const handleRoleChange = (role: string) => {
        setRoleFilter(role);
        router.get(
            route("surveys.responses", { id: enquete.id }),
            { search: searchQuery, role },
            { preserveState: true, replace: true, only: ["participants"] }
        );
    };

    const handleSelect = useCallback((p: Participant) => {
        setSelectedParticipant(p);
        setCurrentThemeIndex(0);
        // Charge les réponses de ce participant via Inertia (partial reload)
        router.get(
            route("surveys.responses", { id: enquete.id }),
            { search: searchQuery, role: roleFilter, participant_id: p.id },
            { preserveState: true, replace: true, only: ["selectedParticipantData"] }
        );
        setIsConfirmed(true);
    }, [enquete.id, searchQuery, roleFilter]);

    const getInitials = (p: Participant) =>
        `${p.prenom?.[0] ?? ""}${p.nom?.[0] ?? ""}`.toUpperCase();

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("fr-FR", {
            day: "2-digit", month: "short", year: "numeric",
        });
    };

    const answeredAt = selectedParticipantData?.questions?.[0]?.pivot?.created_at;

    return (
        <>
            <Head title={`Réponses — ${enquete.titre}`} />

            {isConfirmed && selectedParticipant ? (
                <DashboardLayout
                    title={`Réponses — ${enquete.titre}`}
                    breadcrumbs={[
                        { label: "Accueil", href: "/tableau-de-bord" },
                        { label: "Enquêtes", href: "/enquetes" },
                        { label: "Sélection", onClick: () => setIsConfirmed(false) },
                        { label: "Consultation" },
                    ]}
                >
                    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 w-full items-start">
                        {/* Sidebar gauche */}
                        <div className="lg:col-span-3 flex flex-col gap-6 w-full sticky top-8">
                            <FadeIn delay={100}>
                                {/* Carte participant */}
                                <div className="bg-white rounded-lg border border-gray-100 p-5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-sm font-black text-orange-700 flex-shrink-0">
                                            {getInitials(selectedParticipant)}
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 text-sm">
                                                {selectedParticipant.prenom} {selectedParticipant.nom}
                                            </p>
                                            <p className="text-xs text-gray-500">{selectedParticipant.role}</p>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-100 pt-3 text-xs text-gray-500 space-y-1">
                                        {selectedParticipant.entreprises?.[0] && (
                                            <p>{selectedParticipant.entreprises[0].nom}</p>
                                        )}
                                        {answeredAt && (
                                            <p>Répondu le <span className="text-gray-700">{formatDate(answeredAt)}</span></p>
                                        )}
                                    </div>
                                    <SecondaryButton
                                        type="button"
                                        onClick={() => setIsConfirmed(false)}
                                        className="w-full mt-4 justify-center text-xs"
                                    >
                                        Changer de participant
                                    </SecondaryButton>
                                </div>
                            </FadeIn>

                            <FadeIn delay={200}>
                                {/* Navigation thèmes */}
                                <div className="bg-white rounded-lg border border-gray-100 p-4">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                                        Thèmes
                                    </p>
                                    <nav className="space-y-1">
                                        {themes.map((theme, idx) => (
                                            <button
                                                key={theme.id}
                                                type="button"
                                                onClick={() => setCurrentThemeIndex(idx)}
                                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                                                    idx === currentThemeIndex
                                                        ? "bg-orange-50 text-orange-700 font-black"
                                                        : "text-gray-500 hover:bg-gray-50"
                                                }`}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                                    idx === currentThemeIndex ? "bg-orange-500" : "bg-gray-300"
                                                }`} />
                                                {theme.libelle}
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            </FadeIn>
                        </div>

                        {/* Zone principale */}
                        <div className="lg:col-span-9 w-full min-w-0">
                            <FadeIn delay={300}>
                                <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                                    {/* Header du thème */}
                                    <div className="p-6 md:p-8 border-b border-gray-50">
                                        <div className="flex items-center justify-between gap-4 mb-4">
                                            <h2 className="text-xl font-black text-gray-900 tracking-tight">
                                                {currentTheme.libelle}
                                            </h2>
                                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                                Thème{" "}
                                                <span className="text-orange-500 font-black">
                                                    {currentThemeIndex + 1}
                                                </span>{" "}
                                                sur {themes.length}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Liste des réponses */}
                                    <div className="divide-y divide-gray-50">
                                        {currentTheme.questions.map((question: any) => {
                                            const pivot = answersByQuestionId[question.id];
                                            const typeq = answersByQuestionId[question.type];
                                            return (
                                                <div key={question.id} className="p-6 md:px-8">
                                                    <p className="text-xs text-gray-400 uppercase tracking-wide font-black mb-2">
                                                        {QUESTION_TYPES.map((config) => {
                                                            if(question.type_reponse === config.type) {
                                                                return config.label
                                                            }
                                                        })}
                                                    </p>
                                                    <p className="text-2xl text-gray-600 mb-3 leading-snug font-bold ">
                                                        {question.libelle}
                                                    </p>
                                                    {pivot ? (
                                                        <ResponseValue pivot={pivot} question={question} />
                                                    ) : (
                                                        <span className="text-sm text-gray-300 italic">
                                                            Sans réponse
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Navigation bas */}
                                    <div className="flex items-center justify-between p-6 md:px-8 border-t border-gray-100 bg-gray-50/30">
                                        <SecondaryButton
                                            type="button"
                                            onClick={() => {
                                                setCurrentThemeIndex((p) => p - 1);
                                                window.scrollTo({ top: 0, behavior: "smooth" });
                                            }}
                                            disabled={isFirstTheme}
                                        >
                                            <ChevronLeft className="w-4 h-4 mr-1" />
                                            Précédent
                                        </SecondaryButton>

                                        <PrimaryButton
                                            type="button"
                                            onClick={() => {
                                                setCurrentThemeIndex((p) => p + 1);
                                                window.scrollTo({ top: 0, behavior: "smooth" });
                                            }}
                                            disabled={isLastTheme}
                                        >
                                            Thème suivant
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </DashboardLayout>
            ) : (
                <DashboardLayout
                    title="Sélection du participant"
                    breadcrumbs={[
                        { label: "Accueil", href: "/tableau-de-bord" },
                        { label: "Enquêtes", href: "/enquetes" },
                        { label: "Réponses" },
                    ]}
                >
                    <ParticipantSelection
                        participants={participants}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        roleFilter={roleFilter}
                        onRoleChange={handleRoleChange}
                        onSelect={handleSelect}
                        availableRoles={availableRoles}
                        enquete={enquete}
                    />
                </DashboardLayout>
            )}
        </>
    );
}
