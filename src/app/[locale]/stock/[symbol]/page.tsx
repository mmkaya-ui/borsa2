"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useMarketStore } from "@/store/marketStore";
import { ArrowLeft, RefreshCw, TrendingUp } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Stock, MarketAPI } from "@/lib/api";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

// Dynamically import Chart with no SSR to prevent hydration issues
const Chart = dynamic(() => import("@/components/Chart"), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full animate-pulse bg-[var(--border)]/30 rounded-xl" />
});

export default function StockDetail() {
    const params = useParams();
    const symbol = params.symbol as string;
    const { stocks, fetchStocks, isLoading } = useMarketStore();
    const [stock, setStock] = useState<Stock | null>(null);
    const t = useTranslations('StockDetail');

    // Hydration check
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

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

    // Range Selection State
    const [selectedRange, setSelectedRange] = useState('1D');
    const [chartData, setChartData] = useState<number[]>([]);
    const [isChartLoading, setIsChartLoading] = useState(false);

    // Fetch history when stock or range changes
    useEffect(() => {
        const loadHistory = async () => {
            if (!stock) return;
            // Don't show loading on initial load if we have some history, to prevent flickering
            // But valid to show it when switching ranges
            setIsChartLoading(true);
            try {
                const history = await MarketAPI.getHistory(stock.symbol, selectedRange);
                setChartData(history);
            } catch (e) {
                console.error("Failed to load history", e);
                setChartData([]);
            } finally {
                setIsChartLoading(false);
            }
        };
        loadHistory();
    }, [stock, selectedRange]);

    if (!isMounted) return <div className="flex h-screen items-center justify-center animate-pulse text-[var(--muted-foreground)]">{t('loading')}</div>;

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
                    <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-4 gap-4">
                        <div>
                            <div className="text-4xl font-bold tracking-tight">${stock.price.toFixed(2)}</div>
                            <div className={`flex items-center gap-2 mt-1 ${isPositive ? 'text-[var(--primary)]' : 'text-[var(--destructive)]'}`}>
                                {isPositive ? <TrendingUp size={20} /> : <TrendingUp size={20} className="rotate-180" />}
                                <span className="font-semibold">{stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)</span>
                            </div>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-4 sm:pb-0 w-full sm:w-auto px-1 touch-pan-x">
                            {['5m', '15m', '1h', '4h', '1d', '1w', '1m', '1y', '5y', '20y'].map(range => (
                                <button
                                    key={range}
                                    onClick={() => setSelectedRange(range.toUpperCase())}
                                    className={`relative z-10 px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 whitespace-nowrap min-w-[3rem] ${selectedRange === range.toUpperCase()
                                        ? 'bg-[var(--primary)] text-black shadow-lg shadow-[var(--primary)]/20'
                                        : 'bg-[var(--secondary)]/50 text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)] border border-transparent'
                                        }`}
                                >
                                    {t(`ranges.${range}`, { fallback: range.toUpperCase() })}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Render Chart safely only when mounted */}
                    {isMounted && !isChartLoading && chartData.length > 0 ? (
                        <Chart data={chartData} color={isPositive ? "var(--primary)" : "var(--destructive)"} range={selectedRange} />
                    ) : (
                        <div className="h-[400px] flex items-center justify-center text-[var(--muted-foreground)]">
                            {t('loading')}
                        </div>
                    )}
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
