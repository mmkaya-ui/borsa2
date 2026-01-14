"use client";

import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ChartProps {
    data: number[];
    color?: string;
    range?: string;
}

export default function Chart({ data, color = "var(--primary)", range = "1D" }: ChartProps) {
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];

        const now = new Date();
        const endTime = now.getTime();
        const r = range.toUpperCase().trim();

        // Determine duration in milliseconds based on range
        let durationMs = 24 * 60 * 60 * 1000; // Default 1D
        let isIntraday = false;

        switch (r) {
            case '5M': durationMs = 5 * 60 * 1000; isIntraday = true; break;
            case '15M': durationMs = 15 * 60 * 1000; isIntraday = true; break;
            case '1H': durationMs = 60 * 60 * 1000; isIntraday = true; break;
            case '4H': durationMs = 4 * 60 * 60 * 1000; isIntraday = true; break;
            case '1D': durationMs = 9 * 60 * 60 * 1000; isIntraday = true; break; // Market Day (9h)
            case '1W': durationMs = 7 * 24 * 60 * 60 * 1000; break;
            case '1M': durationMs = 30 * 24 * 60 * 60 * 1000; break;
            case '1Y': durationMs = 365 * 24 * 60 * 60 * 1000; break;
            case '5Y': durationMs = 5 * 365 * 24 * 60 * 60 * 1000; break;
            case '20Y': durationMs = 20 * 365 * 24 * 60 * 60 * 1000; break;
        }

        const startTime = endTime - durationMs;
        const totalPoints = data.length;

        return data.map((val, i) => {
            // Calculate exact timestamp for this point
            // We assume equal spacing between points
            const pointTimeMs = startTime + (i / (totalPoints - 1 || 1)) * durationMs;
            const pointDate = new Date(pointTimeMs);
            let label = "";

            if (isIntraday) {
                // For intraday, show HH:mm
                label = pointDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
            } else if (r === '1W' || r === '1M') {
                // For short term history, show Day Month (e.g. 14 Jan)
                label = pointDate.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
            } else {
                // For long term, show Month Year (e.g. Jan 24)
                label = pointDate.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
            }

            return {
                time: i,
                value: val,
                formattedTime: label
            };
        });
    }, [data, range]);

    if (!data || data.length === 0) {
        return (
            <div className="h-[400px] w-full mt-4 flex items-center justify-center text-[var(--muted-foreground)] border border-dashed border-[var(--border)] rounded-xl">
                No data available
            </div>
        );
    }

    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const padding = (maxValue - minValue) * 0.1 || 1; // Default padding if flat line

    return (
        <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis
                        dataKey="formattedTime"
                        stroke="var(--muted-foreground)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        domain={[minValue - padding, maxValue + padding]}
                        stroke="var(--muted-foreground)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val) => `$${val.toFixed(2)}`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--card)',
                            borderColor: 'var(--border)',
                            color: 'var(--foreground)',
                            borderRadius: '8px'
                        }}
                        itemStyle={{ color: 'var(--foreground)' }}
                        labelStyle={{ color: 'var(--muted-foreground)' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
