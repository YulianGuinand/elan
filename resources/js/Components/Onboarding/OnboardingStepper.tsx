import {
    BookOpen,
    Building,
    ChevronDown,
    ChevronRight,
    File,
    GraduationCap,
    User,
    X,
} from "lucide-react";
import { ReactElement, useEffect, useState } from "react";

interface Step {
    id: string;
    title: string;
    description: string;
    action: string;
    href: string;
    icon: ReactElement;
}

const steps: Step[] = [
    {
        id: "formation",
        title: "1. Créer une formation",
        description: "Commencez par ajouter vos premières formations",
        action: "Créer",
        href: "/formations/ajouter",
        icon: <BookOpen className="size-4" />,
    },
    {
        id: "entreprise",
        title: "2. Ajouter une entreprise",
        description: "Enregistrez vos partenaires entreprises",
        action: "Ajouter",
        href: "/entreprises",
        icon: <Building className="size-4" />,
    },
    {
        id: "ecole",
        title: "3. Inscrire une école",
        description: "Complétez les informations de votre centre",
        action: "Inscrire",
        href: "/ecoles/ajouter",
        icon: <GraduationCap className="size-4" />,
    },
    {
        id: "participant",
        title: "4. Ajouter un participant",
        description: "Importez ou créez vos premiers participants",
        action: "Ajouter",
        href: "/participants/ajouter",
        icon: <User className="size-4" />,
    },
    {
        id: "enquete",
        title: "5. Créer une enquête",
        description: "Lancez votre première enquête d'insertion",
        action: "Créer",
        href: "/enquetes/creer",
        icon: <File className="size-4" />,
    },
];

