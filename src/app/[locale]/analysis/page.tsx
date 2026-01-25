"use client";

import { useMarketStore } from "@/store/marketStore";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, TrendingUp, Activity, Info, CheckCircle2, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { memo } from "react";
import { useMarketAnalysis } from "@/hooks/useMarketAnalysis";

import { Stock } from "@/lib/api";
import { GlobalRadar } from "@/components/GlobalRadar";

interface MarketScannerRowProps {
    stock: Stock & { analysis: any }; // Enhancing Stock with analysis property check
    t: any; // next-intl types are complex, keeping simple for now or could import Translations type
    trend: 'Bullish' | 'Bearish';
    confidence: number;
    isRisky: boolean;
}

// Memoized Row Component
const MarketScannerRow = memo(({ stock, t, trend, confidence, isRisky }: MarketScannerRowProps) => {
    return (
        <Link href={`/stock/${stock.symbol}`} className="block">
            <div className={`grid grid-cols-12 gap-4 p-4 items-center border-b border-[var(--border)] hover:bg-[var(--secondary)]/50 transition-colors ${isRisky ? 'bg-[var(--destructive)]/5' : ''}`}>

                {/* Symbol & Name */}
                <div className="col-span-4 md:col-span-3">
                    <div className="font-bold text-[var(--foreground)]">{stock.symbol}</div>
                    <div className="text-xs text-[var(--muted-foreground)] truncate hidden sm:block">{stock.name}</div>
                </div>

                {/* Price */}
                <div className="col-span-3 md:col-span-2 text-right">
                    <div className="font-mono font-medium">
                        {stock.currency === 'TRY' ? '₺' : '$'}{stock.price.toFixed(2)}
                    </div>
                    <div className={`text-xs font-bold ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </div>
                </div>

                {/* Risk Score */}
                <div className="col-span-3 md:col-span-2 text-right">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-black
                        ${stock.analysis.riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-500' :
                            stock.analysis.riskLevel === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
                        {stock.analysis.riskScore}
                        {stock.analysis.riskLevel === 'HIGH' && <AlertTriangle size={10} />}
                    </div>
                </div>

                {/* Trend (Desktop) */}
                <div className="hidden md:block col-span-3">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={16} className={trend === 'Bearish' ? 'text-red-500 rotate-180' : 'text-green-500'} />
                        <div className="flex flex-col">
                            <span className={`text-xs font-bold ${trend === 'Bullish' ? 'text-green-500' : 'text-red-500'}`}>
                                {trend === 'Bullish' ? 'YÜKSELİŞ' : 'DÜŞÜŞ'}
                            </span>
                            <span className="text-[10px] text-[var(--muted-foreground)]">
                                %{confidence} Güven
                            </span>
                        </div>
                    </div>
                </div>

                {/* Status / Hints */}
                <div className="col-span-2 text-right">
                    {stock.analysis.hints.length > 0 ? (
                        <span className="text-[10px] px-2 py-0.5 bg-[var(--secondary)] rounded text-[var(--foreground)] truncate max-w-full inline-block">
                            {t(`hints.${stock.analysis.hints[0]}`)}
                        </span>
                    ) : (
                        <span className="text-[10px] text-green-500 font-medium">Stabil</span>
                    )}
                </div>
            </div>
        </Link>
    );
});
MarketScannerRow.displayName = 'MarketScannerRow';

export default function Analysis() {
    const { stocks, fetchStocks, isLoading } = useMarketStore();
    const t = useTranslations('Analysis');

    // Custom Hook for Senior Architecture
    const {
        sortedMarket,
        analyzedCount,
        selectedExchange,
        setSelectedExchange,
        sortConfig,
        handleSort
    } = useMarketAnalysis();

    useEffect(() => {
        if (stocks.length === 0) {
            fetchStocks();
        }
    }, [stocks.length, fetchStocks]);



    // ... inside component



    const SortIcon = ({ column }: { column: string }) => {
        if (sortConfig.key !== column) return <ArrowUpDown size={12} className="opacity-30" />;
        return sortConfig.direction === 'asc' ? <ArrowUp size={12} className="text-[var(--primary)]" /> : <ArrowDown size={12} className="text-[var(--primary)]" />;
    };





    // Logic moved to hook, predictions not used in this view anymore or can be derived from hook if needed
    // const predictions = useMemo(...

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

                {/* Exchange Filter */}
                <div className="flex gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
                    {['ALL', 'BIST', 'NASDAQ', 'CRYPTO'].map(ex => (
                        <button
                            key={ex}
                            onClick={() => setSelectedExchange(ex)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${selectedExchange === ex
                                ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg shadow-[var(--primary)]/20'
                                : 'bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--foreground)]'
                                }`}
                        >
                            {ex === 'ALL' ? 'Tüm Piyasalar' : ex}
                        </button>
                    ))}
                </div>
            </header>

            {/* Global Radar (Whale Hunting/VIGIL) */}
            <GlobalRadar stocks={stocks} />

            {/* MARKET SCANNER LIST */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Activity className="text-[var(--primary)]" />
                        Piyasa Tarayıcısı
                    </h2>
                    <div className="text-sm text-[var(--muted-foreground)]">
                        {analyzedCount} hisse tarandı
                    </div>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
                    {/* Sortable Header */}
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-[var(--border)] bg-[var(--secondary)]/30 text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider relative z-20">
                        <button
                            type="button"
                            className="col-span-4 md:col-span-3 flex items-center gap-2 cursor-pointer hover:text-[var(--foreground)] transition-colors select-none text-left"
                            onClick={() => handleSort('symbol')}
                        >
                            Sembol <SortIcon column="symbol" />
                        </button>
                        <button
                            type="button"
                            className="col-span-3 md:col-span-2 justify-end flex items-center gap-2 cursor-pointer hover:text-[var(--foreground)] transition-colors select-none text-right"
                            onClick={() => handleSort('price')}
                        >
                            Fiyat <SortIcon column="price" />
                        </button>
                        <button
                            type="button"
                            className="col-span-3 md:col-span-2 justify-end flex items-center gap-2 cursor-pointer hover:text-[var(--foreground)] transition-colors select-none text-right"
                            onClick={() => handleSort('riskScore')}
                        >
                            Risk Analizi <SortIcon column="riskScore" />
                        </button>
                        <button
                            type="button"
                            className="hidden md:block col-span-3 flex items-center gap-2 cursor-pointer hover:text-[var(--foreground)] transition-colors select-none text-left"
                            onClick={() => handleSort('trend')}
                        >
                            Trend Beklentisi <SortIcon column="trend" />
                        </button>
                        <div className="col-span-2 text-right flex items-center justify-end">
                            Durum
                        </div>
                    </div>

                    {/* Scrollable List */}
                    <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                        {sortedMarket.map((stock) => {
                            const isRisky = stock.analysis.riskLevel === 'HIGH' || stock.analysis.riskLevel === 'MEDIUM';

                            return (
                                <MarketScannerRow
                                    key={stock.symbol}
                                    stock={stock}
                                    t={t}
                                    trend={stock.trend}
                                    confidence={stock.confidence}
                                    isRisky={isRisky}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
