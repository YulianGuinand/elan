import { StatCard as StatCardType } from "@/types/dashboard";
import { ArrowDown, ArrowUp } from "lucide-react";
import AlertIcon from "./icons/AlertIcon";
import ResponseIcon from "./icons/ResponseIcon";
import SendIcon from "./icons/SendIcon";

interface StatsCardProps {
    stat: StatCardType;
}

const iconMap = {
    send: SendIcon,
    response: ResponseIcon,
    alert: AlertIcon,
};

const colorMap = {
    info: "bg-elan-orange/10 text-elan-orange",
    success: "bg-elan-green/10 text-elan-green",
    warning: "bg-orange-100 text-orange-600",
};

export default function StatsCard({ stat }: StatsCardProps) {
    const IconComponent = iconMap[stat.icon];
    const colorClass = colorMap[stat.type || "info"];
    const isPositive = stat.change > 0;
    const isNegative = stat.change < 0;

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                        {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-3">
                        {stat.value}
                    </p>

                    {stat.type === "warning" ? (
                        <div className="inline-flex items-center text-sm text-orange-600 font-medium">
                            <span className="mr-1">
                                <AlertIcon className="size-3.5 mr-1" />
                            </span>
                            {stat.changeText}
                        </div>
                    ) : (
                        <div
                            className={`inline-flex items-center text-sm font-medium ${
                                isPositive
                                    ? "text-green-600"
                                    : isNegative
                                    ? "text-red-600"
                                    : "text-gray-600"
                            }`}
                        >
                            {isPositive && <ArrowUp className="w-4 h-4 mr-1" />}
                            {isNegative && (
                                <ArrowDown className="w-4 h-4 mr-1" />
                            )}
                            <span>{stat.changeText}</span>
                        </div>
                    )}
                </div>

                <div className={`p-3 rounded-lg ${colorClass}`}>
                    <IconComponent className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}
