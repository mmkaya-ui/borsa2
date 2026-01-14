"use client";

import { useEffect } from "react";
import { useMarketStore } from "@/store/marketStore";
import StockCard from "@/components/StockCard";
import { useTranslations } from "next-intl";

export default function Home() {
  const { stocks, isLoading, fetchStocks, startLiveUpdates } = useMarketStore();
  const t = useTranslations('Dashboard');

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

      {isLoading && stocks.length === 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-40 rounded-xl border border-[var(--border)] bg-[var(--card)] animate-pulse"></div>
          ))}
          <div className="col-span-full text-center text-[var(--muted-foreground)]">{t('loading')}</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {stocks.map((stock) => (
            <StockCard key={stock.symbol} stock={stock} />
          ))}
        </div>
      )}
    </div>
  );
}
