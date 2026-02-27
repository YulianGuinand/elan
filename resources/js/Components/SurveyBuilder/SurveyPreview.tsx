import FadeIn from "@/Components/Animations/FadeIn";
import Card from "@/Components/Common/Card";
import PrimaryButton from "@/Components/PrimaryButton";
import {
    getQuestionIcon,
    getQuestionTypeLabel,
} from "@/constants/questionTypes";
import { useSurveyBuilder } from "@/contexts/SurveyBuilderContext";
import { Question } from "@/types/surveyBuilder";
import { router } from "@inertiajs/react";
import { Send } from "lucide-react";

export default function SurveyPreview() {
    const { state, setStep, exportSurvey, clearDraft } = useSurveyBuilder();

    const handlePublish = () => {
        const survey = exportSurvey();

        // Envoyer au backend
        router.post(route("surveys.builder.store"), survey as any, {
            onSuccess: () => {
                clearDraft();
                router.visit(route("surveys.index"));
            },
            onError: (errors) => {
                console.error("Erreur lors de la publication:", errors);
                alert(
                    "Une erreur est survenue lors de la publication de l'enquête"
                );
            },
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <FadeIn delay={0}>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                            Aperçu de l'enquête
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Vérifiez votre enquête avant publication
                        </p>
                    </div>
                </div>
            </FadeIn>

            {/* Basic Info */}
            <FadeIn delay={100}>
                <Card>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                                {state.basicInfo.title}
                            </h3>
                            {state.basicInfo.description && (
                                <p className="text-gray-600 mt-2">
                                    {state.basicInfo.description}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Public : </span>
                                <span className="font-medium text-gray-900">
                                    {state.basicInfo.audience.join(", ")}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500">Du </span>
                                <span className="font-medium text-gray-900">
                                    {new Date(
                                        state.basicInfo.startDate
                                    ).toLocaleDateString("fr-FR")}
                                </span>
                                <span className="text-gray-500"> au </span>
                                <span className="font-medium text-gray-900">
                                    {new Date(
                                        state.basicInfo.endDate
                                    ).toLocaleDateString("fr-FR")}
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>
            </FadeIn>

            {/* Themes and Questions */}
            {state.themes.map((theme, themeIndex) => (
                <FadeIn key={theme.id} delay={150 + themeIndex * 50}>
                    <Card>
                        <div className="space-y-6">
                            {/* Theme header */}
                            <div className="pb-4 border-b border-gray-200">
                                <h4 className="text-lg font-semibold text-gray-900">
                                    {theme.title}
                                </h4>
                                {theme.description && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        {theme.description}
                                    </p>
                                )}
                            </div>

                            {/* Questions */}
                            <div className="space-y-6">
                                {theme.questions.map((question, qIndex) => (
                                    <QuestionPreview
                                        key={question.id}
                                        question={question}
                                        index={qIndex}
                                    />
                                ))}
                            </div>
                        </div>
                    </Card>
                </FadeIn>
            ))}

            {/* Summary */}
            <FadeIn delay={300}>
                <Card className="bg-gray-50">
                    <div className="text-center py-4">
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold text-gray-900">
                                {state.themes.length}
                            </span>{" "}
                            thème{state.themes.length > 1 ? "s" : ""} •{" "}
                            <span className="font-semibold text-gray-900">
                                {state.themes.reduce(
                                    (acc, t) => acc + t.questions.length,
                                    0
                                )}
                            </span>{" "}
                            question
                            {state.themes.reduce(
                                (acc, t) => acc + t.questions.length,
                                0
                            ) > 1
                                ? "s"
                                : ""}
                        </p>
                    </div>
                </Card>
            </FadeIn>

            {/* Actions */}
            <FadeIn delay={350}>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4">
                    <button
                        onClick={() => setStep("builder")}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors order-2 sm:order-1"
                    >
                        ← Retour à l'édition
                    </button>
                    <PrimaryButton
                        onClick={handlePublish}
                        className="order-1 sm:order-2 justify-center"
                    >
                        <Send className="w-4 h-4 mr-2" />
                        Publier l'enquête
                    </PrimaryButton>
                </div>
            </FadeIn>
        </div>
    );
}

interface QuestionPreviewProps {
    question: Question;
    index: number;
}

function QuestionPreview({ question, index }: QuestionPreviewProps) {
    const Icon = getQuestionIcon(question.type);
    const typeLabel = getQuestionTypeLabel(question.type);

    return (
        <div className="space-y-3">
            {/* Question label */}
            <div className="flex items-start gap-2">
                <span className="text-sm font-medium text-gray-700 flex-shrink-0">
                    {index + 1}.
                </span>
                <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-gray-900">
                            {question.label}
                            {question.required && (
                                <span className="text-red-500 ml-1">*</span>
                            )}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Icon className="w-3 h-3" />
                            <span>{typeLabel}</span>
                        </div>
                    </div>
                    {question.description && (
                        <p className="text-sm text-gray-600 mt-1">
                            {question.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Question input preview */}
            <div className="pl-6">{renderQuestionInput(question)}</div>
        </div>
    );
}

function renderQuestionInput(question: Question) {
    switch (question.type) {
        case "text":
            return (
                <input
                    type="text"
                    placeholder={question.placeholder || "Votre réponse..."}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    disabled
                />
            );

        case "textarea":
            return (
                <textarea
                    placeholder={question.placeholder || "Votre réponse..."}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    disabled
                />
            );

        case "radio":
        case "checkbox":
            return (
                <div className="space-y-2">
                    {question.options?.map((option) => (
                        <label
                            key={option.id}
                            className="flex items-center gap-2 cursor-not-allowed"
                        >
                            <input
                                type={question.type}
                                name={question.id}
                                className="text-elan-orange focus:ring-elan-orange"
                                disabled
                            />
                            <span className="text-sm text-gray-700">
                                {option.label}
                            </span>
                        </label>
                    ))}
                </div>
            );

        case "select":
            return (
                <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    disabled
                >
                    <option>{question.placeholder || "Sélectionner..."}</option>
                    {question.options?.map((option) => (
                        <option key={option.id}>{option.label}</option>
                    ))}
                </select>
            );

        case "number":
            return (
                <input
                    type="number"
                    placeholder={question.placeholder || "0"}
                    min={question.validation?.min}
                    max={question.validation?.max}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    disabled
                />
            );

        case "likert":
            return (
                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                        {Array.from({
                            length:
                                (question.scale?.max || 5) -
                                (question.scale?.min || 1) +
                                1,
                        }).map((_, i) => {
                            const value = (question.scale?.min || 1) + i;
                            return (
                                <label
                                    key={value}
                                    className="flex flex-col items-center gap-1 cursor-not-allowed"
                                >
                                    <input
                                        type="radio"
                                        name={question.id}
                                        className="text-elan-orange focus:ring-elan-orange"
                                        disabled
                                    />
                                    <span className="text-xs text-gray-600">
                                        {value}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>{question.scale?.minLabel}</span>
                        <span>{question.scale?.maxLabel}</span>
                    </div>
                </div>
            );

        case "date":
            return (
                <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    disabled
                />
            );

        default:
            return null;
    }
}
