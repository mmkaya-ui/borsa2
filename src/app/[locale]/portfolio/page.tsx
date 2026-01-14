"use client";

import { useMarketStore } from "@/store/marketStore";
import { useEffect, useState } from "react";
import StockCard from "@/components/StockCard";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import AddStockModal from "@/components/AddStockModal";

export default function Portfolio() {
    const { stocks, fetchStocks, isLoading, holdings } = useMarketStore();
    const t = useTranslations('Portfolio');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        if (stocks.length === 0) {
            fetchStocks();
        }
    }, [stocks.length, fetchStocks]);

    const portfolioValue = holdings.reduce((acc, holding) => {
        const stock = stocks.find(s => s.symbol === holding.symbol);
        return acc + (stock ? stock.price * holding.quantity : 0);
    }, 0);

    const totalCost = holdings.reduce((acc, holding) => acc + (holding.buyPrice * holding.quantity), 0);
    const totalGain = portfolioValue - totalCost;
    const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)]">
                        {t('title')}
                    </h1>
                    <p className="text-[var(--muted-foreground)]">
                        {t('subtitle')}
                    </p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                    <Plus size={20} />
                    {t('add')}
                </button>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
                    <p className="text-[var(--muted-foreground)] mb-1">{t('balance')}</p>
                    <h2 className="text-3xl font-bold">${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
                    <p className="text-[var(--muted-foreground)] mb-1">{t('invested')}</p>
                    <h2 className="text-3xl font-bold">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
                    <p className="text-[var(--muted-foreground)] mb-1">{t('profit')}</p>
                    <div className={`text-3xl font-bold ${totalGain >= 0 ? 'text-[var(--primary)]' : 'text-[var(--destructive)]'}`}>
                        {totalGain >= 0 ? '+' : ''}{totalGain.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <span className="text-lg ml-2 font-medium">
                            ({totalGainPercent.toFixed(2)}%)
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {holdings.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-[var(--muted-foreground)] border border-dashed border-[var(--border)] rounded-xl">
                        {t('empty')}
                    </div>
                ) : (
                    holdings.map(holding => {
                        const stock = stocks.find(s => s.symbol === holding.symbol);
                        if (!stock) return null;

                        return (
                            <div key={holding.symbol} className="relative">
                                <StockCard stock={stock} />
                                <div className="absolute top-0 right-0 p-2 bg-[var(--card)] rounded-bl-xl border-l border-b border-[var(--border)] text-xs font-medium text-[var(--muted-foreground)] z-10 shadow-sm">
                                    {holding.quantity} {t('shares')}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            {/* Modal */}
            <AddStockModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        </div>
    );
}
