import React, { useMemo } from 'react';
import { Stock } from '@/lib/api';
import { VigilUtils } from '@/lib/vigilUtils';
import { AlertTriangle, TrendingUp, TrendingDown, Shield, Zap, Globe, MessageCircle } from 'lucide-react';

interface GlobalRadarProps {
    stocks: Stock[];
}

export const GlobalRadar = ({ stocks }: GlobalRadarProps) => {
    const report = useMemo(() => VigilUtils.analyzeGlobalMarkets(stocks), [stocks]);

    const getSymbol = (sym: string) => stocks.find(s => s.symbol === sym);
    const tur = getSymbol('TUR');
    const spy = getSymbol('SPY');
    const uup = getSymbol('UUP');
    const nvda = getSymbol('NVDA');

    return (
        <div className={`rounded-xl border p-6 transition-all duration-300 relative overflow-hidden
            ${report.decision === 'SELL' ? 'bg-red-500/5 border-red-500/30' :
                report.decision === 'BUY' ? 'bg-emerald-500/5 border-emerald-500/30' :
                    'bg-[var(--card)] border-[var(--border)]'}
        `}>
            {/* Header */}
            <div className="flex items-start justify-between mb-6 relative z-10">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Globe size={20} className="text-[var(--primary)]" />
                        VIGIL: Küresel Radar
                    </h2>
                    <p className="text-sm text-[var(--muted-foreground)]">
                        New York & Dünya Piyasalarının Anlık Analizi
                    </p>
                </div>

                <div className={`px-4 py-2 rounded-lg font-bold text-sm border shadow-sm flex items-center gap-2
                    ${report.decision === 'BUY' ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' :
                        report.decision === 'SELL' ? 'bg-red-500/20 text-red-500 border-red-500/30' :
                            'bg-gray-500/20 text-gray-500 border-gray-500/30'}
                `}>
                    {report.decision === 'BUY' && <TrendingUp size={16} />}
                    {report.decision === 'SELL' && <TrendingDown size={16} />}
                    {report.decision === 'NEUTRAL' && <Shield size={16} />}
                    {report.decision === 'BUY' ? 'AÇILIŞ POZİTİF' :
                        report.decision === 'SELL' ? 'AÇILIŞ DEFANSİF' : 'NÖTR / İZLE'}
                </div>
            </div>

            {/* Key Indicators Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 relative z-10">
                <IndicatorCard stock={tur} label="Türkiye (TUR)" icon="🇹🇷" />
                <IndicatorCard stock={spy} label="ABD (SPY)" icon="🇺🇸" />
                <IndicatorCard stock={uup} label="Dolar Gücü" icon="💵" inverse />
                <IndicatorCard stock={nvda} label="Risk İştahı" icon="🤖" />

                {/* Social Sentiment Card */}
                <div className="bg-[var(--secondary)]/30 rounded-lg p-3 hover:bg-[var(--secondary)]/50 transition-colors">
                    <div className="text-xs text-[var(--muted-foreground)] mb-1 flex items-center gap-1">
                        <MessageCircle size={12} /> Sosyal Mood
                    </div>
                    <div className="font-mono font-bold text-sm truncate">
                        {report.socialSentiment?.summary?.split(':')[1] || "Nötr"}
                    </div>
                    <div className={`text-xs font-bold flex items-center gap-1 mt-1 
                        ${(report.socialSentiment?.score || 0) > 0 ? 'text-emerald-500' :
                            (report.socialSentiment?.score || 0) < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                        {(report.socialSentiment?.score || 0) > 0 ? "Bullish" : "Bearish"}
                    </div>
                </div>
            </div>

            {/* AI Analysis Message */}
            <div className="bg-[var(--background)]/50 rounded-lg p-4 border border-[var(--border)] relative z-10">
                <h3 className="text-xs font-bold text-[var(--muted-foreground)] uppercase mb-2 flex items-center gap-2">
                    <Zap size={12} />
                    VIGIL AI TAHMİNİ
                </h3>
                <div className="space-y-1">
                    {report.messages.map((msg, idx) => (
                        <div key={idx} className="text-sm font-medium flex items-start gap-2">
                            <span className="text-[var(--primary)] mt-1">•</span>
                            {msg}
                        </div>
                    ))}
                    {report.messages.length === 0 && (
                        <div className="text-sm text-[var(--muted-foreground)] italic">Veri bekleniyor...</div>
                    )}
                </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
                <Globe size={200} />
            </div>
        </div>
    );
};

const IndicatorCard = ({ stock, label, icon, inverse = false }: { stock: Stock | undefined, label: string, icon: string, inverse?: boolean }) => {
    if (!stock) return (
        <div className="bg-[var(--secondary)]/30 rounded-lg p-3 animate-pulse">
            <div className="h-4 w-12 bg-[var(--border)] rounded mb-2"></div>
            <div className="h-6 w-20 bg-[var(--border)] rounded"></div>
        </div>
    );

    const isPositive = stock.change >= 0;
    // For some indicators like Dolar/VIX, rising is bad (red)
    const colorClass = inverse
        ? (isPositive ? 'text-red-500' : 'text-emerald-500')
        : (isPositive ? 'text-emerald-500' : 'text-red-500');

    return (
        <div className="bg-[var(--secondary)]/30 rounded-lg p-3 hover:bg-[var(--secondary)]/50 transition-colors">
            <div className="text-xs text-[var(--muted-foreground)] mb-1 flex items-center gap-1">
                {icon} {label}
            </div>
            <div className="font-mono font-bold text-lg">
                ${stock.price.toFixed(2)}
            </div>
            <div className={`text-xs font-bold flex items-center gap-1 ${colorClass}`}>
                {stock.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                %{Math.abs(stock.changePercent).toFixed(2)}
            </div>
        </div>
    );
};
