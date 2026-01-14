"use client";

import { useState } from "react";
// Removed shadcn imports to avoid dependency issues
import { Search, Plus, X } from "lucide-react";
import { useMarketStore } from "@/store/marketStore";

// Mock available stocks for selection - In real app, this would be an API search
const AVAILABLE_STOCKS = [
    { symbol: "THYAO", name: "Türk Hava Yolları", exchange: 'BIST', price: 280 },
    { symbol: "GARAN", name: "Garanti BBVA", exchange: 'BIST', price: 65 },
    { symbol: "ASELS", name: "Aselsan", exchange: 'BIST', price: 45 },
    { symbol: "EREGL", name: "Ereğli Demir Çelik", exchange: 'BIST', price: 42 },
    { symbol: "KCHOL", name: "Koç Holding", exchange: 'BIST', price: 140 },
    { symbol: "AAPL", name: "Apple Inc.", exchange: 'NASDAQ', price: 150 },
    { symbol: "GOOGL", name: "Alphabet Inc.", exchange: 'NASDAQ', price: 2800 },
    { symbol: "TSLA", name: "Tesla, Inc.", exchange: 'NASDAQ', price: 700 },
    { symbol: "BTC-USD", name: "Bitcoin USD", exchange: 'CRYPTO', price: 45000 },
    { symbol: "ETH-USD", name: "Ethereum USD", exchange: 'CRYPTO', price: 3000 },
];

export default function AddStockModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { addHolding } = useMarketStore();
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedExchange, setSelectedExchange] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedStock, setSelectedStock] = useState<typeof AVAILABLE_STOCKS[0] | null>(null);

    const handleSelectExchange = (exchange: string) => {
        setSelectedExchange(exchange);
        // In a real app, you might trigger a fetch here.
    };

    const handleSelectStock = (stock: typeof AVAILABLE_STOCKS[0]) => {
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
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
                            {/* Exchange Filter */}
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {['ALL', 'BIST', 'NASDAQ', 'CRYPTO'].map(ex => (
                                    <button
                                        key={ex}
                                        onClick={() => setSelectedExchange(ex === 'ALL' ? null : ex)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${(selectedExchange === ex) || (ex === 'ALL' && selectedExchange === null)
                                            ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                                            : 'bg-[var(--secondary)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)]/80'
                                            }`}
                                    >
                                        {ex === 'ALL' ? 'Tümü' : ex}
                                    </button>
                                ))}
                            </div>

                            {/* Stock List */}
                            <div className="space-y-2">
                                {AVAILABLE_STOCKS
                                    .filter(s => !selectedExchange || s.exchange === selectedExchange)
                                    .map(stock => (
                                        <div
                                            key={stock.symbol}
                                            onClick={() => handleSelectStock(stock)}
                                            className="flex justify-between items-center p-3 rounded-lg hover:bg-[var(--secondary)]/50 cursor-pointer transition-colors border border-transparent hover:border-[var(--border)]"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[var(--secondary)] flex items-center justify-center font-bold text-xs text-[var(--muted-foreground)]">
                                                    {stock.symbol.substring(0, 2)}
                                                </div>
                                                <div>
                                                    <div className="font-bold">{stock.symbol}</div>
                                                    <div className="text-xs text-[var(--muted-foreground)]">{stock.name}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-mono">${stock.price}</div>
                                                <div className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--secondary)] text-[var(--muted-foreground)] inline-block">
                                                    {stock.exchange}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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
                                <div className="text-2xl font-mono">${selectedStock.price}</div>
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
                                    ${(selectedStock.price * quantity).toLocaleString()}
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
