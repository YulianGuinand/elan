import { RotateCcw } from "lucide-react";
import { useState } from "react";

export default function OnboardingReset() {
    const [hasReset, setHasReset] = useState(false);

    const handleReset = () => {
        // Réinitialiser tous les states du tutoriel
        localStorage.removeItem("onboarding_completed");
        localStorage.removeItem("onboarding_current_step");
        localStorage.removeItem("onboarding_dismissed");
        localStorage.removeItem("onboarding_minimized");
        setHasReset(true);

        // Recharger la page pour montrer le stepper
        setTimeout(() => {
            window.location.reload();
        }, 500);
    };

    return (
        <div>
            <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
            >
                <RotateCcw className="w-4 h-4" />
                Réinitialiser le tutoriel
            </button>
            {hasReset && (
                <p className="text-xs text-green-600 mt-2">
                    Tutoriel réinitialisé ! Rechargement en cours...
                </p>
            )}
        </div>
    );
}