export default function OnboardingStepper() {
    const [completedSteps, setCompletedSteps] = useState<Set<string>>(
        new Set(),
    );
    const [isVisible, setIsVisible] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    // Charger l'état depuis localStorage au montage
    useEffect(() => {
        const saved = localStorage.getItem("onboarding_completed");
        const savedCurrentStep = localStorage.getItem(
            "onboarding_current_step",
        );
        const savedMinimized = localStorage.getItem("onboarding_minimized");
        const savedDismissed = localStorage.getItem("onboarding_dismissed");

        // Si l'utilisateur a dismissé le stepper, ne pas l'afficher
        if (savedDismissed === "true") {
            setIsVisible(false);
            return;
        }

        if (saved) {
            setCompletedSteps(new Set(JSON.parse(saved)));
        }

        if (savedCurrentStep) {
            setCurrentStepIndex(parseInt(savedCurrentStep, 10));
        }

        if (savedMinimized === "true") {
            setIsMinimized(true);
        }
    }, []);

    // Vérifier si une étape est complétée basée sur la route
    useEffect(() => {
        const currentPath = window.location.pathname;

        // Détection améliorée incluant les prévisualisateurs et imports
        steps.forEach((step) => {
            let isCompleted = false;

            if (step.id === "formation") {
                isCompleted =
                    currentPath.includes("/formations/ajouter") ||
                    currentPath.includes("/formations/preview") ||
                    currentPath.includes("/formations/import");
            } else if (step.id === "entreprise") {
                isCompleted =
                    currentPath.includes("/entreprises") ||
                    currentPath.includes("/entreprises/preview") ||
                    currentPath.includes("/entreprises/import");
            } else if (step.id === "ecole") {
                isCompleted =
                    currentPath.includes("/ecoles/ajouter") ||
                    currentPath.includes("/ecoles/preview") ||
                    currentPath.includes("/ecoles/import");
            } else if (step.id === "participant") {
                isCompleted =
                    currentPath.includes("/participants/ajouter") ||
                    currentPath.includes("/participants/preview") ||
                    currentPath.includes("/participants/import");
            } else if (step.id === "enquete") {
                isCompleted =
                    currentPath.includes("/enquetes/creer") ||
                    currentPath.includes("/enquetes/preview");
            }

            if (isCompleted) {
                setCompletedSteps((prev) => {
                    const updated = new Set(prev);
                    updated.add(step.id);
                    localStorage.setItem(
                        "onboarding_completed",
                        JSON.stringify(Array.from(updated)),
                    );
                    return updated;
                });
            }
        });

        // Si on est dans une page d'import/preview de participants,
        // marquer les étapes précédentes comme complétées
        if (
            currentPath.includes("/participants/preview") ||
            currentPath.includes("/participants/import")
        ) {
            setCompletedSteps((prev) => {
                const updated = new Set(prev);
                // Marquer formation, entreprise et école comme complétées
                updated.add("formation");
                updated.add("entreprise");
                updated.add("ecole");
                updated.add("participant");

                const prevStr = Array.from(prev).sort().join(",");
                const updatedStr = Array.from(updated).sort().join(",");

                if (prevStr !== updatedStr) {
                    localStorage.setItem(
                        "onboarding_completed",
                        JSON.stringify(Array.from(updated)),
                    );
                }
                return updated;
            });
        }
    }, []);

    // Avancer automatiquement au prochain pas non complété
    useEffect(() => {
        const nextIncomplete = steps.findIndex(
            (step) => !completedSteps.has(step.id),
        );
        if (nextIncomplete !== -1) {
            setCurrentStepIndex(nextIncomplete);
            localStorage.setItem(
                "onboarding_current_step",
                nextIncomplete.toString(),
            );
        }
    }, [completedSteps]);

    // Masquer si tous les steps sont complétés
    useEffect(() => {
        if (completedSteps.size === steps.length) {
            setIsVisible(false);
        }
    }, [completedSteps]);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem("onboarding_dismissed", "true");
    };

    const handleMinimize = () => {
        setIsMinimized(!isMinimized);
        localStorage.setItem("onboarding_minimized", (!isMinimized).toString());
    };

    const handleSkip = () => {
        // Marquer tous les steps comme complétés
        setCompletedSteps(new Set(steps.map((s) => s.id)));
        localStorage.setItem(
            "onboarding_completed",
            JSON.stringify(steps.map((s) => s.id)),
        );
        setIsVisible(false);
    };

    if (!isVisible || completedSteps.size === steps.length) {
        return null;
    }

    const currentStep = steps[currentStepIndex];
    const progress = Math.round(
        ((completedSteps.size + 1) / steps.length) * 100,
    );

    // Version minimisée
    if (isMinimized) {
        return (
            <div className="fixed bottom-6 right-6 z-40">
                <button
                    onClick={handleMinimize}
                    className="flex items-center justify-center w-14 h-14 rounded-full bg-elan-orange text-white shadow-lg hover:shadow-xl transition-all hover:scale-110"
                    title="Afficher le tutoriel"
                >
                    <ChevronDown className="w-6 h-6" />
                </button>
            </div>
        );
    }
    // Version complète
    return (
        <div className="fixed bottom-6 right-6 z-40 max-w-sm">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-elan-orange px-6 py-4 text-white">
                    <div className="flex justify-between items-start gap-3 mb-3">
                        <div>
                            <h3 className="font-bold text-lg">
                                Bienvenue ! 👋
                            </h3>
                            <p className="text-orange-100 text-sm mt-1">
                                Étape {currentStepIndex + 1} sur {steps.length}
                            </p>
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={handleMinimize}
                                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                                title="Minimiser"
                            >
                                <ChevronDown className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                                title="Fermer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-5">
                    {/* Current step */}
                    <div className="mb-5">
                        <p className="text-2xl mb-2">{currentStep.icon}</p>
                        <h4 className="font-bold text-gray-900 text-lg mb-2">
                            {currentStep.title}
                        </h4>
                        <p className="text-gray-600 text-sm">
                            {currentStep.description}
                        </p>
                    </div>

                    {/* Steps preview */}
                    <div className="space-y-2 mb-5 py-4 border-t border-b border-gray-200">
                        {steps.map((step, idx) => (
                            <div
                                key={step.id}
                                className={`flex items-center gap-2 text-sm ${
                                    idx === currentStepIndex
                                        ? "font-semibold text-orange-600"
                                        : completedSteps.has(step.id)
                                          ? "text-gray-500 line-through"
                                          : "text-gray-400"
                                }`}
                            >
                                <span className="text-lg">{step.icon}</span>
                                <span className="flex-1">{step.title}</span>
                                {completedSteps.has(step.id) && (
                                    <span className="text-green-600">✓</span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <a
                            href={currentStep.href}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-elan-orange text-white rounded-lg hover:bg-orange-500 transition-colors font-semibold text-sm"
                        >
                            {currentStep.action}
                            <ChevronRight className="size-4" />
                        </a>
                        <button
                            onClick={handleSkip}
                            className="px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                            title="Passer le tutoriel"
                        >
                            Passer
                        </button>
                    </div>

                    {/* Tip */}
                    <p className="text-xs text-gray-500 mt-3 text-center">
                        Vous pouvez reprendre ce tutoriel à tout moment.
                    </p>
                </div>
            </div>
        </div>
    );
}
