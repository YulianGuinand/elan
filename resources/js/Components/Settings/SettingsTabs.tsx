import { SettingsTab } from "@/types/settings";

interface SettingsTabsProps {
    activeTab: SettingsTab;
    onTabChange: (tab: SettingsTab) => void;
}

const tabs = [
    { id: "account" as const, label: "Mon Compte" },
    { id: "notifications" as const, label: "Notifications" },
    { id: "general" as const, label: "Général" },
    { id: "integrations" as const, label: "Intégrations" },
];

export default function SettingsTabs({
    activeTab,
    onTabChange,
}: SettingsTabsProps) {
    return (
        <div className="border-b border-gray-200 mb-6 md:mb-8">
            <nav className="flex space-x-4 md:space-x-8 overflow-x-auto scrollbar-hide -mb-px">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`
                            py-3 md:py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                            ${
                                activeTab === tab.id
                                    ? "border-elan-orange text-elan-orange"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }
                        `}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
}
