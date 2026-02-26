import { QuestionType, QuestionTypeConfig } from "@/types/surveyBuilder";
import {
    AlignLeft,
    BarChart3,
    Calendar,
    CheckSquare,
    ChevronDown,
    Circle,
    Hash,
    Type,
} from "lucide-react";

export const QUESTION_TYPES: QuestionTypeConfig[] = [
    {
        type: "text",
        label: "Texte court",
        icon: "Type",
        defaultConfig: {
            type: "text",
            label: "Nouvelle question",
            required: false,
            placeholder: "Votre réponse...",
            order: 0,
        },
    },
    {
        type: "textarea",
        label: "Texte long",
        icon: "AlignLeft",
        defaultConfig: {
            type: "textarea",
            label: "Nouvelle question",
            required: false,
            placeholder: "Votre réponse détaillée...",
            order: 0,
        },
    },
    {
        type: "radio",
        label: "Choix unique",
        icon: "Circle",
        defaultConfig: {
            type: "radio",
            label: "Nouvelle question",
            required: false,
            options: [
                { id: "1", label: "Option 1", value: "option1" },
                { id: "2", label: "Option 2", value: "option2" },
            ],
            order: 0,
        },
    },
    {
        type: "checkbox",
        label: "Choix multiple",
        icon: "CheckSquare",
        defaultConfig: {
            type: "checkbox",
            label: "Nouvelle question",
            required: false,
            options: [
                { id: "1", label: "Option 1", value: "option1" },
                { id: "2", label: "Option 2", value: "option2" },
            ],
            order: 0,
        },
    },
    {
        type: "select",
        label: "Liste déroulante",
        icon: "ChevronDown",
        defaultConfig: {
            type: "select",
            label: "Nouvelle question",
            required: false,
            placeholder: "Sélectionnez une option",
            options: [
                { id: "1", label: "Option 1", value: "option1" },
                { id: "2", label: "Option 2", value: "option2" },
            ],
            order: 0,
        },
    },
    {
        type: "number",
        label: "Nombre",
        icon: "Hash",
        defaultConfig: {
            type: "number",
            label: "Nouvelle question",
            required: false,
            placeholder: "0",
            validation: {
                min: 0,
                max: 100,
            },
            order: 0,
        },
    },
    {
        type: "likert",
        label: "Échelle de Likert",
        icon: "BarChart3",
        defaultConfig: {
            type: "likert",
            label: "Nouvelle question",
            required: false,
            scale: {
                min: 1,
                max: 5,
                minLabel: "Pas du tout d'accord",
                maxLabel: "Tout à fait d'accord",
            },
            order: 0,
        },
    },
    {
        type: "date",
        label: "Date",
        icon: "Calendar",
        defaultConfig: {
            type: "date",
            label: "Nouvelle question",
            required: false,
            order: 0,
        },
    },
];

// Helper pour obtenir l'icône d'un type
export const getQuestionIcon = (type: QuestionType) => {
    switch (type) {
        case "text":
            return Type;
        case "textarea":
            return AlignLeft;
        case "radio":
            return Circle;
        case "checkbox":
            return CheckSquare;
        case "select":
            return ChevronDown;
        case "number":
            return Hash;
        case "likert":
            return BarChart3;
        case "date":
            return Calendar;
    }
};

// Helper pour obtenir le label d'un type
export const getQuestionTypeLabel = (type: QuestionType): string => {
    const config = QUESTION_TYPES.find((t) => t.type === type);
    return config?.label || type;
};
