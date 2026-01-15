
import { AlertCircle } from "lucide-react";

interface AnomalyListProps {
    reasons: string[];
}

export default function AnomalyList({ reasons }: AnomalyListProps) {
    if (!reasons || reasons.length === 0) {
        return (
            <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20 text-green-500 text-sm">
                Anomali tespit edilmedi. Organik piyasa hareketi.
            </div>
        );
    }

    return (
        <div className="space-y-2 w-full">
            {reasons.map((reason, index) => (
                <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-red-500/5 border border-red-500/20 text-red-500 text-sm">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{reason}</span>
                </div>
            ))}
        </div>
    );
}
