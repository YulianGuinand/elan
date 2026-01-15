import { ChartDataPoint } from "@/types/reports";

interface LineChartProps {
    data: ChartDataPoint[];
    title: string;
    detailsLink?: () => void;
}

export default function LineChart({
    data,
    title,
    detailsLink,
}: LineChartProps) {
    // Calcul des dimensions du graphique
    const width = 600;
    const height = 300;
    const padding = { top: 20, right: 20, bottom: 40, left: 40 };

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Trouver min et max des valeurs
    const values = data.map((d) => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue;

    // Fonction pour convertir les données en points SVG
    const getX = (index: number) => (index / (data.length - 1)) * chartWidth;
    const getY = (value: number) =>
        chartHeight - ((value - minValue) / valueRange) * chartHeight;

    // Créer le chemin de la ligne
    const linePath = data
        .map((point, i) => {
            const x = getX(i);
            const y = getY(point.value);
            return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
        })
        .join(" ");

    // Créer le chemin de la zone remplie sous la ligne
    const areaPath =
        linePath +
        ` L ${getX(data.length - 1)} ${chartHeight} L 0 ${chartHeight} Z`;

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                {detailsLink && (
                    <button
                        onClick={detailsLink}
                        className="text-sm text-elan-orange hover:text-elan-orange/80 font-medium"
                    >
                        Détails
                    </button>
                )}
            </div>

            <div className="w-full overflow-x-auto">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-auto"
                    style={{ minHeight: "250px" }}
                >
                    <g transform={`translate(${padding.left}, ${padding.top})`}>
                        {/* Grille horizontale */}
                        {[0, 1, 2, 3, 4, 5].map((i) => {
                            const y = (chartHeight / 5) * i;
                            const value = maxValue - (valueRange / 5) * i;
                            return (
                                <g key={i}>
                                    <line
                                        x1="0"
                                        y1={y}
                                        x2={chartWidth}
                                        y2={y}
                                        stroke="#f3f4f6"
                                        strokeWidth="1"
                                    />
                                    <text
                                        x="-10"
                                        y={y}
                                        textAnchor="end"
                                        dominantBaseline="middle"
                                        className="text-xs fill-gray-500"
                                    >
                                        {value.toFixed(1)}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Zone remplie */}
                        <path
                            d={areaPath}
                            fill="url(#gradient)"
                            opacity="0.2"
                        />

                        {/* Ligne */}
                        <path
                            d={linePath}
                            fill="none"
                            stroke="#F18628"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* Points */}
                        {data.map((point, i) => {
                            const x = getX(i);
                            const y = getY(point.value);
                            return (
                                <circle
                                    key={i}
                                    cx={x}
                                    cy={y}
                                    r="4"
                                    fill="#F18628"
                                    stroke="white"
                                    strokeWidth="2"
                                />
                            );
                        })}

                        {/* Labels de l'axe X */}
                        {data.map((point, i) => {
                            const x = getX(i);
                            return (
                                <text
                                    key={i}
                                    x={x}
                                    y={chartHeight + 20}
                                    textAnchor="middle"
                                    className="text-xs fill-gray-600"
                                >
                                    {point.label}
                                </text>
                            );
                        })}
                    </g>

                    {/* Gradient pour la zone remplie */}
                    <defs>
                        <linearGradient
                            id="gradient"
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                        >
                            <stop offset="0%" stopColor="#F18628" />
                            <stop
                                offset="100%"
                                stopColor="#F18628"
                                stopOpacity="0"
                            />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>
    );
}
