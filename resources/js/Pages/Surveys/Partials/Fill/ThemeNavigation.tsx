import { CheckCircle2, Circle } from "lucide-react";
import { ThemeEnquete } from "../../../../types/surveys";

interface Props {
    themes: ThemeEnquete[];
    currentThemeIndex: number;
    setCurrentThemeIndex: (index: number) => void;
    answers: Record<number, any>;
}

export default function ThemeNavigation({
    themes,
    currentThemeIndex,
    setCurrentThemeIndex,
    answers,
}: Props) {
    const isThemeComplete = (theme: ThemeEnquete) => {
        return theme.questions.every(
            (q) => answers[q.id] !== undefined && answers[q.id] !== "",
        );
    };
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 pb-4 border-b border-gray-50 bg-gray-50/30">
                 <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">
                     Plan de l&apos;enquête
                 </h3>
             </div>
             <div className="p-2">
                 <div className="space-y-1">
                     {themes.map((theme, index) => {
                        const isActive = currentThemeIndex === index;
                        const complete = isThemeComplete(theme);

                        return (
                            <button
                                key={theme.id}
                                onClick={() => setCurrentThemeIndex(index)}
                                className={`
                                    w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left group
                                    ${
                                        isActive
                                            ? "bg-orange-50 text-orange-600 shadow-sm"
                                            : "text-gray-500 hover:bg-gray-100/90 hover:text-gray-900"
                                    }
                                `}
                            >
                                <div
                                    className={`
                                    flex-shrink-0 w-5 h-5 flex items-center justify-center
                                    ${isActive ? "text-orange-500" : complete ? "text-green-500" : "text-gray-300 group-hover:text-gray-400"}
                                `}
                                >
                                    {complete ? (
                                        <CheckCircle2 className="w-4 h-4" />
                                    ) : (
                                        <Circle className="w-4 h-4 fill-current opacity-20" />
                                    )}
                                </div>
                                <span
                                    className={`text-xs font-bold truncate ${isActive ? "font-black" : ""}`}
                                >
                                    {theme.libelle}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// const ThemeCard = ({
//     themes,
//     currentThemeIndex,
//     setCurrentThemeIndex,
//     answers,
// }: Props) => {
//     const isThemeComplete = (theme: ThemeEnquete) => {
//         return theme.questions.every(
//             (q) => answers[q.id] !== undefined && answers[q.id] !== "",
//         );
//     };
//     return (
//         <>
//             <div className="p-5 pb-4 border-b border-gray-50 bg-gray-50/30">
//                 <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">
//                     Plan de l&apos;enquête
//                 </h3>
//             </div>
//             <div className="p-2">
//                 <div className="space-y-1">
//                     {themes.map((theme, index) => {
//                         const isActive = currentThemeIndex === index;
//                         const complete = isThemeComplete(theme);

//                         return (
//                             <button
//                                 key={theme.id}
//                                 onClick={() => setCurrentThemeIndex(index)}
//                                 className={`
//                                     w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left group
//                                     ${
//                                         isActive
//                                             ? "bg-orange-50 text-orange-600 shadow-sm"
//                                             : "text-gray-500 hover:bg-gray-100/90 hover:text-gray-900"
//                                     }
//                                 `}
//                             >
//                                 <div
//                                     className={`
//                                     flex-shrink-0 w-5 h-5 flex items-center justify-center
//                                     ${isActive ? "text-orange-500" : complete ? "text-green-500" : "text-gray-300 group-hover:text-gray-400"}
//                                 `}
//                                 >
//                                     {complete ? (
//                                         <CheckCircle2 className="w-4 h-4" />
//                                     ) : (
//                                         <Circle className="w-4 h-4 fill-current opacity-20" />
//                                     )}
//                                 </div>
//                                 <span
//                                     className={`text-xs font-bold truncate ${isActive ? "font-black" : ""}`}
//                                 >
//                                     {theme.libelle}
//                                 </span>
//                             </button>
//                         );
//                     })}
//                 </div>
//             </div>
//         </>
//     );
// };
