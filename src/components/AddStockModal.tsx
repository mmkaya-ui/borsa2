"use client";

import { useState } from "react";
// Removed shadcn imports to avoid dependency issues
import { Search, Plus, X } from "lucide-react";
import { useMarketStore } from "@/store/marketStore";



import { MarketAPI } from "@/lib/api";
import { useEffect } from "react";

export default function AddStockModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { addHolding } = useMarketStore();
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedExchange, setSelectedExchange] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [selectedStock, setSelectedStock] = useState<any>(null);

    // Initial load and Search Effect
    useEffect(() => {
        if (!isOpen) return;

        const search = async () => {
            // If valid search, search. Else show popular/all.
            const results = await MarketAPI.searchStocks(searchQuery);
            setSearchResults(results);
        };

        const debounce = setTimeout(search, 300);
        return () => clearTimeout(debounce);
    }, [searchQuery, isOpen]);

    const handleSelectStock = (stock: any) => {
        setSelectedStock(stock);
        setStep(2);
    };

    const handleAdd = () => {
        if (selectedStock) {
            addHolding(selectedStock.symbol, quantity, selectedStock.price);
            onClose();
            // Reset
            setStep(1);
            setSelectedStock(null);
            setQuantity(1);
            setSelectedExchange(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-md bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-4 border-b border-[var(--border)]">
                    <h2 className="font-semibold text-lg">{step === 1 ? 'Hisse Seç' : 'Yatırım Detayları'}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-[var(--secondary)] rounded-full transition-colors">
                        <X size={20} className="text-[var(--muted-foreground)]" />
                    </button>
                </div>

                <div className="p-4 overflow-y-auto">
                    {step === 1 && (
                        <div className="space-y-4">
                            {/* Search Input */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
                                <input
                                    type="text"
                                    placeholder="Hisse ara (Örn: THYAO, Apple...)"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-[var(--secondary)]/50 border border-[var(--border)] rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 ring-[var(--primary)]/50 transition-all text-sm font-medium"
                                />
                            </div>

                            {/* Exchange Filter */}
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {['ALL', 'BIST', 'NASDAQ', 'CRYPTO'].map(ex => (
                                    <button
                                        key={ex}
                                        onClick={() => setSelectedExchange(ex === 'ALL' ? null : ex)}
                                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${(selectedExchange === ex) || (ex === 'ALL' && selectedExchange === null)
                                            ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                                            : 'bg-[var(--secondary)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)]/80'
                                            }`}
                                    >
                                        {ex === 'ALL' ? 'Tümü' : ex}
                                    </button>
                                ))}
                            </div>

                            {/* Stock List */}
                            <div className="space-y-2 h-[300px] overflow-y-auto pr-1">
                                {searchResults
                                    .filter(s => !selectedExchange || s.exchange === selectedExchange)
                                    .map(stock => (
                                        <div
                                            key={stock.symbol}
                                            onClick={() => handleSelectStock(stock)}
                                            className="flex justify-between items-center p-3 rounded-lg hover:bg-[var(--secondary)] cursor-pointer transition-colors border border-transparent hover:border-[var(--border)] group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[var(--secondary)] group-hover:bg-[var(--card)] flex items-center justify-center font-bold text-[10px] text-[var(--muted-foreground)] transition-colors">
                                                    {stock.symbol.substring(0, 2)}
                                                </div>
                                                <div>
                                                    <div className="font-bold flex items-center gap-2">
                                                        {stock.symbol}
                                                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)]">
                                                            {stock.exchange}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-[var(--muted-foreground)] line-clamp-1">{stock.name}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-mono font-medium">
                                                    {stock.currency === 'TRY' ? '₺' : '$'}{stock.price.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                {searchResults.length === 0 && (
                                    <div className="text-center py-10 text-[var(--muted-foreground)] text-sm">
                                        Sonuç bulunamadı.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 2 && selectedStock && (
                        <div className="space-y-6 animate-in slide-in-from-right-4">
                            <div className="flex items-center justify-between bg-[var(--secondary)]/30 p-4 rounded-lg border border-[var(--border)]">
                                <div>
                                    <h3 className="text-xl font-bold">{selectedStock.symbol}</h3>
                                    <p className="text-[var(--muted-foreground)]">{selectedStock.name}</p>
                                </div>
                                <div className="text-2xl font-mono">
                                    {selectedStock.currency === 'TRY' ? '₺' : '$'}{selectedStock.price}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--muted-foreground)]">Adet (Lot)</label>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 flex items-center justify-center rounded-xl border border-[var(--border)] hover:bg-[var(--secondary)] transition-colors text-xl font-bold"
                                    >
                                        -
                                    </button>
                                    <div className="flex-1 text-center font-mono text-3xl font-bold">
                                        {quantity}
                                    </div>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-12 h-12 flex items-center justify-center rounded-xl border border-[var(--border)] hover:bg-[var(--secondary)] transition-colors text-xl font-bold"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-[var(--border)] flex justify-between items-center">
                                <span className="text-[var(--muted-foreground)]">Toplam Tutar:</span>
                                <span className="text-xl font-bold text-[var(--primary)]">
                                    {selectedStock.currency === 'TRY' ? '₺' : '$'}{(selectedStock.price * quantity).toLocaleString()}
                                </span>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-3 rounded-xl border border-[var(--border)] hover:bg-[var(--secondary)] transition-colors font-medium"
                                >
                                    Geri
                                </button>
                                <button
                                    onClick={handleAdd}
                                    className="flex-1 py-3 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition-opacity font-bold"
                                >
                                    Portföye Ekle
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
