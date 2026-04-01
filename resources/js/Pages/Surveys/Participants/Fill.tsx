import Card from "@/Components/Common/Card";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { Survey } from "@/types/surveys";
import { Head, useForm } from "@inertiajs/react";
import { AnimatePresence, motion } from "framer-motion";
import {
    CheckCircle2,
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
    const [currentStep, setCurrentStep] = useState(0);

    const { data, setData, post, processing } = useForm({
        reponses: [] as { question_id: number; valeur: any }[],
    });

    // Initialiser les réponses
    useEffect(() => {
        if (enquete.themes) {
            const initialReponses = enquete.themes
                .flatMap((t) => t.questions)
                .map((q) => ({
                    question_id: q.id,
                    valeur:
                        q.type_reponse === "Choix multiple"
                            ? []
                            : q.type_reponse === "Echelle"
                              ? 3
                              : "",
                }));
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

    if (!enquete.themes || enquete.themes.length === 0) {
        return (
            <div className="p-8 text-center">Chargement de l'enquête...</div>
        );
    }

    const currentTheme = enquete.themes[currentStep];
    const progress = ((currentStep + 1) / enquete.themes.length) * 100;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Head title={`Répondre à ${enquete.titre}`} />

            {/* Header / Progress Bar */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-3xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-elan-orange/10 rounded-xl flex items-center justify-center">
                                <span className="text-elan-orange font-bold">
                                    {currentStep + 1}
                                </span>
                            </div>
                            <div>
                                <h1 className="font-bold text-gray-900 line-clamp-1">
                                    {enquete.titre}
                                </h1>
                                <p className="text-sm text-gray-500">
                                    {prenom} {nom}
                                </p>
                            </div>
                        </div>
                        <div className="hidden sm:block text-sm font-medium text-elan-orange">
                            {currentStep + 1} / {enquete.themes.length} thèmes
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

            <main className="flex-grow max-w-3xl w-full mx-auto px-4 py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {currentTheme.libelle}
                            </h2>
                            {currentStep === 0 && enquete.description && (
                                <p className="text-gray-600 bg-white p-4 rounded-xl border border-gray-100 italic">
                                    {enquete.description}
                                </p>
                            )}
                        </div>

                        <div className="space-y-6">
                            {currentTheme.questions.map((question) => (
                                <Card
                                    key={question.id}
                                    className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="p-6">
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-elan-blue/5 border border-elan-blue/10 flex items-center justify-center text-sm font-bold text-elan-blue">
                                                {question.numero}
                                            </div>
                                            <div className="flex-grow space-y-5">
                                                <h3 className="text-lg font-semibold text-gray-800 leading-snug">
                                                    {question.libelle}
                                                </h3>

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
            <footer className="bg-white border-t border-gray-200 p-4 sticky bottom-0 mt-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="max-w-3xl mx-auto flex justify-between gap-4">
                    <SecondaryButton
                        onClick={prevStep}
                        disabled={currentStep === 0 || processing}
                        className="flex-1 justify-center sm:flex-none py-3"
                    >
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        Précédent
                    </SecondaryButton>

                    {currentStep < enquete.themes.length - 1 ? (
                        <PrimaryButton
                            onClick={nextStep}
                            className="flex-1 justify-center sm:flex-none py-3"
                        >
                            Suivant
                            <ChevronRight className="w-5 h-5 ml-1" />
                        </PrimaryButton>
                    ) : (
                        <PrimaryButton
                            onClick={handleSubmit}
                            disabled={processing}
                            className="flex-1 justify-center sm:flex-none py-3 bg-elan-green hover:bg-elan-green/90 border-none"
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
        case "Texte":
            return (
                <textarea
                    className="w-full rounded-xl border-gray-200 focus:border-elan-orange focus:ring-elan-orange/20 transition-all resize-none p-4"
                    rows={4}
                    placeholder="Saisissez votre réponse ici..."
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                />
            );

        case "Choix unique":
            return (
                <div className="grid gap-3">
                    {question.choix.map((c: any) => (
                        <label
                            key={c.id}
                            className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                value === c.libelle
                                    ? "border-elan-orange bg-elan-orange/5 ring-1 ring-elan-orange/10"
                                    : "border-gray-100 hover:border-gray-200 bg-white"
                            }`}
                        >
                            <input
                                type="radio"
                                className="hidden"
                                name={`q-${question.id}`}
                                value={c.libelle}
                                checked={value === c.libelle}
                                onChange={() => onChange(c.libelle)}
                            />
                            <div
                                className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center shrink-0 ${
                                    value === c.libelle
                                        ? "border-elan-orange"
                                        : "border-gray-300"
                                }`}
                            >
                                {value === c.libelle && (
                                    <div className="w-3 h-3 rounded-full bg-elan-orange" />
                                )}
                            </div>
                            <span
                                className={`font-medium ${value === c.libelle ? "text-elan-orange" : "text-gray-700"}`}
                            >
                                {c.libelle}
                            </span>
                        </label>
                    ))}
                </div>
            );

        case "Choix multiple":
            const toggleChoice = (libelle: string) => {
                const current = Array.isArray(value) ? value : [];
                if (current.includes(libelle)) {
                    onChange(current.filter((i) => i !== libelle));
                } else {
                    onChange([...current, libelle]);
                }
            };
            return (
                <div className="grid gap-3">
                    {question.choix.map((c: any) => (
                        <label
                            key={c.id}
                            className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                (value || []).includes(c.libelle)
                                    ? "border-elan-orange bg-elan-orange/5 ring-1 ring-elan-orange/10"
                                    : "border-gray-100 hover:border-gray-200 bg-white"
                            }`}
                        >
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={(value || []).includes(c.libelle)}
                                onChange={() => toggleChoice(c.libelle)}
                            />
                            <div
                                className={`w-6 h-6 rounded border-2 mr-4 flex items-center justify-center shrink-0 ${
                                    (value || []).includes(c.libelle)
                                        ? "border-elan-orange bg-elan-orange text-white"
                                        : "border-gray-200"
                                }`}
                            >
                                {(value || []).includes(c.libelle) && (
                                    <CheckCircle2 className="w-4 h-4" />
                                )}
                            </div>
                            <span
                                className={`font-medium ${(value || []).includes(c.libelle) ? "text-elan-orange" : "text-gray-700"}`}
                            >
                                {c.libelle}
                            </span>
                        </label>
                    ))}
                </div>
            );

        case "Echelle":
            return (
                <div className="space-y-10 pt-6 pb-2 px-2">
                    <div className="relative h-2 bg-gray-200 rounded-full">
                        <div
                            className="absolute top-0 left-0 h-full bg-elan-orange rounded-full transition-all duration-300"
                            style={{
                                width: `${(((value || 3) - 1) / 4) * 100}%`,
                            }}
                        />
                        <input
                            type="range"
                            min="1"
                            max="5"
                            step="1"
                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-20"
                            value={value || 3}
                            onChange={(e) => onChange(parseInt(e.target.value))}
                        />
                        <div className="absolute top-0 left-0 w-full flex justify-between">
                            {[1, 2, 3, 4, 5].map((val) => (
                                <div
                                    key={val}
                                    className="relative flex flex-col items-center"
                                >
                                    <div
                                        className={`w-4 h-4 rounded-full mt-[-4px] border-2 bg-white transition-all ${
                                            value >= val
                                                ? "border-elan-orange"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    <span
                                        className={`absolute -bottom-8 text-sm font-bold transition-all ${
                                            value === val
                                                ? "text-elan-orange scale-125"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        {val}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>Pas du tout</span>
                        <span>Tout à fait</span>
                    </div>
                </div>
            );

        default:
            return (
                <p className="text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100 italic flex items-center">
                    Type de question "{question.type_reponse}" en cours
                    d'intégration.
                </p>
            );
    }
}
