"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useMarketStore } from "@/store/marketStore";
import StockCard from "@/components/StockCard";
import { useTranslations } from "next-intl";
import { useMarketAnalysis } from "@/hooks/useMarketAnalysis";
import { ArrowUp, ArrowDown, ArrowUpDown, Activity } from "lucide-react";

export default function Home() {
  const { stocks, isLoading, fetchStocks, startLiveUpdates } = useMarketStore();
  const t = useTranslations('Dashboard');

  const {
    sortedMarket,
    sortConfig,
    handleSort,
    selectedExchange,
    setSelectedExchange
  } = useMarketAnalysis();

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig.key !== column) return <ArrowUpDown size={12} className="opacity-30" />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={12} className="text-[var(--primary)]" /> : <ArrowDown size={12} className="text-[var(--primary)]" />;
  };


  useEffect(() => {
    // Optimization: Only fetch if data is missing
    if (stocks.length === 0) {
      fetchStocks();
    }
    const unsubscribe = startLiveUpdates();
    return () => unsubscribe();
  }, [fetchStocks, startLiveUpdates, stocks.length]);

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)]">
          {t('title')}
        </h1>
        <p className="text-[var(--muted-foreground)]">
          {t('subtitle')}
        </p>
      </header>

      {/* Sortable Header & Filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1 bg-[var(--secondary)]/30 p-1 rounded-lg">
          {['ALL', 'BIST', 'NASDAQ', 'CRYPTO'].map(ex => (
            <button
              key={ex}
              onClick={() => setSelectedExchange(ex)}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${selectedExchange === ex
                ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
            >
              {ex}
            </button>
          ))}
        </div>

        {/* Sort Toggle */}
        <button
          onClick={() => handleSort('symbol')}
          className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold transition-colors ${sortConfig.key === 'symbol' ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'hover:bg-[var(--secondary)] text-[var(--muted-foreground)]'}`}
        >
          <ArrowUpDown size={14} />
          {t('table.symbol')} {sortConfig.key === 'symbol' && (sortConfig.direction === 'asc' ? '(A-Z)' : '(Z-A)')}
        </button>
      </div>

      {isLoading && stocks.length === 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-40 rounded-xl border border-[var(--border)] bg-[var(--card)] animate-pulse"></div>
          ))}
          <div className="col-span-full text-center text-[var(--muted-foreground)]">{t('loading')}</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedMarket.slice(0, 50).map((stock) => (
            <StockCard key={stock.symbol} stock={stock} />
          ))}
        </div>
      )}
    </div>
  );
}
