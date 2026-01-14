"use client";

import { Stock } from "@/lib/api";
import { Link } from "@/i18n/routing";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { useMemo } from "react";

interface StockCardProps {
    stock: Stock;
}

export default function StockCard({ stock }: StockCardProps) {
    const isPositive = stock.change >= 0;

    const chartData = useMemo(() => {
        return stock.history.map((val, i) => ({ i, value: val }));
    }, [stock.history]);

    return (
        <Link href={`/stock/${stock.symbol}`} className="block">
            <div className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition-all hover:border-[var(--primary)]/50 hover:shadow-[0_0_20px_-5px_var(--primary)] cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-lg text-[var(--foreground)]">{stock.symbol}</h3>
                        <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider">{stock.name}</p>
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-[var(--primary)]' : 'text-[var(--destructive)]'}`}>
                        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        <span>{stock.changePercent.toFixed(2)}%</span>
                    </div>
                </div>

                <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
                        {stock.currency === 'TRY' ? '₺' : '$'}{stock.price.toFixed(2)}
                    </div>

                    {/* Sparkline */}
                    <div className="h-10 w-24 opacity-50 transition-opacity group-hover:opacity-100">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                {/* Min/Max domain to make the chart look dynamic */}
                                <YAxis domain={['dataMin', 'dataMax']} hide />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke={isPositive ? "var(--primary)" : "var(--destructive)"}
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Background glow effect */}
                <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl transition-opacity opacity-0 group-hover:opacity-10 ${isPositive ? 'bg-[var(--primary)]' : 'bg-[var(--destructive)]'}`}></div>
            </div>
        </Link>
    );
}
