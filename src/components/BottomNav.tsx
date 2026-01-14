"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Wallet, Search, Settings } from "lucide-react";

const navItems = [
    { name: "Markets", href: "/", icon: BarChart3 },
    { name: "Portfolio", href: "/portfolio", icon: Wallet },
    { name: "Analysis", href: "/analysis", icon: Search },
    { name: "Settings", href: "/settings", icon: Settings },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] sm:hidden">
            <div className="flex h-16 items-center justify-around">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center justify-center gap-1 p-2 transition-colors ${isActive
                                    ? "text-[var(--primary)]"
                                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                                }`}
                        >
                            <item.icon className={`h-6 w-6 ${isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"}`} />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
