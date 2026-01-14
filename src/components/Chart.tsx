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

        return data.map((val, i) => {
            let label = "";
            const totalPoints = data.length;

            // Normalize range to ensure matching works
            const r = range.toUpperCase().trim();

            // Generate mock labels based on range
            if (['1D', '1H', '5M', '4H', '15M'].includes(r)) {
                // Time based
                const hour = Math.floor(9 + (i / totalPoints) * 8); // Market hours 9-17
                const minute = Math.floor((i % 4) * 15).toString().padStart(2, '0');
                label = `${hour}:${minute}`;
            } else if (['1W', '1M'].includes(r)) {
                // Date based (Days)
                const date = new Date();
                date.setDate(date.getDate() - (totalPoints - i));
                label = date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
            } else {
                // Year based (Months/Years)
                const date = new Date();
                date.setMonth(date.getMonth() - Math.floor((totalPoints - i) / 2)); // Approximate
                label = date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
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
