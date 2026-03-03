import DashboardLayout from "@/Layouts/DashboardLayout";
import { Survey } from "@/types/surveys";
import { Head, router } from "@inertiajs/react";
import {
    ArrowRight,
    Briefcase,
    CheckCircle,
    Mail,
    Phone,
    Send,
    User,
} from "lucide-react";
import { useState } from "react";

export interface Participant {
    id: number;
    nom: string;
    prenom: string;
    telephone: string;
    mail: string;
    entreprises?: { nom: string }[];
}

interface Props {
    enquete: Survey;
    participants: Participant[];
}

export default function SurveyFill({ enquete, participants }: Props) {
    const [selectedParticipantId, setSelectedParticipantId] = useState<
        number | ""
    >("");
    const [isParticipantConfirmed, setIsParticipantConfirmed] = useState(false);
    const [answers, setAnswers] = useState<Record<number, any>>({});

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

        // Convert array answers to string representations for Laravel backend
        const formattedAnswers = { ...answers };
        Object.keys(formattedAnswers).forEach((key) => {
            if (Array.isArray(formattedAnswers[Number(key)])) {
                formattedAnswers[Number(key)] = JSON.stringify(
                    formattedAnswers[Number(key)],
                );
            }
        });

        router.post(route("surveys.fill.submit", { id: enquete.id }), {
            participant_id: selectedParticipantId,
            reponses: formattedAnswers,
        });
    };

    const selectedParticipant = participants?.find(
        (p) => p.id === Number(selectedParticipantId),
    );

    return (
        <>
            <Head title={`Remplir — ${enquete.titre}`} />
            <DashboardLayout
                title="Remplir l'enquête"
                breadcrumbs={[
                    { label: "Accueil", href: "/tableau-de-bord" },
                    { label: "Enquêtes", href: "/enquetes" },
                    { label: "Remplir" },
                ]}
            >
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* En-tête de l'enquête */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
                                <CheckCircle className="w-6 h-6 text-orange-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg font-bold text-gray-900">
                                    {enquete.titre}
                                </h2>
                                <p className="text-gray-600 mt-1 whitespace-pre-line">
                                    {enquete.description}
                                </p>
                                <div className="flex items-center gap-3 mt-3 text-sm text-gray-500 font-medium">
                                    <span className="bg-gray-100 px-2.5 py-1 rounded-md">
                                        Du {enquete.date_debut} au{" "}
                                        {enquete.date_fin}
                                    </span>
                                    <span className="bg-orange-50 text-orange-600 px-2.5 py-1 rounded-md">
                                        {enquete.type_campagne}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {!isParticipantConfirmed ? (
                        /* SECTION 1: SÉLECTION DU PARTICIPANT */
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-orange-500" />
                                Pour qui remplissez-vous cette enquête ?
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <label
                                        htmlFor="participant"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Sélectionner un participant existant
                                    </label>
                                    <select
                                        id="participant"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-sm"
                                        value={selectedParticipantId}
                                        onChange={(e) =>
                                            setSelectedParticipantId(
                                                e.target.value === ""
                                                    ? ""
                                                    : Number(e.target.value),
                                            )
                                        }
                                    >
                                        <option value="">
                                            -- Sélectionnez un participant --
                                        </option>
                                        {participants?.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.prenom} {p.nom}{" "}
                                                {p.entreprises &&
                                                p.entreprises.length > 0
                                                    ? `(${p.entreprises[0].nom})`
                                                    : ""}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {selectedParticipant && (
                                    <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200 rounded-2xl p-5 shadow-sm">
                                        <h4 className="text-sm border-b border-orange-200 pb-2 font-bold justify-between text-orange-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            Profil Sélectionné
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs font-semibold text-orange-600/70 mb-1">
                                                    Nom Complet
                                                </p>
                                                <p className="text-gray-900 font-medium text-base">
                                                    {selectedParticipant.prenom}{" "}
                                                    {selectedParticipant.nom}
                                                </p>
                                            </div>
                                            {selectedParticipant.entreprises &&
                                                selectedParticipant.entreprises
                                                    .length > 0 && (
                                                    <div className="flex items-start gap-2">
                                                        <Briefcase className="w-4 h-4 text-orange-400 mt-0.5" />
                                                        <div>
                                                            <p className="text-xs font-semibold text-orange-600/70 mb-1">
                                                                Entreprise
                                                            </p>
                                                            <p className="text-gray-900 font-medium text-sm">
                                                                {
                                                                    selectedParticipant
                                                                        .entreprises[0]
                                                                        .nom
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            {selectedParticipant.mail && (
                                                <div className="flex items-start gap-2">
                                                    <Mail className="w-4 h-4 text-orange-400 mt-0.5" />
                                                    <div className="truncate">
                                                        <p className="text-xs font-semibold text-orange-600/70 mb-1">
                                                            Email
                                                        </p>
                                                        <p className="text-gray-900 font-medium text-sm truncate">
                                                            {
                                                                selectedParticipant.mail
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            {selectedParticipant.telephone && (
                                                <div className="flex items-start gap-2">
                                                    <Phone className="w-4 h-4 text-orange-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs font-semibold text-orange-600/70 mb-1">
                                                            Téléphone
                                                        </p>
                                                        <p className="text-gray-900 font-medium text-sm">
                                                            {
                                                                selectedParticipant.telephone
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end pt-2">
                                    <button
                                        type="button"
                                        disabled={!selectedParticipant}
                                        onClick={() =>
                                            setIsParticipantConfirmed(true)
                                        }
                                        className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gray-900 rounded-xl hover:bg-black transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Continuer vers l'enquête
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* SECTION 2: REMPLISSAGE DE L'ENQUÊTE */
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            {/* Recap profil avec progression */}
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
                                                {selectedParticipant?.prenom}{" "}
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
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {total === 0 ? (
                                <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                        Aucune question
                                    </h3>
                                    <p className="text-gray-500">
                                        Cette enquête ne contient pas encore de
                                        questions publiquement disponibles.
                                    </p>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    {enquete.questions.map((q, idx) => (
                                        <div
                                            key={q.id}
                                            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:border-orange-200 transition-colors duration-300 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-400"
                                        >
                                            <div className="flex items-start gap-4 mb-5">
                                                <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 text-sm font-black flex items-center justify-center flex-shrink-0 mt-0.5 ring-4 ring-white shadow-sm">
                                                    {q.numero}
                                                </span>
                                                <div className="flex-1 mt-1">
                                                    <p className="text-base font-semibold text-gray-900 leading-snug">
                                                        {q.libelle}
                                                    </p>
                                                    {q.type_reponse && (
                                                        <span className="inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded text-gray-500 bg-gray-100">
                                                            {q.type_reponse}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="ml-12">
                                                {/* Choix multiples si disponibles */}
                                                {q.choix.length > 0 ? (
                                                    q.type_reponse ===
                                                    "Liste déroulante" ? (
                                                        <select
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
                                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-sm"
                                                        >
                                                            <option value="">
                                                                -- Sélectionnez
                                                                une option --
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
                                                                            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                                                                isSelected
                                                                                    ? "border-orange-500 bg-orange-50/50 shadow-sm"
                                                                                    : "border-gray-100 hover:border-orange-200 hover:bg-gray-50"
                                                                            }`}
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
                                                ) : /* Réponse libre (Texte, Nombre, Date, etc.) */
                                                q.type_reponse ===
                                                  "Texte long" ? (
                                                    <textarea
                                                        rows={4}
                                                        value={
                                                            answers[q.id] ?? ""
                                                        }
                                                        onChange={(e) =>
                                                            handleChange(
                                                                q.id,
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Saisissez votre réponse..."
                                                        className="w-full p-4 border-2 border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-0 focus:border-orange-500 bg-gray-50 focus:bg-white transition-all resize-none shadow-inner"
                                                    />
                                                ) : (
                                                    <input
                                                        type={
                                                            q.type_reponse ===
                                                            "Nombre"
                                                                ? "number"
                                                                : q.type_reponse ===
                                                                    "Date"
                                                                  ? "date"
                                                                  : "text"
                                                        }
                                                        value={
                                                            answers[q.id] ?? ""
                                                        }
                                                        onChange={(e) =>
                                                            handleChange(
                                                                q.id,
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder={
                                                            q.type_reponse ===
                                                            "Nombre"
                                                                ? "Ex: 42"
                                                                : q.type_reponse ===
                                                                    "Date"
                                                                  ? ""
                                                                  : "Saisissez votre réponse..."
                                                        }
                                                        className="w-full p-4 border-2 border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-0 focus:border-orange-500 bg-gray-50 focus:bg-white transition-all shadow-inner"
                                                    />
                                                )}
                                            </div>
                                        </div>
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
