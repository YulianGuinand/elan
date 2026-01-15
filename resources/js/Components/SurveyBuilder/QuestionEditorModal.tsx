import Card from "@/Components/Common/Card";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { getQuestionTypeLabel } from "@/constants/questionTypes";
import { useSurveyBuilder } from "@/contexts/SurveyBuilderContext";
import { Question } from "@/types/surveyBuilder";
import { Plus, Trash2, X } from "lucide-react";
import { nanoid } from "nanoid";
import { useState } from "react";
import { createPortal } from "react-dom";

interface QuestionEditorModalProps {
    question: Question;
    themeId: string;
    onClose: () => void;
}

export default function QuestionEditorModal({
    question,
    themeId,
    onClose,
}: QuestionEditorModalProps) {
    const { updateQuestion } = useSurveyBuilder();
    const [editedQuestion, setEditedQuestion] = useState<Question>({
        ...question,
    });

    const handleSave = () => {
        updateQuestion(themeId, question.id, editedQuestion);
        onClose();
    };

    const handleAddOption = () => {
        const newOptions = [
            ...(editedQuestion.options || []),
            {
                id: nanoid(),
                label: `Option ${(editedQuestion.options?.length || 0) + 1}`,
                value: `option${(editedQuestion.options?.length || 0) + 1}`,
            },
        ];
        setEditedQuestion({ ...editedQuestion, options: newOptions });
    };

    const handleUpdateOption = (optionId: string, label: string) => {
        const newOptions = editedQuestion.options?.map((opt) =>
            opt.id === optionId
                ? {
                      ...opt,
                      label,
                      value: label.toLowerCase().replace(/\s+/g, "_"),
                  }
                : opt
        );
        setEditedQuestion({ ...editedQuestion, options: newOptions });
    };

    const handleDeleteOption = (optionId: string) => {
        const newOptions = editedQuestion.options?.filter(
            (opt) => opt.id !== optionId
        );
        setEditedQuestion({ ...editedQuestion, options: newOptions });
    };

    const needsOptions = ["radio", "checkbox", "select"].includes(
        editedQuestion.type
    );
    const needsScale = editedQuestion.type === "likert";

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 animate-fadeIn"
            style={{ position: "fixed", zIndex: 9999 }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp relative"
                style={{ zIndex: 10000 }}
                onClick={(e) => e.stopPropagation()}
            >
                <Card>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Éditer la question
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Type :{" "}
                                {getQuestionTypeLabel(editedQuestion.type)}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Form */}
                    <div className="space-y-4">
                        {/* Label */}
                        <div>
                            <InputLabel
                                htmlFor="question-label"
                                value="Question *"
                            />
                            <TextInput
                                id="question-label"
                                type="text"
                                value={editedQuestion.label}
                                onChange={(e) =>
                                    setEditedQuestion({
                                        ...editedQuestion,
                                        label: e.target.value,
                                    })
                                }
                                className="mt-1 block w-full"
                                placeholder="Posez votre question..."
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <InputLabel
                                htmlFor="question-description"
                                value="Description (optionnel)"
                            />
                            <textarea
                                id="question-description"
                                value={editedQuestion.description || ""}
                                onChange={(e) =>
                                    setEditedQuestion({
                                        ...editedQuestion,
                                        description: e.target.value,
                                    })
                                }
                                rows={2}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-elan-orange focus:ring-elan-orange"
                                placeholder="Ajoutez des précisions..."
                            />
                        </div>

                        {/* Placeholder */}
                        {["text", "textarea", "select"].includes(
                            editedQuestion.type
                        ) && (
                            <div>
                                <InputLabel
                                    htmlFor="question-placeholder"
                                    value="Placeholder"
                                />
                                <TextInput
                                    id="question-placeholder"
                                    type="text"
                                    value={editedQuestion.placeholder || ""}
                                    onChange={(e) =>
                                        setEditedQuestion({
                                            ...editedQuestion,
                                            placeholder: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full"
                                    placeholder="Texte d'aide..."
                                />
                            </div>
                        )}

                        {/* Required toggle */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="question-required"
                                checked={editedQuestion.required}
                                onChange={(e) =>
                                    setEditedQuestion({
                                        ...editedQuestion,
                                        required: e.target.checked,
                                    })
                                }
                                className="w-4 h-4 text-elan-orange focus:ring-elan-orange rounded"
                            />
                            <label
                                htmlFor="question-required"
                                className="text-sm font-medium text-gray-700"
                            >
                                Réponse obligatoire
                            </label>
                        </div>

                        {/* Options for radio, checkbox, select */}
                        {needsOptions && (
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <InputLabel value="Options" />
                                    <button
                                        onClick={handleAddOption}
                                        className="text-sm text-elan-orange hover:text-elan-orange/80 font-medium inline-flex items-center gap-1"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Ajouter
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {editedQuestion.options?.map(
                                        (option, index) => (
                                            <div
                                                key={option.id}
                                                className="flex items-center gap-2"
                                            >
                                                <span className="text-sm text-gray-500 w-6">
                                                    {index + 1}.
                                                </span>
                                                <TextInput
                                                    type="text"
                                                    value={option.label}
                                                    onChange={(e) =>
                                                        handleUpdateOption(
                                                            option.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="flex-1"
                                                    placeholder={`Option ${
                                                        index + 1
                                                    }`}
                                                />
                                                {(editedQuestion.options
                                                    ?.length || 0) > 2 && (
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteOption(
                                                                option.id
                                                            )
                                                        }
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Scale for Likert */}
                        {needsScale && (
                            <div className="space-y-3">
                                <InputLabel value="Échelle de Likert" />
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-600">
                                            Minimum
                                        </label>
                                        <TextInput
                                            type="number"
                                            value={
                                                editedQuestion.scale?.min || 1
                                            }
                                            onChange={(e) =>
                                                setEditedQuestion({
                                                    ...editedQuestion,
                                                    scale: {
                                                        ...editedQuestion.scale!,
                                                        min: parseInt(
                                                            e.target.value
                                                        ),
                                                    },
                                                })
                                            }
                                            className="mt-1 block w-full"
                                            min="1"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-600">
                                            Maximum
                                        </label>
                                        <TextInput
                                            type="number"
                                            value={
                                                editedQuestion.scale?.max || 5
                                            }
                                            onChange={(e) =>
                                                setEditedQuestion({
                                                    ...editedQuestion,
                                                    scale: {
                                                        ...editedQuestion.scale!,
                                                        max: parseInt(
                                                            e.target.value
                                                        ),
                                                    },
                                                })
                                            }
                                            className="mt-1 block w-full"
                                            min="2"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-600">
                                            Label minimum
                                        </label>
                                        <TextInput
                                            type="text"
                                            value={
                                                editedQuestion.scale
                                                    ?.minLabel || ""
                                            }
                                            onChange={(e) =>
                                                setEditedQuestion({
                                                    ...editedQuestion,
                                                    scale: {
                                                        ...editedQuestion.scale!,
                                                        minLabel:
                                                            e.target.value,
                                                    },
                                                })
                                            }
                                            className="mt-1 block w-full"
                                            placeholder="Ex: Pas du tout d'accord"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-600">
                                            Label maximum
                                        </label>
                                        <TextInput
                                            type="text"
                                            value={
                                                editedQuestion.scale
                                                    ?.maxLabel || ""
                                            }
                                            onChange={(e) =>
                                                setEditedQuestion({
                                                    ...editedQuestion,
                                                    scale: {
                                                        ...editedQuestion.scale!,
                                                        maxLabel:
                                                            e.target.value,
                                                    },
                                                })
                                            }
                                            className="mt-1 block w-full"
                                            placeholder="Ex: Tout à fait d'accord"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Number validation */}
                        {editedQuestion.type === "number" && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value="Minimum" />
                                    <TextInput
                                        type="number"
                                        value={
                                            editedQuestion.validation?.min ?? ""
                                        }
                                        onChange={(e) =>
                                            setEditedQuestion({
                                                ...editedQuestion,
                                                validation: {
                                                    ...editedQuestion.validation,
                                                    min: e.target.value
                                                        ? parseInt(
                                                              e.target.value
                                                          )
                                                        : undefined,
                                                },
                                            })
                                        }
                                        className="mt-1 block w-full"
                                    />
                                </div>
                                <div>
                                    <InputLabel value="Maximum" />
                                    <TextInput
                                        type="number"
                                        value={
                                            editedQuestion.validation?.max ?? ""
                                        }
                                        onChange={(e) =>
                                            setEditedQuestion({
                                                ...editedQuestion,
                                                validation: {
                                                    ...editedQuestion.validation,
                                                    max: e.target.value
                                                        ? parseInt(
                                                              e.target.value
                                                          )
                                                        : undefined,
                                                },
                                            })
                                        }
                                        className="mt-1 block w-full"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                        >
                            Annuler
                        </button>
                        <PrimaryButton onClick={handleSave}>
                            Enregistrer les modifications
                        </PrimaryButton>
                    </div>
                </Card>
            </div>
        </div>,
        document.body
    );
}
