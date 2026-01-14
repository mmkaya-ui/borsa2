"use client";

import { useMarketStore } from "@/store/marketStore";
import { useEffect, useMemo } from "react";
import { AlertTriangle, TrendingUp, Activity, Info, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { AnalysisUtils } from "@/lib/analysisUtils";

export default function Analysis() {
    const { stocks, fetchStocks, isLoading } = useMarketStore();
    const t = useTranslations('Analysis');

    useEffect(() => {
        if (stocks.length === 0) {
            fetchStocks();
        }
    }, [stocks.length, fetchStocks]);



    // ... inside component

    // Artificial Intelligence Scanner (Real Logic)
    const scannedMarket = useMemo(() => {
        if (stocks.length === 0) return [];
        return stocks.map(stock => {
            const analysis = AnalysisUtils.analyzeStock(stock.history, stock.volume);
            return { ...stock, analysis };
        }).sort((a, b) => b.analysis.riskScore - a.analysis.riskScore);
    }, [stocks]);

    const riskyAssets = scannedMarket.filter(item => item.analysis.riskLevel === 'HIGH' || item.analysis.riskLevel === 'MEDIUM');

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

            {/* Alerts Section - Always visible to show manipulation indicators location */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle size={24} className={riskyAssets.length > 0 ? "text-[var(--destructive)]" : "text-emerald-500"} />
                    <h2 className="text-xl font-bold text-[var(--foreground)]">{t('anomalies')}</h2>
                </div>

                {riskyAssets.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {riskyAssets.map(item => (
                            <Link key={item.symbol} href={`/stock/${item.symbol}`} className="block group">
                                <div className="bg-[var(--card)] p-4 rounded-lg border border-[var(--destructive)] flex justify-between items-center hover:bg-[var(--destructive)]/5 transition-colors cursor-pointer group-hover:shadow-md">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-lg">{item.symbol}</span>
                                            <span className="px-2 py-0.5 rounded text-[10px] bg-[var(--destructive)] text-white font-bold">
                                                {item.analysis.riskScore} RISK
                                            </span>
                                        </div>
                                        <p className="text-xs text-[var(--muted-foreground)]">
                                            {t(`hints.${item.analysis.hints[0]}`)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className={`font-bold ${item.change >= 0 ? 'text-[var(--primary)]' : 'text-[var(--destructive)]'}`}>
                                            {item.changePercent.toFixed(2)}%
                                        </div>
                                        <div className="text-[10px] text-[var(--muted-foreground)] uppercase">
                                            {item.exchange}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-[var(--muted-foreground)] opacity-70 bg-[var(--secondary)]/30 rounded-lg border border-dashed border-[var(--border)]">
                        <CheckCircle2 size={40} className="text-emerald-500 mb-2 opacity-80" />
                        <p className="font-medium text-emerald-500">{t('noAnomalies')}</p>
                        <p className="text-sm mt-1">{t('noAnomaliesDesc')}</p>
                    </div>
                )}
            </div>

            {/* Predictions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
                    <div className="flex items-center gap-2 mb-6 text-[var(--primary)]">
                        <TrendingUp size={24} />
                        <h2 className="text-xl font-bold">{t('predictions')}</h2>
                    </div>
                    <div className="space-y-4">
                        {predictions.slice(0, 5).map(p => (
                            <Link key={p.symbol} href={`/stock/${p.symbol}`} className="block">
                                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--secondary)] transition-colors cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-10 rounded-full ${p.trend === 'Bullish' ? 'bg-[var(--primary)]' : 'bg-[var(--destructive)]'}`}></div>
                                        <div>
                                            <div className="font-bold">{p.symbol}</div>
                                            <div className="text-xs text-[var(--muted-foreground)]">{p.name}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`font-bold ${p.trend === 'Bullish' ? 'text-[var(--primary)]' : 'text-[var(--destructive)]'}`}>
                                            {p.trend === 'Bullish' ? t('bullish') : t('bearish')}
                                        </div>
                                        <div className="text-xs text-[var(--muted-foreground)]">{p.confidence}% {t('confidence')}</div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 flex flex-col relative group">
                    <div className="flex items-center gap-2 mb-2 text-[var(--accent)]">
                        <Activity size={24} />
                        <h2 className="text-xl font-bold">{t('volatility')}</h2>
                        {/* Tooltip Icon & Popover */}
                        <div className="relative group/tooltip ml-auto">
                            <Info size={18} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-help transition-colors" />
                            <div className="absolute right-0 top-6 w-72 p-4 rounded-xl bg-[var(--popover)] border border-[var(--border)] shadow-xl z-50 hidden group-hover/tooltip:block animate-in fade-in zoom-in-95 duration-200">
                                <div className="text-xs font-semibold mb-1 text-[var(--foreground)]">VIX (Volatility Index)</div>
                                <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">
                                    {t('volatilityTooltip')}
                                </p>
                            </div>
                        </div>
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
