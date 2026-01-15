
import { StockDetective } from "@/lib/detective";
import RiskScoreCard from "@/components/detective/RiskScoreCard";
import AnomalyList from "@/components/detective/AnomalyList";
import { Siren, Newspaper, RefreshCcw } from "lucide-react";

export default async function DetectivePage() {
    const detective = new StockDetective();
    const results = await detective.getWatchlistAnalysis();

    return (
        <div className="container mx-auto max-w-7xl space-y-8">

            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Siren className="text-red-500" />
                    Stock Detective Mode
                </h1>
                <p className="text-[var(--muted-foreground)]">
                    AI-powered forensic analysis to detect market manipulation, pump & dump schemes, and unusually high-risk movements.
                </p>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((stock) => (
                    <div key={stock.symbol} className="flex flex-col gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]/50">
                        <RiskScoreCard score={stock.riskScore} symbol={stock.symbol} />

                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--muted-foreground)]">Price:</span>
                            <span className="font-mono font-bold">{stock.price.toFixed(2)} TL</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--muted-foreground)]">Change:</span>
                            <span className={`font-mono font-bold ${stock.changePercent > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--muted-foreground)]">RSI:</span>
                            <span className="font-mono font-bold">{stock.rsi.toFixed(0)}</span>
                        </div>

                        <div className="h-px bg-[var(--border)] my-2" />

                        <h4 className="text-sm font-semibold">Diagnosis:</h4>
                        <AnomalyList reasons={stock.riskReasons} />
                    </div>
                ))}
            </div>

            {/* KAP Hunter Section (Mock) */}
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-6">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-yellow-500">
                    <Newspaper />
                    KAP Hunter (Beta) - Pre-News Drift Detection
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        <div className="flex-1">
                            <div className="flex justify-between mb-1">
                                <span className="font-bold">IZENR.IS</span>
                                <span className="text-xs text-[var(--muted-foreground)]">2 hours ago</span>
                            </div>
                            <p className="text-sm text-[var(--foreground)]">
                                Suspicious accumulation detected before Close (Volume +200%). Possible insider news pending.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                        <div className="h-2 w-2 rounded-full bg-orange-500" />
                        <div className="flex-1">
                            <div className="flex justify-between mb-1">
                                <span className="font-bold">SASA.IS</span>
                                <span className="text-xs text-[var(--muted-foreground)]">Yesterday</span>
                            </div>
                            <p className="text-sm text-[var(--foreground)]">
                                Price diverging from sector index. "Stealth Buy" algorithm triggered.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Media Hype (Mock) */}
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-6">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-blue-500">
                    <RefreshCcw className="animate-spin-slow" />
                    Social Media Hype Radar
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                        <h3 className="font-bold mb-2">Top Trending (#BIST)</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex justify-between">
                                <span>#EUREN</span>
                                <span className="text-green-500 font-bold">+450% Mentions</span>
                            </li>
                            <li className="flex justify-between">
                                <span>#HEKTS</span>
                                <span className="text-green-500 font-bold">+120% Mentions</span>
                            </li>
                        </ul>
                    </div>
                    <div className="p-4 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                        <h3 className="font-bold mb-2">Bot Activity Alert</h3>
                        <p className="text-sm text-red-400">
                            High bot activity detected on #EUREN tag. 400+ tweets from new accounts in last hour. Artificial hype probability: 92%.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}
