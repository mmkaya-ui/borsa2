"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useMarketStore } from "@/store/marketStore";
import Chart from "@/components/Chart";
import { ArrowLeft, RefreshCw, TrendingUp } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Stock } from "@/lib/api";
import { useTranslations } from "next-intl";

export default function StockDetail() {
    const params = useParams();
    const symbol = params.symbol as string;
    const { stocks, fetchStocks, isLoading } = useMarketStore();
    const [stock, setStock] = useState<Stock | null>(null);
    const t = useTranslations('StockDetail');

    useEffect(() => {
        if (stocks.length === 0) {
            fetchStocks();
        }
    }, [stocks.length, fetchStocks]);

    useEffect(() => {
        const found = stocks.find(s => s.symbol === symbol);
        if (found) {
            setStock(found);
        }
    }, [stocks, symbol]);

    if (isLoading && !stock) {
        return <div className="flex h-screen items-center justify-center animate-pulse text-[var(--muted-foreground)]">{t('loading')}</div>;
    }

    if (!stock) {
        return <div className="text-[var(--destructive)]">{t('notFound')}</div>;
    }

    const isPositive = stock.change >= 0;

    return (
        <div className="max-w-5xl mx-auto flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <Link href="/" className="rounded-full p-2 hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        {stock.symbol}
                        <span className="px-2 py-0.5 rounded text-sm bg-[var(--secondary)] text-[var(--muted-foreground)] font-mono font-normal">USD</span>
                    </h1>
                    <p className="text-[var(--muted-foreground)]">{stock.name}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Chart Card */}
                <div className="md:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <div className="text-4xl font-bold tracking-tight">${stock.price.toFixed(2)}</div>
                            <div className={`flex items-center gap-2 mt-1 ${isPositive ? 'text-[var(--primary)]' : 'text-[var(--destructive)]'}`}>
                                {isPositive ? <TrendingUp size={20} /> : <TrendingUp size={20} className="rotate-180" />}
                                <span className="font-semibold">{stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)</span>
                            </div>
                        </div>
                        <div className="flex gap-1 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                            {['5m', '15m', '1h', '4h', '1D', '1W', '1M', '1Y', '5Y', '20Y'].map(range => (
                                <button key={range} className="px-3 py-1 rounded-md text-xs font-medium hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors whitespace-nowrap">
                                    {t(`ranges.${range.toLowerCase()}`, { fallback: range })}
                                </button>
                            ))}
                        </div>
                    </div>
                    <Chart data={stock.history} color={isPositive ? "var(--primary)" : "var(--destructive)"} />
                </div>

                {/* Stats Card */}
                <div className="flex flex-col gap-4">
                    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
                        <h3 className="font-semibold mb-4 text-[var(--foreground)]">{t('stats')}</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
                                <span className="text-[var(--muted-foreground)]">{t('volume')}</span>
                                <span className="font-mono">{stock.volume.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
                                <span className="text-[var(--muted-foreground)]">{t('marketCap')}</span>
                                <span className="font-mono">{(stock.price * 15000000).toLocaleString('en-US', { style: 'currency', currency: 'USD', notation: 'compact' })}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
                                <span className="text-[var(--muted-foreground)]">{t('open')}</span>
                                <span className="font-mono">${(stock.price - stock.change).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-[var(--border)] bg-[var(--primary)]/10 p-6 flex items-start gap-4">
                        <RefreshCw className="text-[var(--primary)] shrink-0 mt-1" />
                        <div>
                            <h4 className="font-semibold text-[var(--primary)]">{t('realtimeTitle')}</h4>
                            <p className="text-sm text-[var(--muted-foreground)] mt-1">
                                {t('realtimeDesc')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
