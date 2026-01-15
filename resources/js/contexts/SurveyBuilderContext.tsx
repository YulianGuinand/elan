import {
    BuilderStep,
    Question,
    SurveyBasicInfo,
    SurveyBuilderState,
    SurveyDraft,
    Theme,
} from "@/types/surveyBuilder";
import { nanoid } from "nanoid";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

const STORAGE_KEY = "survey-builder-draft";

interface SurveyBuilderContextType {
    state: SurveyBuilderState;

    // Navigation
    setStep: (step: BuilderStep) => void;

    // Basic Info
    updateBasicInfo: (info: Partial<SurveyBasicInfo>) => void;

    // Themes
    addTheme: () => void;
    updateTheme: (themeId: string, updates: Partial<Theme>) => void;
    deleteTheme: (themeId: string) => void;
    reorderThemes: (themeIds: string[]) => void;

    // Questions
    addQuestion: (themeId: string, question: Partial<Question>) => void;
    updateQuestion: (
        themeId: string,
        questionId: string,
        updates: Partial<Question>
    ) => void;
    deleteQuestion: (themeId: string, questionId: string) => void;
    reorderQuestions: (themeId: string, questionIds: string[]) => void;
    moveQuestion: (
        questionId: string,
        fromThemeId: string,
        toThemeId: string,
        toIndex: number
    ) => void;

    // Draft management
    saveDraft: () => void;
    loadDraft: () => void;
    clearDraft: () => void;
    exportSurvey: () => SurveyDraft;
}

const SurveyBuilderContext = createContext<
    SurveyBuilderContextType | undefined
>(undefined);

const initialState: SurveyBuilderState = {
    currentStep: "info",
    basicInfo: {
        title: "",
        description: "",
        audience: [],
        startDate: "",
        endDate: "",
    },
    themes: [],
    isDirty: false,
};

