interface ProgressBarProps {
    label: string;
    percentage?: number;
    count?: number;
    color: string;
}

export default function ProgressBar({
    label,
    percentage = 0,
    count,
    color,
}: ProgressBarProps) {
    return (
        <div className="flex items-center gap-4 py-2">
            <span className="text-sm text-gray-700 w-32 flex-shrink-0">
                {label}
            </span>
            <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                        width:
                            count !== undefined
                                ? count > 0
                                    ? "100%"
                                    : "0%"
                                : `${percentage}%`,
                        backgroundColor: color,
                    }}
                />
            </div>
            <span className="text-sm font-medium text-gray-900 w-12 text-right">
                {count !== undefined ? count : `${percentage}%`}
            </span>
        </div>
    );
}
