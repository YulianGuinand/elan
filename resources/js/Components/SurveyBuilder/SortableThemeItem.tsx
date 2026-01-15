import { Theme } from "@/types/surveyBuilder";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ThemeSection from "./ThemeSection";

interface SortableThemeItemProps {
    theme: Theme;
    onAddQuestion: () => void;
    index: number;
}

export default function SortableThemeItem({
    theme,
    onAddQuestion,
    index,
}: SortableThemeItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: theme.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing touch-none"
        >
            <ThemeSection
                theme={theme}
                onAddQuestion={onAddQuestion}
                isDragging={isDragging}
            />
        </div>
    );
}
