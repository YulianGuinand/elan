interface SurveyStatsCardProps {
    title: string;
    value: string | number;
    change?: number;
    icon: React.ReactNode;
    iconBgColor: string;
    iconColor: string;
}

export default function SurveyStatsCard({
    title,
    value,
    change,
    icon,
    iconBgColor,
    iconColor,
}: SurveyStatsCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                        {title}
                    </p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-gray-900">
                            {value}
                        </p>
                        {change !== undefined && change !== 0 && (
                            <span
                                className={`text-sm font-medium ${
                                    change > 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {change > 0 ? "+" : ""}
                                {change}%
                            </span>
                        )}
                    </div>
                </div>

                <div className={`p-3 rounded-lg ${iconBgColor}`}>
                    <div className={iconColor}>{icon}</div>
                </div>
            </div>
        </div>
    );
}
