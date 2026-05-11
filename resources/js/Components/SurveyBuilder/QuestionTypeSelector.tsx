import { QUESTION_TYPES } from "@/constants/questionTypes";
import { QuestionType } from "@/types/surveyBuilder";
import {
    AlignLeft,
    BarChart3,
    Calendar,
    CheckSquare,
    ChevronDown,
    Circle,
    Hash,
    LucideIcon,
    Type,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
    Type,
    AlignLeft,
    Circle,
    CheckSquare,
    ChevronDown,
    Hash,
    BarChart3,
    Calendar,
};

interface QuestionTypeSelectorProps {
    onSelect: (type: QuestionType) => void;
}

export default function QuestionTypeSelector({
    onSelect,
}: QuestionTypeSelectorProps) {
    return (
        <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Ajouter une question
            </h4>

            <div className="grid grid-cols-1 gap-2">
                {QUESTION_TYPES.map((config) => {
                    const Icon = iconMap[config.icon];

                    return (
                        <button
                            key={config.type}
                            onClick={() => onSelect(config.type)}
                            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:border-elan-orange hover:bg-elan-orange/5 transition-all text-left group"
                        >
                            <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-elan-orange group-hover:text-white transition-colors">
                                <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-elan-orange transition-colors">
                                {config.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
