import React, { useState } from 'react';
import { Flag, CheckCircle2, ChevronDown } from 'lucide-react';

export default function CallStatus() {
    const [status, setStatus] = useState("");
    
    const statuses = [
        "Réponse complète",
        "Réponse partielle",
        "Ne souhaite pas répondre",
        "Absent / Indisponible",
        "Mauvais numéro",
        "Régler plus tard"
    ];

    return (
        <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm mt-8">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4">Statut de l'Appel</h3>
            
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors">
                        <Flag className="w-5 h-5" />
                    </div>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full pl-14 pr-12 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all appearance-none cursor-pointer"
                    >
                        <option value="">Sélectionner un statut...</option>
                        {statuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <ChevronDown className="w-5 h-5" />
                    </div>
                </div>

                <button className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-slate-900/10">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="uppercase tracking-widest">Enregistrer le statut</span>
                </button>
            </div>
        </div>
    );
}
