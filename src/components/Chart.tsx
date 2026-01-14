"use client";

import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ChartProps {
    data: number[];
    color?: string;
}

export default function Chart({ data, color = "var(--primary)" }: ChartProps) {
    const chartData = useMemo(() => {
        return data.map((val, i) => ({
            time: i,
            value: val,
            formattedTime: `${i}:00` // Placeholder time
        }));
    }, [data]);

    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const padding = (maxValue - minValue) * 0.1;

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
