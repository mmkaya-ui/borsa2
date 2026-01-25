"use client";

import { useMarketStore } from "@/store/marketStore";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, TrendingUp, Activity, Info, CheckCircle2, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { memo } from "react";
import { useMarketAnalysis } from "@/hooks/useMarketAnalysis";

import { Stock } from "@/lib/api";
import { DetectiveDashboard } from "@/components/DetectiveDashboard";

// ... (existing helper components)

export default function Analysis() {
    // ... (existing hooks)

    // ...

    {/* Exchange Filter */ }
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
                ))}
    </div>
        </header >

        {/* VIGIL SYSTEM (Detective Dashboard) */ }
        < DetectiveDashboard stocks = { stocks } />

            {/* MARKET SCANNER LIST */ }
            < div className = "flex flex-col gap-6" >
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
                </div >
            </div >
        </div >
    );
}
