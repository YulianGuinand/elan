import { QuestionEnquete } from "@/types/surveys";

interface Props {
    question: QuestionEnquete;
    value: any;
    onChange: (value: any) => void;
    onCheckboxChange: (value: string, checked: boolean) => void;
}

export default function QuestionRenderer({ question: q, value, onChange, onCheckboxChange }: Props) {
    const isLikert = q.type_reponse === "likert" || q.type_reponse === "Échelle linéaire";
    const isSelect = q.type_reponse === "select" || q.type_reponse === "Liste déroulante";
    const isMultiple = q.type_reponse === "checkbox" || q.type_reponse === "Choix multiples";
    const isTextarea = q.type_reponse === "textarea" || q.type_reponse === "Texte long";

    const getEmojiForLikert = (index: number, total: number) => {
        const emojis = ['😡', '😐', '😶', '🙂', '🤩'];
        const mockupEmojis = ['😫', '☹️', '😐', '🙂', '🤩']; // More like mockup
        if (total === 5) return mockupEmojis[index];
        const ratio = index / (total - 1);
        return mockupEmojis[Math.round(ratio * 4)];
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm transition-all duration-300">
            <div className="flex items-start gap-4 mb-6">
                <span className="text-lg font-black text-gray-900 pt-1">
                    {q.numero}.
                </span>
                <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between gap-4">
                        <h3 className="text-lg font-black text-gray-800 leading-snug">
                            {q.libelle}
                        </h3>
                        {isTextarea && (
                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest flex-shrink-0">
                                Optionnel
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="pl-0 md:pl-10">
                {Array.isArray(q.choix) && q.choix.length > 0 ? (
                    isSelect ? (
                        <div className="relative">
                            <select
                                value={value ?? ""}
                                onChange={(e) => onChange(e.target.value)}
                                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Choisir une option...</option>
                                {q.choix.map((c) => (
                                    <option key={c.id} value={String(c.id)}>{c.libelle}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    ) : isLikert ? (
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {(Array.isArray(q.choix) ? q.choix : []).map((c, idx) => {
                                const isSelected = value === String(c.id);
                                return (
                                    <label key={c.id} className="cursor-pointer group">
                                        <input
                                            type="radio"
                                            name={`q_${q.id}`}
                                            value={String(c.id)}
                                            checked={isSelected}
                                            onChange={() => onChange(String(c.id))}
                                            className="sr-only"
                                        />
                                        <div className={`
                                            flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 h-full
                                            ${isSelected
                                                ? "border-orange-500 bg-white shadow-md shadow-orange-500/5 ring-4 ring-orange-500/5"
                                                : "border-gray-100 bg-white hover:border-gray-200"}
                                        `}>
                                            <span className={`text-2xl transition-all duration-300 ${isSelected ? "scale-110" : "filter grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0"}`}>
                                                {getEmojiForLikert(idx, q.choix.length)}
                                            </span>
                                            <span className={`text-[10px] font-black text-center uppercase tracking-tighter leading-tight ${isSelected ? "text-gray-900" : "text-gray-400"}`}>
                                                {c.libelle}
                                            </span>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(Array.isArray(q.choix) ? q.choix : []).map((c) => {
                                const isSelected = isMultiple
                                    ? Array.isArray(value) && value.includes(String(c.id))
                                    : value === String(c.id);

                                return (
                                    <label key={c.id} className={`
                                        flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                                        ${isSelected
                                            ? "border-orange-500 bg-orange-50/30"
                                            : "border-gray-50 bg-gray-50/30 hover:border-gray-100 hover:bg-white"}
                                    `}>
                                        <div className={`
                                            w-5 h-5 flex items-center justify-center border-2 transition-all
                                            ${isSelected ? "bg-orange-500 border-orange-500" : "bg-white border-gray-200"}
                                            ${isMultiple ? "rounded-md" : "rounded-full"}
                                        `}>
                                            {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                        </div>
                                        <input
                                            type={isMultiple ? "checkbox" : "radio"}
                                            name={isMultiple ? `q_${q.id}_${c.id}` : `q_${q.id}`}
                                            value={String(c.id)}
                                            checked={isSelected}
                                            onChange={(e) => isMultiple ? onCheckboxChange(String(c.id), e.target.checked) : onChange(String(c.id))}
                                            className="sr-only"
                                        />
                                        <span className={`text-sm font-bold ${isSelected ? "text-gray-900" : "text-gray-500"}`}>
                                            {c.libelle}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    )
                ) : isTextarea ? (
                    <div className="relative">
                        <textarea
                            rows={4}
                            value={value ?? ""}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="Saisissez vos notes ici..."
                            className="w-full p-5 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all resize-none"
                        />
                    </div>
                ) : (
                    <input
                        type={q.type_reponse === "number" ? "number" : q.type_reponse === "date" ? "date" : "text"}
                        value={value ?? ""}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={q.type_reponse === "number" ? "Ex: 42" : q.type_reponse === "date" ? "" : "Écrivez votre réponse..."}
                        className="w-full p-4 bg-gray-50/50 border border-gray-100 rounded-xl text-sm font-bold text-gray-800 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all"
                    />
                )}
            </div>
        </div>
    );
}
