import { ReportKPI } from "@/types/reports";
import {
    ArrowDown,
    ArrowUp,
    FileText,
    MessageSquare,
    Smile,
    TrendingUp,
} from "lucide-react";

interface ReportKPICardProps {
    kpi: ReportKPI;
}

const iconMap = {
    participation: TrendingUp,
    satisfaction: Smile,
    active: FileText,
    responses: MessageSquare,
};

const colorMap = {
    participation: "bg-orange-100 text-elan-orange",
    satisfaction: "bg-orange-100 text-elan-orange",
    active: "bg-orange-100 text-elan-orange",
    responses: "bg-orange-100 text-elan-orange",
};

export default function ReportKPICard({ kpi }: ReportKPICardProps) {
    const IconComponent = iconMap[kpi.icon];
    const colorClass = colorMap[kpi.icon];
    const isPositive = kpi.change > 0;

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-sm font-medium text-gray-600">
                            {kpi.title}
                        </h3>
                        <div className={`p-1.5 rounded-md ${colorClass}`}>
                            <IconComponent className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                        {kpi.value}
                    </p>
                    {kpi.subtitle && (
                        <p className="text-xs text-gray-500 mt-1">
                            {kpi.subtitle}
                        </p>
                    )}
                </div>
            </div>

            <div
                className={`inline-flex items-center text-sm font-medium ${
                    isPositive ? "text-green-600" : "text-red-600"
                }`}
            >
                {isPositive ? (
                    <ArrowUp className="w-4 h-4 mr-1" />
                ) : (
                    <ArrowDown className="w-4 h-4 mr-1" />
                )}
                <span>{kpi.changeText}</span>
            </div>
        </div>
    );
}
