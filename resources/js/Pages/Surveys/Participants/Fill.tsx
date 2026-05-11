import Card from "@/Components/Common/Card";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import {
    CheckboxInput,
    DateInput,
    LikertInput,
    NumberInput,
    RadioInput,
    SelectInput,
    TextAreaInput,
    TextInput,
} from "@/Components/Survey/Fill/QuestionInputs";
import { Survey } from "@/types/surveys";
import { Head, useForm } from "@inertiajs/react";
import { AnimatePresence, motion } from "framer-motion";
import {
    CheckSquare2Icon,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Send,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface Props {
    nom: string;
    prenom: string;
    telephone: string;
    mail: string;
    enquete: Survey;
    jeton: string;
}

export default function Fill({ nom, prenom, enquete, jeton }: Props) {
    console.log(enquete);
    const [step, setStep] = useState<"intro" | "questions" | "completed">(
        "intro",
    );
    const [currentStep, setCurrentStep] = useState(0);

    const { data, setData, post, processing } = useForm({
        reponses: [] as { question_id: number; valeur: any }[],
    });

    useEffect(() => {
        if (enquete.themes) {
            const initialReponses = enquete.themes
                .flatMap((t) => t.questions)
                .map((q) => {
                    let val: any = "";
                    if (q.type_reponse === "checkbox") val = [];
                    // Pour Likert, pas d'initialisation (reste vide) - sera l'ID du choix quand sélectionné
                    return {
                        question_id: q.id,
                        valeur: val,
                    };
                });
            setData("reponses", initialReponses);
        }
    }, [enquete]);

    const handleValueChange = (questionId: number, value: any) => {
        const newReponses = [...data.reponses];
        const index = newReponses.findIndex(
            (r) => r.question_id === questionId,
        );
        if (index !== -1) {
            newReponses[index].valeur = value;
            setData("reponses", newReponses);
        }
    };

    const nextStep = () => {
        if (enquete.themes && currentStep < enquete.themes.length - 1) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("surveys.fill.submit.public", { jeton }));
    };

    if (step === "intro") {
        return (
            <div className="min-h-screen bg-white font-sans selection:bg-elan-orange/20">
                <Head title={`Bienvenue - ${enquete.titre}`} />

                <main className="max-w-2xl mx-auto px-6 py-12 sm:py-20 flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8 w-16 h-16 bg-elan-orange/10 rounded-lg flex items-center justify-center text-elan-orange"
                    >
                        <CheckSquare2Icon className="w-8 h-8" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center mb-4"
                    >
                        {enquete.titre}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-600 text-center text-lg mb-12 sm:mb-16 max-w-lg"
                    >
                        Bonjour{" "}
                        <span className="font-bold text-gray-900">
                            {prenom} {nom}
                        </span>
                        , votre avis est précieux pour nous aider à améliorer
                        nos services.
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="w-full space-y-4 mb-12"
                    >
                        <Card className="p-6 bg-gray-50 rounded-lg border">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Send className="w-4 h-4 text-elan-orange" />
                                Informations importantes
                            </h3>
                            <ul className="space-y-4 text-sm text-gray-600">
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-elan-orange mt-1.5 shrink-0" />
                                    <span>
                                        L'enquête prendra environ{" "}
                                        <span className="font-bold text-gray-800">
                                            1 à 3 minutes
                                        </span>
                                        .
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-elan-orange mt-1.5 shrink-0" />
                                    <span>
                                        Vos réponses sont{" "}
                                        <span className="font-bold text-gray-800">
                                            strictement confidentielles.
                                        </span>{" "}
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-elan-orange mt-1.5 shrink-0" />
                                    <span>
                                        Conformément au{" "}
                                        <span className="font-bold text-elan-blue underline cursor-help">
                                            RGPD
                                        </span>
                                        , vous disposez d'un droit d'accès et de
                                        rectification de vos données.
                                    </span>
                                </li>
                            </ul>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="w-full sm:w-auto"
                    >
                        <PrimaryButton
                            onClick={() => setStep("questions")}
                            className="w-full sm:w-64 h-14 text-lg font-bold flex items-center justify-center"
                        >
                            Démarrer l&apos;enquête
                        </PrimaryButton>
                    </motion.div>
                </main>
            </div>
        );
    }

    if (!enquete.themes || enquete.themes.length === 0) {
        return (
            <div className="p-8 text-center">Chargement de l'enquête...</div>
        );
    }

    const currentTheme = enquete.themes[currentStep];
    const progress = ((currentStep + 1) / enquete.themes.length) * 100;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-elan-orange/20">
            <Head title={`Répondre à ${enquete.titre}`} />

            {/* Header / Progress Bar */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-3xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-elan-orange/10 rounded-lg flex items-center justify-center">
                                <span className="text-elan-orange font-bold">
                                    {currentStep + 1}
                                </span>
                            </div>
                            <div>
                                <h1 className="font-bold text-gray-900 line-clamp-1">
                                    {enquete.titre}
                                </h1>
                                <p className="text-xs text-gray-500 font-medium">
                                    {prenom} {nom}
                                </p>
                            </div>
                        </div>
                        <div className="hidden sm:block text-xs font-bold uppercase tracking-widest text-elan-orange">
                            {currentStep + 1} / {enquete.themes.length} themes
                        </div>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-elan-orange"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>
            </header>

            <main className="flex-grow max-w-3xl w-full mx-auto px-4 py-8 sm:py-12">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="mb-8">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
                                {currentTheme.libelle}
                            </h2>
                            {currentStep === 0 && enquete.description && (
                                <p className="text-gray-500">
                                    {enquete.description}
                                </p>
                            )}
                        </div>

                        <div className="space-y-8 sm:space-y-10">
                            {currentTheme.questions.map((question) => (
                                <Card key={question.id}>
                                    <div className="p-2">
                                        <div className="flex flex-col sm:flex-row gap-5">
                                            <div className="flex flex-row items-center gap-4">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-elan-blue/10 flex items-center justify-center text-sm font-black text-elan-blue ring-4 ring-elan-blue/5">
                                                    {question.numero}
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                                    {question.libelle}
                                                </h3>
                                            </div>
                                            <div className="flex-grow space-y-6">
                                                <QuestionInput
                                                    question={question}
                                                    value={
                                                        data.reponses.find(
                                                            (r) =>
                                                                r.question_id ===
                                                                question.id,
                                                        )?.valeur
                                                    }
                                                    onChange={(val) =>
                                                        handleValueChange(
                                                            question.id,
                                                            val,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Footer Actions */}
            <footer className="bg-white border-t border-gray-200 p-4 pb-8 sm:pb-4 sticky bottom-0 mt-auto shadow-[0_-8px_30px_rgb(0,0,0,0.04)] sm:relative sm:shadow-none">
                <div className="max-w-3xl mx-auto flex justify-between gap-4">
                    <SecondaryButton
                        onClick={prevStep}
                        disabled={currentStep === 0 || processing}
                    >
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        Précédent
                    </SecondaryButton>

                    {currentStep < enquete.themes.length - 1 ? (
                        <PrimaryButton onClick={nextStep}>
                            Suivant
                            <ChevronRight className="w-5 h-5 ml-1" />
                        </PrimaryButton>
                    ) : (
                        <PrimaryButton
                            onClick={handleSubmit}
                            disabled={processing}
                        >
                            {processing ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-5 h-5 mr-2" />
                                    Terminer
                                </>
                            )}
                        </PrimaryButton>
                    )}
                </div>
            </footer>
        </div>
    );
}

function QuestionInput({
    question,
    value,
    onChange,
}: {
    question: any;
    value: any;
    onChange: (val: any) => void;
}) {
    switch (question.type_reponse) {
        case "text":
            return <TextInput value={value} onChange={onChange} />;

        case "textarea":
            return <TextAreaInput value={value} onChange={onChange} />;

        case "number":
            return <NumberInput value={value} onChange={onChange} />;

        case "date":
            return <DateInput value={value} onChange={onChange} />;

        case "select":
            return (
                <SelectInput
                    options={question.choix}
                    value={value}
                    onChange={onChange}
                />
            );

        case "radio":
            return (
                <RadioInput
                    options={question.choix}
                    value={value}
                    onChange={onChange}
                />
            );

        case "checkbox":
            return (
                <CheckboxInput
                    options={question.choix}
                    value={value}
                    onChange={onChange}
                />
            );

        case "likert":
            return (
                <LikertInput
                    options={question.choix}
                    value={value}
                    onChange={onChange}
                    likertStyle={question.likert_style}
                />
            );

        default:
            return (
                <p className="text-amber-600 bg-amber-50 p-4 rounded-xl border border-amber-100 italic flex items-center text-sm">
                    Le type de question "{question.type_reponse}" est en cours
                    d&apos;intégration.
                </p>
            );
    }
}
