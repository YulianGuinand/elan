export interface ReportKPI {
    id: string;
    title: string;
    value: string | number;
    subtitle?: string;
    change: number;
    changeText: string;
    icon: "participation" | "satisfaction" | "active" | "responses";
}

export interface ChartDataPoint {
    label: string;
    value: number;
}

export interface DonutChartSegment {
    label: string;
    value: number;
    percentage: number;
    color: string;
}

export interface ReportFilters {
    period: string;
    survey: string;
    audience: string;
    indicator: string;
}
