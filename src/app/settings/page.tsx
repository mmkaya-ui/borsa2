"use client";

import { useMarketStore } from "@/store/marketStore";
import { Trash2, Smartphone, Moon } from "lucide-react";

export default function Settings() {
    const { resetPortfolio } = useMarketStore();

    return (
        <div className="max-w-2xl mx-auto flex flex-col gap-8">
            <header>
                <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)]">
                    Settings
                </h1>
                <p className="text-[var(--muted-foreground)]">
                    Manage your preferences and data.
                </p>
            </header>

            <div className="space-y-6">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
                    <div className="flex items-center gap-3 mb-4 text-[var(--foreground)]">
                        <Moon size={20} />
                        <h2 className="text-xl font-bold">Appearance</h2>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Dark Mode</p>
                            <p className="text-sm text-[var(--muted-foreground)]">System default is currently active.</p>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-[var(--secondary)] text-sm text-[var(--muted-foreground)]">
                            Auto
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
                    <div className="flex items-center gap-3 mb-4 text-[var(--destructive)]">
                        <Trash2 size={20} />
                        <h2 className="text-xl font-bold">Data Management</h2>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Reset Portfolio</p>
                            <p className="text-sm text-[var(--muted-foreground)]">Clear all your current holdings.</p>
                        </div>
                        <button
                            onClick={() => {
                                if (confirm('Are you sure you want to delete all holdings?')) {
                                    resetPortfolio();
                                }
                            }}
                            className="px-4 py-2 rounded-lg bg-[var(--destructive)]/10 text-[var(--destructive)] hover:bg-[var(--destructive)] hover:text-white transition-colors font-medium"
                        >
                            Clear Data
                        </button>
                    </div>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
                    <div className="flex items-center gap-3 mb-4 text-[var(--primary)]">
                        <Smartphone size={20} />
                        <h2 className="text-xl font-bold">App Info</h2>
                    </div>
                    <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
                        <div className="flex justify-between">
                            <span>Version</span>
                            <span>1.0.0 (Beta)</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Build</span>
                            <span>2026.1.14</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-[var(--border)] text-center">
                            <p>Borsa PWA - Premium Market Analysis</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
