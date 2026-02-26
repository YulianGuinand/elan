import { DonutChartSegment } from "@/types/reports";

interface DonutChartProps {
    data: DonutChartSegment[];
    title: string;
    totalLabel?: string;
}

export default function DonutChart({
    data,
    title,
    totalLabel,
}: DonutChartProps) {
    const size = 240;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = 80;
    const innerRadius = 55;

    // Calculer le total
    const total = data.reduce((sum, segment) => sum + segment.value, 0);

    // Générer les arcs du donut
    let cumulativePercentage = 0;

    const getArcPath = (startPercentage: number, endPercentage: number) => {
        const startAngle = (startPercentage / 100) * 2 * Math.PI - Math.PI / 2;
        const endAngle = (endPercentage / 100) * 2 * Math.PI - Math.PI / 2;

        const x1 = centerX + radius * Math.cos(startAngle);
        const y1 = centerY + radius * Math.sin(startAngle);
        const x2 = centerX + radius * Math.cos(endAngle);
        const y2 = centerY + radius * Math.sin(endAngle);

        const x3 = centerX + innerRadius * Math.cos(endAngle);
        const y3 = centerY + innerRadius * Math.sin(endAngle);
        const x4 = centerX + innerRadius * Math.cos(startAngle);
        const y4 = centerY + innerRadius * Math.sin(startAngle);

        const largeArc = endPercentage - startPercentage > 50 ? 1 : 0;

        return `
            M ${x1} ${y1}
            A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
            L ${x3} ${y3}
            A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}
            Z
        `;
    };

    const arcs = data.map((segment) => {
        const startPercentage = cumulativePercentage;
        cumulativePercentage += segment.percentage;
        return {
            ...segment,
            path: getArcPath(startPercentage, cumulativePercentage),
        };
    });

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
                {title}
            </h3>

            <div className="flex flex-col items-center">
                {/* Donut Chart */}
                <div className="relative mb-6">
                    <svg
                        width={size}
                        height={size}
                        className="transform -rotate-90"
                    >
                        {arcs.map((arc, index) => (
                            <path
                                key={index}
                                d={arc.path}
                                fill={arc.color}
                                className="transition-opacity hover:opacity-80"
                            />
                        ))}
                    </svg>

                    {/* Texte au centre */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold text-gray-900">
                            {total.toLocaleString()}
                        </div>
                        {totalLabel && (
                            <div className="text-xs text-gray-500 uppercase tracking-wide">
                                {totalLabel}
                            </div>
                        )}
                    </div>
                </div>

                {/* Légende */}
                <div className="w-full space-y-2">
                    {data.map((segment, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between py-1"
                        >
                            <div className="flex items-center gap-2 flex-1">
                                <div
                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: segment.color }}
                                />
                                <span className="text-sm text-gray-700">
                                    {segment.label}
                                </span>
                            </div>
                            <span className="text-sm font-semibold text-gray-900 ml-4">
                                {segment.percentage}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
