interface CircularProgressProps {
    percentage: number;
    title: string;
    subtitle?: string;
    showScore?: boolean;
    score?: number;
    maxScore?: number;
    size?: number;
    strokeWidth?: number;
}

export default function CircularProgress({
    percentage,
    title,
    subtitle,
    showScore = false,
    score,
    maxScore = 5,
    size = 160,
    strokeWidth = 12,
}: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{ width: size, height: size }}>
                <svg
                    width={size}
                    height={size}
                    className="transform -rotate-90"
                >
                    {/* Background circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#e5e7eb"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#F18628"
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                    />
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {showScore ? (
                        <>
                            <span className="text-4xl font-bold text-gray-900">
                                {score}
                            </span>
                            <span className="text-sm text-gray-500">
                                SUR {maxScore}
                            </span>
                        </>
                    ) : (
                        <span className="text-4xl font-bold text-gray-900">
                            {percentage}%
                        </span>
                    )}
                </div>
            </div>

            <div className="mt-4 text-center">
                <p className="font-semibold text-gray-900">{title}</p>
                {subtitle && (
                    <p className="text-sm text-elan-blue mt-1">{subtitle}</p>
                )}
            </div>
        </div>
    );
}
