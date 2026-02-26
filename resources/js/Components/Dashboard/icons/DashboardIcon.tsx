export default function DashboardIcon({
    className = "w-5 h-5",
}: {
    className?: string;
}) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="3"
                y="3"
                width="7"
                height="7"
                rx="1"
                stroke="currentColor"
                strokeWidth="2"
            />
            <rect
                x="14"
                y="3"
                width="7"
                height="7"
                rx="1"
                stroke="currentColor"
                strokeWidth="2"
            />
            <rect
                x="3"
                y="14"
                width="7"
                height="7"
                rx="1"
                stroke="currentColor"
                strokeWidth="2"
            />
            <rect
                x="14"
                y="14"
                width="7"
                height="7"
                rx="1"
                stroke="currentColor"
                strokeWidth="2"
            />
        </svg>
    );
}
