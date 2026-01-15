
import { ShieldAlert, ShieldCheck, AlertTriangle } from "lucide-react";

interface RiskScoreCardProps {
    score: number;
    symbol: string;
}

export default function RiskScoreCard({ score, symbol }: RiskScoreCardProps) {
    let color = "text-green-500";
    let bg = "bg-green-500/10";
    let Icon = ShieldCheck;
    let label = "SAFE";

    if (score >= 80) {
        color = "text-red-500";
        bg = "bg-red-500/10";
        Icon = ShieldAlert;
        label = "DANGER";
    } else if (score >= 40) {
        color = "text-yellow-500";
        bg = "bg-yellow-500/10";
        Icon = AlertTriangle;
        label = "WARNING";
    }

    return (
        <div className={`flex flex-col items-center justify-center p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 p-2 text-xs font-bold ${color} ${bg} rounded-bl-xl`}>
                {label}
            </div>

            <h3 className="text-xl font-bold mb-2">{symbol}</h3>

            <div className={`relative flex items-center justify-center w-24 h-24 rounded-full border-4 ${color.replace('text', 'border')} ${bg} mb-4`}>
                <Icon size={40} className={color} />
                <span className="absolute -bottom-2 bg-[var(--card)] px-2 text-sm font-bold border border-[var(--border)] rounded-full">
                    {score}/100
                </span>
            </div>

            <p className="text-xs text-[var(--muted-foreground)] text-center">
                Manipulation Risk Score
            </p>
        </div>
    );
}