export function SurveyBuilderProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<SurveyBuilderState>(initialState);

    // Auto-save to localStorage
    useEffect(() => {
        if (state.isDirty) {
            const timeoutId = setTimeout(() => {
                saveDraft();
            }, 2000); // Debounce 2s

            return () => clearTimeout(timeoutId);
        }
    }, [state]);

    // Load draft on mount
    useEffect(() => {
        loadDraft();
    }, []);

    const setStep = (step: BuilderStep) => {
        setState((prev) => ({ ...prev, currentStep: step }));
    };

    const updateBasicInfo = (info: Partial<SurveyBasicInfo>) => {
        setState((prev) => ({
            ...prev,
            basicInfo: { ...prev.basicInfo, ...info },
            isDirty: true,
        }));
    };

    const addTheme = () => {
        const newTheme: Theme = {
            id: nanoid(),
            title: `Thème ${state.themes.length + 1}`,
            description: "",
            questions: [],
            order: state.themes.length,
        };

        setState((prev) => ({
            ...prev,
            themes: [...prev.themes, newTheme],
            isDirty: true,
        }));
    };

    const updateTheme = (themeId: string, updates: Partial<Theme>) => {
        setState((prev) => ({
            ...prev,
            themes: prev.themes.map((theme) =>
                theme.id === themeId ? { ...theme, ...updates } : theme
            ),
            isDirty: true,
        }));
    };

    const deleteTheme = (themeId: string) => {
        setState((prev) => ({
            ...prev,
            themes: prev.themes.filter((theme) => theme.id !== themeId),
            isDirty: true,
        }));
    };

    const reorderThemes = (themeIds: string[]) => {
        setState((prev) => ({
            ...prev,
            themes: themeIds.map((id, index) => {
                const theme = prev.themes.find((t) => t.id === id)!;
                return { ...theme, order: index };
            }),
            isDirty: true,
        }));
    };

    const addQuestion = (themeId: string, question: Partial<Question>) => {
        const theme = state.themes.find((t) => t.id === themeId);
        if (!theme) return;

        // Remove id and order from question to avoid conflicts
        const { id: _, order: __, ...questionConfig } = question as Question;

        const newQuestion: Question = {
            ...questionConfig, // Spread question config first
            // Apply defaults only if not already set
            type: questionConfig.type ?? "text",
            label: questionConfig.label ?? "",
            required: questionConfig.required ?? false,
            // Always override these
            id: nanoid(),
            order: theme.questions.length,
        } as Question;

        setState((prev) => ({
            ...prev,
            themes: prev.themes.map((t) =>
                t.id === themeId
                    ? { ...t, questions: [...t.questions, newQuestion] }
                    : t
            ),
            isDirty: true,
        }));
    };

    const updateQuestion = (
        themeId: string,
        questionId: string,
        updates: Partial<Question>
    ) => {
        setState((prev) => ({
            ...prev,
            themes: prev.themes.map((theme) =>
                theme.id === themeId
                    ? {
                          ...theme,
                          questions: theme.questions.map((q) =>
                              q.id === questionId ? { ...q, ...updates } : q
                          ),
                      }
                    : theme
            ),
            isDirty: true,
        }));
    };

    const deleteQuestion = (themeId: string, questionId: string) => {
        setState((prev) => ({
            ...prev,
            themes: prev.themes.map((theme) =>
                theme.id === themeId
                    ? {
                          ...theme,
                          questions: theme.questions.filter(
                              (q) => q.id !== questionId
                          ),
                      }
                    : theme
            ),
            isDirty: true,
        }));
    };

    const reorderQuestions = (themeId: string, questionIds: string[]) => {
        setState((prev) => ({
            ...prev,
            themes: prev.themes.map((theme) =>
                theme.id === themeId
                    ? {
                          ...theme,
                          questions: questionIds.map((id, index) => {
                              const question = theme.questions.find(
                                  (q) => q.id === id
                              )!;
                              return { ...question, order: index };
                          }),
                      }
                    : theme
            ),
            isDirty: true,
        }));
    };

    const moveQuestion = (
        questionId: string,
        fromThemeId: string,
        toThemeId: string,
        toIndex: number
    ) => {
        const fromTheme = state.themes.find((t) => t.id === fromThemeId);
        const question = fromTheme?.questions.find((q) => q.id === questionId);

        if (!question) return;

        setState((prev) => {
            // Remove from source
            const themes = prev.themes.map((theme) =>
                theme.id === fromThemeId
                    ? {
                          ...theme,
                          questions: theme.questions.filter(
                              (q) => q.id !== questionId
                          ),
                      }
                    : theme
            );

            // Add to destination
            return {
                ...prev,
                themes: themes.map((theme) =>
                    theme.id === toThemeId
                        ? {
                              ...theme,
                              questions: [
                                  ...theme.questions.slice(0, toIndex),
                                  { ...question, order: toIndex },
                                  ...theme.questions.slice(toIndex),
                              ],
                          }
                        : theme
                ),
                isDirty: true,
            };
        });
    };

    const saveDraft = () => {
        const draft: SurveyDraft = {
            id: nanoid(),
            basicInfo: state.basicInfo,
            themes: state.themes,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
        setState((prev) => ({ ...prev, isDirty: false }));
    };

    const loadDraft = () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const draft: SurveyDraft = JSON.parse(stored);
                setState((prev) => ({
                    ...prev,
                    basicInfo: draft.basicInfo,
                    themes: draft.themes,
                    isDirty: false,
                }));
            } catch (error) {
                console.error("Failed to load draft:", error);
            }
        }
    };

    const clearDraft = () => {
        localStorage.removeItem(STORAGE_KEY);
        setState(initialState);
    };

    const exportSurvey = (): SurveyDraft => {
        return {
            id: nanoid(),
            basicInfo: state.basicInfo,
            themes: state.themes,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    };

    return (
        <SurveyBuilderContext.Provider
            value={{
                state,
                setStep,
                updateBasicInfo,
                addTheme,
                updateTheme,
                deleteTheme,
                reorderThemes,
                addQuestion,
                updateQuestion,
                deleteQuestion,
                reorderQuestions,
                moveQuestion,
                saveDraft,
                loadDraft,
                clearDraft,
                exportSurvey,
            }}
        >
            {children}
        </SurveyBuilderContext.Provider>
    );
}

export function useSurveyBuilder() {
    const context = useContext(SurveyBuilderContext);
    if (!context) {
        throw new Error(
            "useSurveyBuilder must be used within SurveyBuilderProvider"
        );
    }
    return context;
}
