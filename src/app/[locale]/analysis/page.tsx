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

    // Advanced Volatility Calculation (Standard Deviation of Log Returns)
    const volatilityIndex = useMemo(() => {
        if (stocks.length === 0) return 0;

        let totalVolatility = 0;

        stocks.forEach(stock => {
            const prices = stock.history;
            if (prices.length < 2) return;

            // Calculate Log Returns
            const returns = [];
            for (let i = 1; i < prices.length; i++) {
                returns.push(Math.log(prices[i] / prices[i - 1]));
            }

            // Calculate Standard Deviation
            const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
            const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
            const stdDev = Math.sqrt(variance);

            // Annualize Volatility (assuming daily data, x sqrt(252)) - simplified for mock scaling
            // For this demo, we'll scale it to a 0-100 index relative to a baseline
            totalVolatility += stdDev * 1000; // Scaling factor
        });

        const avgVol = totalVolatility / stocks.length;
        // Cap at 100, Min 0
        return Math.min(Math.max(Math.round(avgVol), 0), 100);
    }, [stocks]);

    const getVolatilityStatus = (score: number) => {
        if (score < 20) return { label: "LOW", color: "text-emerald-500", desc: "Düşük risk, stabil piyasa." };
        if (score < 50) return { label: "MODERATE", color: "text-yellow-500", desc: "Orta seviye risk, dikkatli olunmalı." };
        if (score < 80) return { label: "HIGH", color: "text-orange-500", desc: "Yüksek volatilite, ani değişimler beklenebilir." };
        return { label: "EXTREME", color: "text-red-500", desc: "Aşırı volatilite! Yüksek risk uyarısı." };
    };

    const volStatus = getVolatilityStatus(volatilityIndex);

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

                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-2 text-[var(--accent)]">
                        <Activity size={24} />
                        <h2 className="text-xl font-bold">{t('volatility')}</h2>
                    </div>
                    <p className="text-[var(--muted-foreground)] mb-8 text-sm">
                        {volStatus.desc}
                    </p>

                    <div className="flex-1 flex flex-col items-center justify-center relative min-h-[160px]">
                        {/* Gauge Visualization */}
                        <div className="relative w-64 h-32 overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full rounded-t-full bg-[var(--secondary)]"></div>
                            <div
                                className={`absolute top-0 left-0 w-full h-full rounded-t-full origin-bottom transition-transform duration-1000 ease-out bg-gradient-to-t from-[var(--primary)] to-[var(--accent)]`}
                                style={{ transform: `rotate(${(volatilityIndex / 100) * 180 - 180}deg)` }}
                            ></div>
                        </div>
                        <div className="absolute bottom-0 text-center translate-y-1">
                            <span className={`text-4xl font-black tracking-tighter ${volStatus.color}`}>{volatilityIndex.toFixed(1)}</span>
                            <span className="text-xs text-[var(--muted-foreground)] block uppercase tracking-widest mt-1">VIX Score</span>
                        </div>
                    </div>
                    <div className="text-center mt-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${volStatus.color} border-current opacity-80`}>
                            {volStatus.label}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
