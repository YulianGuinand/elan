import {Participant} from "@/Pages/Surveys/Fill";
import { ThemeEnquete } from "@/types/surveys";

interface ThemeNavigationProps {
    themes: ThemeEnquete[];
    currentThemeIndex?: number;
    setCurrentThemeIndex: (idx: number) => void;
}
export default function ThemeNavigation({themes, currentThemeIndex, setCurrentThemeIndex}: ThemeNavigationProps){
    return(
        <div className="bg-white rounded-lg border border-gray-100 p-4">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                Thèmes
            </p>
            <nav className="space-y-1">
                {themes.map((theme, idx) => (
                    <button
                        key={theme.id}
                        type="button"
                        onClick={() =>
                            setCurrentThemeIndex(idx)
                        }
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                            idx === currentThemeIndex
                                ? "bg-orange-50 text-orange-700 font-black"
                                : "text-gray-500 hover:bg-gray-50"
                        }`}
                    >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                                        idx ===
                                                        currentThemeIndex
                                                            ? "bg-orange-500"
                                                            : "bg-gray-300"
                                                    }`}
                                                />
                        {theme.libelle}
                    </button>
                ))}
            </nav>
        </div>
    );
}
