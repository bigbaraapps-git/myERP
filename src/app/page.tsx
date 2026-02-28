"use client";

import { Sidebar } from "@/components/sidebar";
import { Users, FileText, CheckCircle2, TrendingUp, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
    const [stats, setStats] = useState({ clients: 0, offers: 0, invoices: 0, pendingInvoices: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/dashboard")
            .then(res => res.json())
            .then(data => {
                if (!data.error) setStats(data);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />

            <main className="flex-1 overflow-y-auto p-8 relative">
                <header className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Nadzorna Ploča</h1>
                        <p className="text-muted-foreground">Dobrodošli! Pregled poslovanja i brze akcije.</p>
                    </div>
                </header>

                <div className="grid gap-6 md:grid-cols-4 mb-8">
                    <StatCard
                        title="Klijenti"
                        value={loading ? "-" : stats.clients}
                        icon={<Users className="w-5 h-5 text-brand-600" />}
                        trend="+12%"
                        trendUp={true}
                    />
                    <StatCard
                        title="Izdane Ponude"
                        value={loading ? "-" : stats.offers}
                        icon={<FileText className="w-5 h-5 text-amber-500" />}
                        trend="+5%"
                        trendUp={true}
                    />
                    <StatCard
                        title="Izvršeni Računi"
                        value={loading ? "-" : stats.invoices}
                        icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                        trend="+18%"
                        trendUp={true}
                    />
                    <StatCard
                        title="Nepovezani JIR"
                        value={loading ? "-" : stats.pendingInvoices}
                        icon={<Briefcase className="w-5 h-5 text-rose-500" />}
                        trend="-2%"
                        trendUp={false}
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="glass-card p-6 min-h-[300px] flex flex-col items-center justify-center text-center">
                        <TrendingUp className="w-12 h-12 text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Graf Prihoda (Vizualizacija)</h3>
                        <p className="text-sm text-muted-foreground max-w-sm">Grafovi prodaje i prometa će biti dostupni u punoj verziji uz analitiku.</p>
                    </div>

                    <div className="glass-card p-6 flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">Brze Akcije</h3>
                            <div className="space-y-4">
                                <Link href="/klijenti" className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-accent/30 hover:bg-accent/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-600">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Novi Klijent</p>
                                            <p className="text-xs text-muted-foreground">Dodajte u imenik</p>
                                        </div>
                                    </div>
                                    <div className="btn-primary text-xs py-1.5 px-3">Započni</div>
                                </Link>

                                <Link href="/ponude" className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-accent/30 hover:bg-accent/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Nova Ponuda</p>
                                            <p className="text-xs text-muted-foreground">Kreirajte ponudu</p>
                                        </div>
                                    </div>
                                    <div className="btn-primary text-xs py-1.5 px-3 bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20">Započni</div>
                                </Link>

                                <Link href="/racuni" className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-accent/30 hover:bg-accent/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Novi Račun</p>
                                            <p className="text-xs text-muted-foreground">Fiskalizacija 2.0</p>
                                        </div>
                                    </div>
                                    <div className="btn-primary text-xs py-1.5 px-3 bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20">Započni</div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({ title, value, icon, trend, trendUp }: any) {
    return (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    {icon}
                </div>
            </div>
            <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold">{value}</h3>
                <span className={`text-xs font-semibold ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {trend}
                </span>
            </div>
        </div>
    );
}
