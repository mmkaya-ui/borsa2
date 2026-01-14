"use client";

import { useMarketStore } from "@/store/marketStore";
import { useEffect, useMemo } from "react";
import { AlertTriangle, TrendingUp, Activity } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Analysis() {
    const { stocks, fetchStocks, isLoading } = useMarketStore();
    const t = useTranslations('Analysis');

    useEffect(() => {
        if (stocks.length === 0) {
            fetchStocks();
        }
    }, [stocks.length, fetchStocks]);

    // Manipulation Detection Logic (Mock)
    const anomalies = useMemo(() => {
        return stocks.filter(stock => {
            const priceChange = Math.abs(stock.changePercent);
            const volumeSpike = stock.volume > 500000; // Arbitrary threshold

            // Detect "Pump and Dump" signals (High volume + High price change)
            return priceChange > 5 || (priceChange > 2 && volumeSpike);
        });
    }, [stocks]);

    const predictions = useMemo(() => {
        return stocks.map(stock => {
            const trend = stock.history[stock.history.length - 1] > stock.history[0] ? 'Bullish' : 'Bearish';
            const confidence = Math.floor(Math.random() * 30) + 70; // 70-100%
            return { ...stock, trend, confidence };
        });
    }, [stocks]);

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
            <header>
                <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)]">
                    {t('title')}
                </h1>
                <p className="text-[var(--muted-foreground)]">
                    {t('subtitle')}
                </p>
            </header>

            {/* Alerts Section */}
            {anomalies.length > 0 && (
                <div className="rounded-xl border border-[var(--destructive)] bg-[var(--destructive)]/10 p-6">
                    <div className="flex items-center gap-2 mb-4 text-[var(--destructive)]">
                        <AlertTriangle size={24} />
                        <h2 className="text-xl font-bold">{t('anomalies')}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {anomalies.map(stock => (
                            <div key={stock.symbol} className="bg-[var(--card)] p-4 rounded-lg border border-[var(--border)] flex justify-between items-center">
                                <div>
                                    <span className="font-bold">{stock.symbol}</span>
                                    <p className="text-sm text-[var(--muted-foreground)]">{t('unusual')}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-[var(--destructive)] font-bold">{stock.changePercent.toFixed(2)}%</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Predictions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
                    <div className="flex items-center gap-2 mb-6 text-[var(--primary)]">
                        <TrendingUp size={24} />
                        <h2 className="text-xl font-bold">{t('predictions')}</h2>
                    </div>
                    <div className="space-y-4">
                        {predictions.slice(0, 5).map(p => (
                            <div key={p.symbol} className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--secondary)] transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-10 rounded-full ${p.trend === 'Bullish' ? 'bg-[var(--primary)]' : 'bg-[var(--destructive)]'}`}></div>
                                    <div>
                                        <div className="font-bold">{p.symbol}</div>
                                        <div className="text-xs text-[var(--muted-foreground)]">{p.name}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`font-bold ${p.trend === 'Bullish' ? 'text-[var(--primary)]' : 'text-[var(--destructive)]'}`}>
                                        {p.trend}
                                    </div>
                                    <div className="text-xs text-[var(--muted-foreground)]">{p.confidence}% {t('confidence')}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
                    <div className="flex items-center gap-2 mb-6 text-[var(--accent)]">
                        <Activity size={24} />
                        <h2 className="text-xl font-bold">{t('volatility')}</h2>
                    </div>
                    <p className="text-[var(--muted-foreground)] mb-4">
                        {t('volatilityDesc')}
                    </p>
                    <div className="h-48 rounded-lg bg-[var(--secondary)]/50 flex items-center justify-center text-[var(--muted-foreground)]">
                        Gauge Placeholder
                    </div>
                </div>
            </div>
        </div>
    );
}
