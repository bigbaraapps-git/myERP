"use client";

import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    UserCircle,
    FileSpreadsheet,
    FileText,
    Settings,
    LogOut,
    PlusCircle,
    TrendingUp,
    Shield
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Sidebar() {
    const pathname = usePathname();
    const [user, setUser] = useState<any>({ name: "Demo Korisnik", company: { name: "Primjer d.o.o." }, role: "ADMIN" });

    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

    return (
        <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-[280px] bg-card border-r border-border flex flex-col z-20 h-screen shrink-0"
        >
            <div className="h-16 flex items-center px-6 border-b border-border">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                        <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-foreground">my<span className="text-brand-600">ERP</span></span>
                </Link>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
                <NavItem icon={<LayoutDashboard />} label="Nadzorna Ploča" active={pathname === '/'} href="/" />

                <div className="pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    Poslovanje
                </div>
                <NavItem icon={<Users />} label="Klijenti" active={pathname.startsWith('/klijenti')} href="/klijenti" />
                <NavItem icon={<FileSpreadsheet />} label="Ponude" active={pathname.startsWith('/ponude')} href="/ponude" />
                <NavItem icon={<FileText />} label="Računi" active={pathname.startsWith('/racuni')} href="/racuni" />

                <div className="pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    Resursi
                </div>
                <NavItem icon={<UserCircle />} label="Zaposlenici" active={pathname.startsWith('/zaposlenici')} href="/zaposlenici" />

                <div className="pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    Sustav
                </div>
                <NavItem icon={<Settings />} label="Postavke" active={pathname === '/postavke'} href="/postavke" />
                {user?.role === 'SUPERADMIN' && (
                    <NavItem icon={<Shield className="w-4 h-4 text-violet-400" />} label="Super Admin" active={pathname.startsWith('/superadmin')} href="/superadmin" />
                )}
            </nav>

            <div className="p-4 mt-auto border-t border-border bg-card/50">
                <div className="flex items-center gap-3 px-2 py-2">
                    <div className="w-9 h-9 rounded-full bg-accent border border-border flex items-center justify-center font-medium text-foreground">
                        {userInitial}
                    </div>
                    <div className="flex flex-col flex-1 truncate">
                        <span className="text-sm font-semibold text-foreground truncate">{user.name}</span>
                        <span className="text-xs text-muted-foreground truncate">{user.company.name}</span>
                    </div>
                    <button className="text-muted-foreground hover:text-rose-500 transition-colors p-2 hover:bg-rose-500/10 rounded-md">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.aside>
    );
}

function NavItem({ icon, label, active, href, badge }: any) {
    return (
        <Link
            href={href}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${active
                ? 'nav-item-active'
                : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
                }`}
        >
            <div className={`w-5 h-5 flex items-center justify-center ${active ? 'text-brand-600' : 'text-muted-foreground/80'}`}>
                {icon}
            </div>
            <span className="text-sm">{label}</span>
            {badge && (
                <span className="ml-auto text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-400 px-1.5 py-0.5 rounded-sm">
                    {badge}
                </span>
            )}
        </Link>
    );
}
