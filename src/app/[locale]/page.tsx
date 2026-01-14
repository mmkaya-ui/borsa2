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

      {/* Sortable Header */}
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
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-[var(--border)] bg-[var(--secondary)]/30 text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
          <button
            className="col-span-4 flex items-center gap-2 cursor-pointer hover:text-[var(--foreground)] transition-colors text-left"
            onClick={() => handleSort('symbol')}
          >
            {t('table.symbol')} <SortIcon column="symbol" />
          </button>
          <button
            className="col-span-3 text-right flex items-center justify-end gap-2 cursor-pointer hover:text-[var(--foreground)] transition-colors"
            onClick={() => handleSort('price')}
          >
            {t('table.price')} <SortIcon column="price" />
          </button>
          <button
            className="col-span-3 text-right flex items-center justify-end gap-2 cursor-pointer hover:text-[var(--foreground)] transition-colors"
            onClick={() => handleSort('change')}
          >
            {t('table.change')} <SortIcon column="change" />
          </button>
          <button
            className="col-span-2 text-right flex items-center justify-end gap-2 cursor-pointer hover:text-[var(--foreground)] transition-colors"
            onClick={() => handleSort('volume')}
          >
            {t('table.volume')} <SortIcon column="volume" />
          </button>
        </div>

        {isLoading && stocks.length === 0 ? (
          <div className="p-8 text-center text-[var(--muted-foreground)] animate-pulse">{t('loading')}</div>
        ) : (
          <div className="flex flex-col max-h-[600px] overflow-y-auto custom-scrollbar">
            {sortedMarket.slice(0, 50).map((stock) => (
              <Link href={`/stock/${stock.symbol}`} key={stock.symbol} className="grid grid-cols-12 gap-4 p-4 hover:bg-[var(--secondary)]/50 transition-colors border-b border-[var(--border)] last:border-0 items-center">
                <div className="col-span-4">
                  <div className="font-bold text-sm text-[var(--foreground)]">{stock.symbol}</div>
                  <div className="text-xs text-[var(--muted-foreground)] truncate hidden sm:block">{stock.name}</div>
                </div>
                <div className="col-span-3 text-right font-mono text-sm">
                  {stock.currency === 'TRY' ? '₺' : '$'}{stock.price.toFixed(2)}
                </div>
                <div className={`col-span-3 text-right font-bold text-xs ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </div>
                <div className="col-span-2 text-right text-xs text-[var(--muted-foreground)] font-mono">
                  {(stock.volume / 1000).toFixed(1)}K
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
