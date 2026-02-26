export type QuestionType =
    | "text"
    | "textarea"
    | "radio"
    | "checkbox"
    | "select"
    | "number"
    | "likert"
    | "date";

export interface QuestionOption {
    id: string;
    label: string;
    value: string;
}

export interface LikertScale {
    min: number;
    max: number;
    minLabel?: string;
    maxLabel?: string;
    midLabel?: string;
}

export interface QuestionValidation {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
}

export interface Question {
    id: string;
    type: QuestionType;
    label: string;
    description?: string;
    required: boolean;
    placeholder?: string;
    options?: QuestionOption[]; // Pour radio, checkbox, select
    scale?: LikertScale; // Pour Likert
    validation?: QuestionValidation;
    order: number;
}

export interface Theme {
    id: string;
    title: string;
    description?: string;
    questions: Question[];
    order: number;
}

export interface SurveyBasicInfo {
    title: string;
    description: string;
    audience: string[];
    startDate: string;
    endDate: string;
}

export interface SurveyDraft {
    id: string;
    basicInfo: SurveyBasicInfo;
    themes: Theme[];
    createdAt: string;
    updatedAt: string;
}

export type BuilderStep = "info" | "builder" | "preview";

export interface SurveyBuilderState {
    currentStep: BuilderStep;
    basicInfo: SurveyBasicInfo;
    themes: Theme[];
    isDirty: boolean;
}

export interface QuestionTypeConfig {
    type: QuestionType;
    label: string;
    icon: string; // Nom de l'icône lucide-react
    defaultConfig: Partial<Question>;
}
