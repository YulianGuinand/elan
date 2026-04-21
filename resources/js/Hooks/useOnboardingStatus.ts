import { useEffect, useState } from "react";

export function useOnboardingStatus() {
    const [completedSteps, setCompletedSteps] = useState<Set<string>>(
        new Set()
    );
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem("onboarding_completed");
        if (saved) {
            setCompletedSteps(new Set(JSON.parse(saved)));
        }
        setIsLoading(false);
    }, []);

    const markStepComplete = (stepId: string) => {
        setCompletedSteps((prev) => {
            const updated = new Set(prev);
            updated.add(stepId);
            localStorage.setItem(
                "onboarding_completed",
                JSON.stringify(Array.from(updated))
            );
            return updated;
        });
    };

    const isStepComplete = (stepId: string) => {
        return completedSteps.has(stepId);
    };

    const allStepsComplete = completedSteps.size === 5; // 5 steps total

    return {
        completedSteps,
        isLoading,
        markStepComplete,
        isStepComplete,
        allStepsComplete,
    };
}
