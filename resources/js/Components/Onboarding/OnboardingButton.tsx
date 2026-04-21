import { HelpCircle } from "lucide-react";

export default function OnboardingButton() {
    const handleShowStepper = () => {
        localStorage.setItem("onboarding_minimized", "false");
        window.location.reload();
    };

    return (
        <button
            onClick={handleShowStepper}
            className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all hover:scale-110"
            title="Afficher le tutoriel"
        >
            <HelpCircle className="w-6 h-6" />
        </button>
    );
}
