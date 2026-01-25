import React, { useMemo, useState, useEffect } from 'react';
import { Stock } from '@/lib/api';
import { VigilUtils } from '@/lib/vigilUtils';
import { SocialSignal, SocialMediaService } from '@/lib/socialMediaService';
import { Radar, Eye, Anchor, Shield, Swords, Skull, Zap, TrendingUp, TrendingDown, Activity, AlertTriangle, Lock } from 'lucide-react';

interface DetectiveDashboardProps {
    stocks: Stock[];
}

export const DetectiveDashboard: React.FC<DetectiveDashboardProps> = ({ stocks }) => {
    const [socialSignals, setSocialSignals] = useState<SocialSignal[]>([]);

    useEffect(() => {
        const leadStock = stocks.find(s => s.symbol === 'TUR') || stocks[0];
        if (leadStock) {
            SocialMediaService.getSocialSignals(leadStock.symbol, leadStock.changePercent).then(signals => {
                setSocialSignals(signals);
            });
        }
    }, [stocks]);

    const report = useMemo(() => VigilUtils.analyzeGlobalMarkets(stocks, socialSignals), [stocks, socialSignals]);

    // Helper for strategy color
    const getStrategyColor = (risk: string) => {
        switch (risk) {
            case 'LOW': return 'text-emerald-400';
            case 'MEDIUM': return 'text-yellow-400';
            case 'HIGH': return 'text-orange-500';
            case 'EXTREME': return 'text-red-500';
            default: return 'text-gray-400';
        }
    };

    const getStrategyIcon = (decision: string) => {
        switch (decision) {
            case 'BUY': return <Swords size={32} className="text-emerald-400" />;
            case 'SELL': return <Shield size={32} className="text-red-500" />;
            default: return <Eye size={32} className="text-yellow-400" />;
        }
    };

    const getAlertLabel = (type: string) => {
        switch (type) {
            case 'ICEBERG': return 'BUZDAĞI';
            case 'DARK_ROOM': return 'KARANLIK ODA';
            case 'UNUSUAL_VOLUME': return 'ANORMAL HACİM';
            case 'SPOOFING': return 'ALDATMACA';
            default: return type;
        }
    };

    const getRiskLabel = (risk: string) => {
        switch (risk) {
            case 'LOW': return 'DÜŞÜK';
            case 'MEDIUM': return 'ORTA';
            case 'HIGH': return 'YÜKSEK';
            case 'EXTREME': return 'KRİTİK';
            default: return risk;
        }
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">

            {/* 1. STRATEGY PREDICTION TERMINAL */}
            <div className="bg-black/40 border border-[var(--primary)]/30 rounded-xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-[var(--primary)] group-hover:w-2 transition-all" />
                <div className="absolute top-2 right-2 flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[var(--muted-foreground)] animate-pulse">VIGIL SİSTEMİ AKTİF</span>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="p-4 bg-[var(--background)] rounded-full border border-[var(--border)] shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                        {getStrategyIcon(report.decision)}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-sm font-mono text-[var(--muted-foreground)] mb-1">STRATEJİK KARAR</h2>
                        <div className={`text-2xl font-black tracking-tighter ${getStrategyColor(report.riskLevel)}`}>
                            {report.strategy.split(':')[0]}
                        </div>
                        <p className="text-sm text-[var(--foreground)] mt-2 font-mono border-l-2 border-[var(--border)] pl-3 opacity-80">
                            {report.strategy.split(':')[1]}
                        </p>
                    </div>
                    <div className="text-right hidden md:block">
                        <div className="text-xs text-[var(--muted-foreground)]">RİSK SEVİYESİ</div>
                        <div className={`text-xl font-bold ${getStrategyColor(report.riskLevel)}`}>
                            {getRiskLabel(report.riskLevel)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 2. GLOBAL EYE (KÜRESEL GÖZ) */}
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 shadow-lg">
                    <div className="flex items-center gap-2 mb-4 border-b border-[var(--border)] pb-2">
                        <Eye size={18} className="text-blue-400" />
                        <h3 className="font-bold text-lg text-blue-100">KÜRESEL GÖZ</h3>
                    </div>
                    <div className="space-y-3">
                        {/* TUR */}
                        <div className="flex justify-between items-center p-2 bg-[var(--secondary)]/20 rounded">
                            <span className="font-mono font-bold text-sm">TUR (Turkey ETF)</span>
                            <span className={`text-sm font-bold ${(stocks.find(s => s.symbol === 'TUR')?.changePercent || 0) < -1.5 ? 'text-red-500' :
                                (stocks.find(s => s.symbol === 'TUR')?.changePercent || 0) > 1.5 ? 'text-green-500' : 'text-gray-400'
                                }`}>
                                %{stocks.find(s => s.symbol === 'TUR')?.changePercent.toFixed(2)}
                            </span>
                        </div>
                        {/* VIX */}
                        <div className="flex justify-between items-center p-2 bg-[var(--secondary)]/20 rounded">
                            <span className="font-mono font-bold text-sm">VIX (Korku Endeksi)</span>
                            <span className={`text-sm font-bold ${(stocks.find(s => s.symbol === 'VIX')?.price || 0) > 20 ? 'text-red-500' : 'text-green-500'
                                }`}>
                                {stocks.find(s => s.symbol === 'VIX')?.price.toFixed(2)}
                            </span>
                        </div>
                        {/* Messages Feed */}
                        <div className="mt-4 max-h-[150px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                            {report.messages.map((msg, i) => (
                                <div key={i} className="text-xs p-2 rounded bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)] font-mono">
                                    {msg}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. WHALE RADAR (BALİNA AVI) */}
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 shadow-lg">
                    <div className="flex items-center gap-2 mb-4 border-b border-[var(--border)] pb-2">
                        <Anchor size={18} className="text-purple-400" />
                        <h3 className="font-bold text-lg text-purple-100">BALİNA RADARI (Whale Hunter)</h3>
                    </div>

                    {report.whaleAlerts.length > 0 ? (
                        <div className="space-y-3">
                            {report.whaleAlerts.map((alert, idx) => (
                                <div key={idx} className="relative overflow-hidden p-3 bg-purple-900/10 border border-purple-500/30 rounded-lg hover:bg-purple-900/20 transition-colors">
                                    <div className="absolute top-0 left-0 w-0.5 h-full bg-purple-500" />
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            {alert.type === 'ICEBERG' && <TrendingUp size={14} className="text-emerald-400" />}
                                            {alert.type === 'DARK_ROOM' && <Lock size={14} className="text-gray-400" />}
                                            {alert.type === 'UNUSUAL_VOLUME' && <Activity size={14} className="text-yellow-400" />}
                                            <span className="font-bold text-sm text-[var(--foreground)]">{alert.symbol}</span>
                                            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                                                {getAlertLabel(alert.type)}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-[var(--muted-foreground)] font-mono">{alert.timestamp}</span>
                                    </div>
                                    <p className="text-xs text-[var(--muted-foreground)]">
                                        {alert.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[180px] text-[var(--muted-foreground)]">
                            <Radar size={40} className="mb-2 opacity-20 animate-spin-slow" />
                            <p className="text-sm">Taramaya devam ediliyor...</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
