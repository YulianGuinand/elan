import FadeIn from "@/Components/Animations/FadeIn";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, router } from "@inertiajs/react";
import { ChevronRight, Send } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Survey, ThemeEnquete } from "../../types/surveys";
import FillSidebar from "./Partials/Fill/FillSidebar";
import ParticipantSelection from "./Partials/Fill/ParticipantSelection";
import QuestionRenderer from "./Partials/Fill/QuestionRenderer";
import ThemeNavigation from "./Partials/Fill/ThemeNavigation";

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

    const [currentThemeIndex, setCurrentThemeIndex] = useState(0);

    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    const [roleFilter, setRoleFilter] = useState(filters.role || "Tous");

    const totalQuestions = (enquete.questions || []).length;

    const themes = useMemo((): ThemeEnquete[] => {
        const surveyWithThemes = enquete as Survey & {
            themes?: ThemeEnquete[];
        };
        if (surveyWithThemes.themes && surveyWithThemes.themes.length > 0) {
            return surveyWithThemes.themes;
        }

        return [
            {
                id: 0,
                libelle: "Général",
                ordre: 0,
                questions: enquete.questions || [],
            },
        ];
    }, [enquete]);

    const currentTheme = themes[currentThemeIndex] || themes[0];

    const answeredCount = Object.keys(answers).filter(
        (k) => answers[Number(k)] !== undefined && answers[Number(k)] !== "",
    ).length;
    const progress =
        totalQuestions > 0
            ? Math.round((answeredCount / totalQuestions) * 100)
            : 0;

    const isFirstTheme = currentThemeIndex === 0;
    const isLastTheme = currentThemeIndex === themes.length - 1;

    // Debounce pour la recherche
    useEffect(() => {
        if (searchQuery === (filters.search || "")) return;
        const timeoutId = setTimeout(() => {
            router.get(
                route("surveys.fill", { id: enquete.id }),
                { search: searchQuery, role: roleFilter },
                { preserveState: true, replace: true, only: ["participants"] },
            );
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, filters.search, enquete.id, roleFilter]);

    // Handlers
    const handleRoleChange = (role: string) => {
        setRoleFilter(role);
        router.get(
            route("surveys.fill", { id: enquete.id }),
            { search: searchQuery, role: role },
            { preserveState: true, replace: true, only: ["participants"] },
        );
    };

    const handleChange = useCallback((questionId: number, value: any) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    }, []);

    const handleCheckboxChange = useCallback(
        (questionId: number, value: string, checked: boolean) => {
            setAnswers((prev) => {
                const current = Array.isArray(prev[questionId])
                    ? prev[questionId]
                    : [];
                if (checked) {
                    return { ...prev, [questionId]: [...current, value] };
                } else {
                    return {
                        ...prev,
                        [questionId]: current.filter(
                            (v: string) => v !== value,
                        ),
                    };
                }
            });
        },
        [],
    );

    const nextTheme = (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (!isLastTheme) {
            setCurrentThemeIndex((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const prevTheme = () => {
        if (!isFirstTheme) {
            setCurrentThemeIndex((prev) => prev - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
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

    return (
        <>
            <Head
                title={`${isParticipantConfirmed ? `Remplissage — ${selectedParticipant?.prenom}` : "Sélection"} — ${enquete.titre}`}
            />

            {isParticipantConfirmed ? (
                <DashboardLayout
                    title={`Remplissage — ${enquete.titre}`}
                    breadcrumbs={[
                        { label: "Accueil", href: "/tableau-de-bord" },
                        { label: "Enquêtes", href: "/enquetes" },
                        {
                            label: "Sélection",
                            onClick: () => setIsParticipantConfirmed(false),
                        },
                        { label: "Saisie" },
                    ]}
                >
                    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 w-full items-start">
                        {/* Barre Latérale Gauche */}
                        <div className="lg:col-span-3 flex flex-col gap-6 w-full sticky top-8">
                            <FadeIn delay={100}>
                                <FillSidebar
                                    participant={selectedParticipant}
                                    onChangeParticipant={() =>
                                        setIsParticipantConfirmed(false)
                                    }
                                />
                            </FadeIn>

                            <FadeIn delay={200}>
                                <ThemeNavigation
                                    themes={themes}
                                    currentThemeIndex={currentThemeIndex}
                                    setCurrentThemeIndex={setCurrentThemeIndex}
                                    answers={answers}
                                />
                            </FadeIn>
                        </div>

                        {/* Zone Centrale de Questionnement */}
                        <div className="lg:col-span-9 w-full min-w-0 flex flex-col gap-6">
                            <FadeIn delay={300}>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden flex flex-col">
                                        <div className="p-6 md:p-8 space-y-6">
                                            <div className="flex items-center justify-between gap-4">
                                                <h2 className="text-xl font-black text-gray-900 tracking-tight">
                                                    {currentTheme.libelle}
                                                </h2>
                                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                                    Question{" "}
                                                    <span className="text-orange-500 font-black">
                                                        {answeredCount}
                                                    </span>{" "}
                                                    sur {totalQuestions}
                                                </span>
                                            </div>

                                            <div className="relative pt-1">
                                                <div className="overflow-hidden h-2.5 flex rounded-full bg-gray-100">
                                                    <div
                                                        style={{
                                                            width: `${progress}%`,
                                                        }}
                                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#F58232] transition-all duration-700 ease-out rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 md:p-8 border-t border-gray-50 bg-gray-50/20">
                                            <div className="space-y-6">
                                                {(
                                                    currentTheme?.questions ||
                                                    []
                                                ).map((q: any) => (
                                                    <QuestionRenderer
                                                        key={q.id}
                                                        question={q}
                                                        value={answers[q.id]}
                                                        onChange={(val) =>
                                                            handleChange(
                                                                q.id,
                                                                val,
                                                            )
                                                        }
                                                        onCheckboxChange={(
                                                            val,
                                                            checked,
                                                        ) =>
                                                            handleCheckboxChange(
                                                                q.id,
                                                                val,
                                                                checked,
                                                            )
                                                        }
                                                    />
                                                ))}
                                            </div>

                                            <div className="flex items-center justify-between pt-8 border-t border-gray-100/50 mt-10">
                                                <SecondaryButton
                                                    type="button"
                                                    onClick={prevTheme}
                                                    disabled={isFirstTheme}
                                                >
                                                    Retour
                                                </SecondaryButton>

                                                {!isLastTheme ? (
                                                    <PrimaryButton
                                                        type="button"
                                                        onClick={(e) =>
                                                            nextTheme(e)
                                                        }
                                                    >
                                                        Theme Suivant
                                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                    </PrimaryButton>
                                                ) : (
                                                    <PrimaryButton
                                                        type="submit"
                                                        className="flex flex-row"
                                                    >
                                                        <Send className="w-4 h-4 mr-3.5" />
                                                        Soumettre l&apos;enquête
                                                    </PrimaryButton>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </FadeIn>
                        </div>
                    </div>
                </DashboardLayout>
            ) : (
                <DashboardLayout
                    title="Selection du participant"
                    breadcrumbs={[
                        { label: "Accueil", href: "/tableau-de-bord" },
                        { label: "Enquêtes", href: "/enquetes" },
                        { label: "Remplir" },
                    ]}
                >
                    <ParticipantSelection
                        participants={participants}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        roleFilter={roleFilter}
                        onRoleChange={handleRoleChange}
                        onSelect={(p) => {
                            setSelectedParticipant(p);
                            setIsParticipantConfirmed(true);
                        }}
                        availableRoles={availableRoles}
                        enquete={enquete}
                    />
                </DashboardLayout>
            )}
        </>
    );
}
