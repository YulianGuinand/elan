import Card, { CardHeader } from "@/Components/Common/Card";
import {
    getQuestionIcon,
    getQuestionTypeLabel,
} from "@/constants/questionTypes";
import { useSurveyBuilder } from "@/contexts/SurveyBuilderContext";
import { Question, Theme } from "@/types/surveyBuilder";
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit, GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import QuestionEditorModal from "./QuestionEditorModal";

interface ThemeSectionProps {
    theme: Theme;
    onAddQuestion: () => void;
    isDragging?: boolean;
}

export default function ThemeSection({
    theme,
    onAddQuestion,
    isDragging = false,
}: ThemeSectionProps) {
    const { updateTheme, deleteTheme, deleteQuestion, reorderQuestions } =
        useSurveyBuilder();
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState(theme.title);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(
        null
    );

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require 8px movement before dragging starts
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleSaveTitle = () => {
        if (editedTitle.trim()) {
            updateTheme(theme.id, { title: editedTitle });
            setIsEditingTitle(false);
        }
    };

    const handleDeleteTheme = () => {
        if (
            confirm(
                `Êtes-vous sûr de vouloir supprimer le thème "${theme.title}" et toutes ses questions ?`
            )
        ) {
            deleteTheme(theme.id);
        }
    };

    const handleDeleteQuestion = (questionId: string) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette question ?")) {
            deleteQuestion(theme.id, questionId);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = theme.questions.findIndex(
                (q) => q.id === active.id
            );
            const newIndex = theme.questions.findIndex((q) => q.id === over.id);

            const newOrder = arrayMove(theme.questions, oldIndex, newIndex);
            reorderQuestions(
                theme.id,
                newOrder.map((q) => q.id)
            );
        }
    };

    return (
        <>
            <Card className={isDragging ? "ring-2 ring-elan-orange" : ""}>
                <CardHeader
                    title={
                        isEditingTitle ? (
                            <input
                                type="text"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                onBlur={handleSaveTitle}
                                onKeyDown={(e) => {
                                    e.stopPropagation(); // Prevent drag & drop from capturing
                                    if (e.key === "Enter") {
                                        handleSaveTitle();
                                    } else if (e.key === "Escape") {
                                        setEditedTitle(theme.title);
                                        setIsEditingTitle(false);
                                    }
                                }}
                                onMouseDown={(e) => e.stopPropagation()} // Prevent drag activation
                                onPointerDown={(e) => e.stopPropagation()} // Prevent PointerSensor
                                onClick={(e) => e.stopPropagation()}
                                onFocus={(e) => e.stopPropagation()}
                                className="text-base sm:text-lg font-semibold border-b-2 border-elan-orange focus:outline-none bg-transparent w-full"
                                autoFocus
                            />
                        ) : (
                            <button
                                onClick={() => setIsEditingTitle(true)}
                                className="text-left hover:text-elan-orange transition-colors"
                            >
                                {theme.title}
                            </button>
                        )
                    }
                    description={`${theme.questions.length} question${
                        theme.questions.length > 1 ? "s" : ""
                    }`}
                    action={
                        <div className="flex items-center gap-2">
                            <div
                                className="p-2 text-gray-400 cursor-grab"
                                title="Glisser pour réorganiser"
                            >
                                <GripVertical className="w-4 h-4" />
                            </div>
                            <button
                                onClick={handleDeleteTheme}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Supprimer le thème"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    }
                />

                {/* Questions list with drag & drop */}
                <div className="space-y-3">
                    {theme.questions.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                            <p className="text-sm text-gray-500">
                                Aucune question dans ce thème
                            </p>
                            <button
                                onClick={onAddQuestion}
                                className="mt-2 text-sm text-elan-orange hover:text-elan-orange/80 font-medium"
                            >
                                Ajouter votre première question
                            </button>
                        </div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={theme.questions.map((q) => q.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {theme.questions.map((question) => (
                                    <SortableQuestionItem
                                        key={question.id}
                                        question={question}
                                        onEdit={() =>
                                            setEditingQuestion(question)
                                        }
                                        onDelete={() =>
                                            handleDeleteQuestion(question.id)
                                        }
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    )}

                    {/* Add question button */}
                    {theme.questions.length > 0 && (
                        <button
                            onClick={onAddQuestion}
                            className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-elan-orange hover:text-elan-orange transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Ajouter une question
                        </button>
                    )}
                </div>
            </Card>

            {/* Question Editor Modal */}
            {editingQuestion && (
                <QuestionEditorModal
                    question={editingQuestion}
                    themeId={theme.id}
                    onClose={() => setEditingQuestion(null)}
                />
            )}
        </>
    );
}

interface SortableQuestionItemProps {
    question: Question;
    onEdit: () => void;
    onDelete: () => void;
}

function SortableQuestionItem({
    question,
    onEdit,
    onDelete,
}: SortableQuestionItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: question.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const Icon = getQuestionIcon(question.type);
    const typeLabel = getQuestionTypeLabel(question.type);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-start gap-3 p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-elan-orange transition-colors group bg-white"
        >
            {/* Drag handle */}
            <button
                {...attributes}
                {...listeners}
                className="mt-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing touch-none"
            >
                <GripVertical className="w-4 h-4" />
            </button>

            {/* Question info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                    <div className="p-1.5 bg-gray-100 rounded flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {question.label || (
                                <span className="text-gray-400 italic">
                                    Sans titre
                                </span>
                            )}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {typeLabel}
                            {question.required && (
                                <span className="text-red-500 ml-1">*</span>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                    onClick={onEdit}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title="Modifier"
                >
                    <Edit className="w-4 h-4" />
                </button>
                <button
                    onClick={onDelete}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Supprimer"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
