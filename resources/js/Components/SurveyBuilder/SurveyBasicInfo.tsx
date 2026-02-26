import FadeIn from "@/Components/Animations/FadeIn";
import Card, { CardHeader } from "@/Components/Common/Card";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { useSurveyBuilder } from "@/contexts/SurveyBuilderContext";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

export default function SurveyBasicInfo() {
    const { state, updateBasicInfo, setStep } = useSurveyBuilder();
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!state.basicInfo.title.trim()) {
            newErrors.title = "Le titre est obligatoire";
        }

        if (!state.basicInfo.startDate) {
            newErrors.startDate = "La date de début est obligatoire";
        }

        if (!state.basicInfo.endDate) {
            newErrors.endDate = "La date de fin est obligatoire";
        }

        if (
            state.basicInfo.startDate &&
            state.basicInfo.endDate &&
            new Date(state.basicInfo.endDate) <
                new Date(state.basicInfo.startDate)
        ) {
            newErrors.endDate =
                "La date de fin doit être après la date de début";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) {
            setStep("builder");
        }
    };

    const audienceOptions = [
        { value: "apprentis", label: "Apprentis" },
        { value: "tuteurs", label: "Tuteurs" },
        { value: "formateurs", label: "Formateurs" },
        { value: "alumni", label: "Alumni" },
    ];

    const toggleAudience = (value: string) => {
        const current = state.basicInfo.audience;
        if (current.includes(value)) {
            updateBasicInfo({
                audience: current.filter((a) => a !== value),
            });
        } else {
            updateBasicInfo({
                audience: [...current, value],
            });
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <FadeIn delay={0}>
                <Card>
                    <CardHeader
                        title="Informations de base"
                        description="Définissez les détails principaux de votre enquête"
                    />

                    <div className="space-y-4 sm:space-y-6">
                        {/* Titre */}
                        <div>
                            <InputLabel
                                htmlFor="title"
                                value="Titre de l'enquête *"
                            />
                            <TextInput
                                id="title"
                                type="text"
                                value={state.basicInfo.title}
                                onChange={(e) =>
                                    updateBasicInfo({ title: e.target.value })
                                }
                                className="mt-1 block w-full"
                                placeholder="Ex: Enquête de satisfaction 2024"
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <InputLabel
                                htmlFor="description"
                                value="Description"
                            />
                            <textarea
                                id="description"
                                value={state.basicInfo.description}
                                onChange={(e) =>
                                    updateBasicInfo({
                                        description: e.target.value,
                                    })
                                }
                                rows={4}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-elan-orange focus:ring-elan-orange"
                                placeholder="Décrivez l'objectif de cette enquête..."
                            />
                        </div>

                        {/* Public cible */}
                        <div>
                            <InputLabel value="Public cible *" />
                            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {audienceOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() =>
                                            toggleAudience(option.value)
                                        }
                                        className={`px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
                                            state.basicInfo.audience.includes(
                                                option.value
                                            )
                                                ? "border-elan-orange bg-elan-orange text-white"
                                                : "border-gray-300 bg-white text-gray-700 hover:border-elan-orange"
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <InputLabel
                                    htmlFor="startDate"
                                    value="Date de début *"
                                />
                                <TextInput
                                    id="startDate"
                                    type="date"
                                    value={state.basicInfo.startDate}
                                    onChange={(e) =>
                                        updateBasicInfo({
                                            startDate: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full"
                                />
                                {errors.startDate && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.startDate}
                                    </p>
                                )}
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="endDate"
                                    value="Date de fin *"
                                />
                                <TextInput
                                    id="endDate"
                                    type="date"
                                    value={state.basicInfo.endDate}
                                    onChange={(e) =>
                                        updateBasicInfo({
                                            endDate: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full"
                                />
                                {errors.endDate && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.endDate}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            </FadeIn>

            {/* Actions */}
            <FadeIn delay={100}>
                <div className="flex justify-end">
                    <PrimaryButton onClick={handleNext}>
                        Continuer vers la construction
                    </PrimaryButton>
                </div>
            </FadeIn>
        </div>
    );
}
