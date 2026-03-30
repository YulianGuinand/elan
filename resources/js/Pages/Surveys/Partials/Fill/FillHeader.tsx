import { Mic, Pause, Phone, PhoneOff, Play } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
    campaignName: string;
}

export default function FillHeader({ campaignName }: Props) {
    const [seconds, setSeconds] = useState(272); // 04:32 as in mockup
    const [isActive, setIsActive] = useState(true);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        let interval: any = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds((seconds) => seconds + 1);
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 shadow-inner">
                    <Phone className="w-5 h-5" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-gray-900 leading-tight">
                        Gestionnaire d'Enquêtes
                    </h1>
                    <p className="text-xs text-gray-500 font-medium tracking-tight">
                        Campagne : {campaignName || "—"}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="bg-blue-50/50 px-4 py-2 rounded-full border border-blue-100/50 flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Durée
                        </span>
                    </div>
                    <span className="text-sm font-mono font-bold text-gray-700">
                        {formatTime(seconds)}
                    </span>
                </div>

                <div className="flex items-center gap-2 border-l border-gray-100 pl-6">
                    <button
                        onClick={() => setIsActive(!isActive)}
                        className={`p-2.5 rounded-xl transition-all duration-200 ${!isActive ? "bg-orange-100 text-orange-600" : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"}`}
                    >
                        {isActive ? (
                            <Pause className="w-5 h-5" />
                        ) : (
                            <Play className="w-5 h-5 fill-current" />
                        )}
                    </button>
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-2.5 rounded-xl transition-all duration-200 ${isMuted ? "bg-red-50 text-red-500" : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"}`}
                    >
                        <Mic
                            className={`w-5 h-5 ${isMuted ? "fill-current" : ""}`}
                        />
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold text-sm shadow-lg shadow-red-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
                        <PhoneOff className="w-4 h-4" />
                        <span>Fin d'Appel</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
