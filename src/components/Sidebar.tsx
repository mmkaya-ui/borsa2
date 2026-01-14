"use client";

import { usePathname, Link } from "@/i18n/routing";
import { BarChart3, Wallet, Search, Settings, User } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Sidebar() {
    const pathname = usePathname(); // This hook from @/i18n/routing returns path WITHOUT locale prefix
    const t = useTranslations('Navigation');

    const navItems = [
        { name: t('markets'), href: "/", icon: BarChart3 },
        { name: t('portfolio'), href: "/portfolio", icon: Wallet },
        { name: t('analysis'), href: "/analysis", icon: Search },
        { name: t('settings'), href: "/settings", icon: Settings },
    ];

    return (
        <aside className="fixed left-0 top-0 z-[90] hidden h-screen w-64 border-r border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-2xl transition-transform sm:flex sm:translate-x-0 overflow-y-auto">
            <div className="flex h-full flex-col px-3 py-4">
                <div className="mb-6 flex items-center pl-2.5">
                    <span className="self-center whitespace-nowrap text-2xl font-semibold text-[var(--foreground)] tracking-tight">
                        <span className="text-[var(--primary)]">B</span>orsa
                    </span>
                </div>
                <ul className="space-y-2 font-medium">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`group flex items-center rounded-lg p-2 transition-colors ${isActive
                                        ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                                        : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
                                        }`}
                                >
                                    <item.icon className={`h-5 w-5 ${isActive ? "text-[var(--primary)]" : "text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]"}`} />
                                    <span className="ml-3">{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <div className="mt-auto border-t border-[var(--border)] pt-4">
                    {/* User Profile Placeholder */}
                    <div className="flex items-center gap-3 px-2 py-2 text-[var(--muted-foreground)] hover:bg-[var(--secondary)] rounded-lg cursor-pointer transition-colors">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--secondary)] text-[var(--foreground)]">
                            <User size={16} />
                        </div>
                        <div className="text-sm">
                            <p className="font-medium text-[var(--foreground)]">Investor</p>
                            <p className="text-xs text-[var(--primary)]">Premium Plan</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
