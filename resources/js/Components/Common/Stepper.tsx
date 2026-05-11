import { BuilderStep } from "@/types/surveyBuilder";
import { Check } from "lucide-react";

interface Step {
    id: BuilderStep;
    label: string;
    description: string;
}

const steps: Step[] = [
    {
        id: "info",
        label: "Informations",
        description: "Détails de base",
    },
    {
        id: "builder",
        label: "Construction",
        description: "Questions et thèmes",
    },
    {
        id: "preview",
        label: "Aperçu",
        description: "Vérification finale",
    },
];

interface StepperProps {
    currentStep: BuilderStep;
    onStepClick?: (step: BuilderStep) => void;
}

export default function Stepper({ currentStep, onStepClick }: StepperProps) {
    const currentIndex = steps.findIndex((s) => s.id === currentStep);

    return (
        <div className="w-full py-4">
            <div className="flex items-center justify-between relative">
                {/* Progress line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10 hidden sm:block">
                    <div
                        className="h-full bg-elan-orange transition-all duration-500"
                        style={{
                            width: `${
                                (currentIndex / (steps.length - 1)) * 100
                            }%`,
                        }}
                    />
                </div>

                {steps.map((step, index) => {
                    const isActive = step.id === currentStep;
                    const isCompleted = index < currentIndex;
                    const isClickable = index <= currentIndex && onStepClick;

                    return (
                        <button
                            key={step.id}
                            onClick={() => isClickable && onStepClick(step.id)}
                            disabled={!isClickable}
                            className={`flex flex-col items-center gap-2 flex-1 group ${
                                isClickable
                                    ? "cursor-pointer"
                                    : "cursor-default"
                            }`}
                        >
                            {/* Circle */}
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                    isCompleted
                                        ? "bg-elan-orange text-white"
                                        : isActive
                                        ? "bg-elan-orange text-white ring-4 ring-elan-orange/20"
                                        : "bg-gray-200 text-gray-500"
                                } ${
                                    isClickable ? "group-hover:scale-110" : ""
                                }`}
                            >
                                {isCompleted ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <span className="text-sm font-semibold">
                                        {index + 1}
                                    </span>
                                )}
                            </div>

                            {/* Label */}
                            <div className="text-center hidden sm:block">
                                <p
                                    className={`text-sm font-medium ${
                                        isActive || isCompleted
                                            ? "text-gray-900"
                                            : "text-gray-500"
                                    }`}
                                >
                                    {step.label}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {step.description}
                                </p>
                            </div>

                            {/* Mobile label */}
                            <p className="text-xs font-medium text-gray-700 sm:hidden">
                                {step.label}
                            </p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
