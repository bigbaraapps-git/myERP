"use client";

import { Sidebar } from "@/components/sidebar";
import { Check, Zap, Rocket, Crown, Star } from "lucide-react";

const packages = [
    {
        name: "Trial",
        description: "Isprobajte sve mogućnosti 30 dana.",
        price: "0,00 €",
        limit: "20 Invoica",
        features: ["Osnovni CRM", "Offer Preparation", "Fiskalizacija 2.0 Integration"],
        icon: <Zap className="text-amber-500" />,
        isCurrent: true
    },
    {
        name: "Business Standard",
        description: "Idealno za male obrte i j.d.o.o.",
        price: "19,00 €",
        limit: "200 Invoica",
        features: ["Sve iz Trial", "Employee Management", "Priority Support"],
        icon: <Rocket className="text-brand-600" />,
        isCurrent: false
    },
    {
        name: "Business Premium",
        description: "Za brzorastuće tvrtke i d.o.o.",
        price: "49,00 €",
        limit: "Neograničeno",
        features: ["Sve iz Standard", "Advanced Analytics", "Global Multi-currency"],
        icon: <Crown className="text-violet-500" />,
        isCurrent: false
    }
];

export default function PostavkePage() {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Postavke</h1>
                    <p className="text-muted-foreground">Upravljajte postavkama tvrtke i pretplatničkim paketima.</p>
                </header>

                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-6">Pretplatnički Paket</h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        {packages.map(pkg => (
                            <div key={pkg.name} className={`glass-card p-6 flex flex-col relative transition-all hover:scale-[1.02] ${pkg.isCurrent ? 'ring-2 ring-brand-600' : ''}`}>
                                {pkg.isCurrent && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                        Trenutni Paket
                                    </span>
                                )}
                                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                                    {pkg.icon}
                                </div>
                                <h3 className="text-xl font-bold">{pkg.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1 mb-4">{pkg.description}</p>
                                <div className="mb-6">
                                    <span className="text-3xl font-bold">{pkg.price}</span>
                                    <span className="text-sm text-muted-foreground"> / mj</span>
                                </div>

                                <div className="space-y-3 flex-1 mb-8">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-brand-600">
                                        <Star className="w-4 h-4 fill-current" />
                                        Limit: {pkg.limit}
                                    </div>
                                    {pkg.features.map(feat => (
                                        <div key={feat} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Check className="w-4 h-4 text-emerald-500" />
                                            {feat}
                                        </div>
                                    ))}
                                </div>

                                <button className={`w-full py-2.5 rounded-lg font-semibold transition-all ${pkg.isCurrent ? 'bg-accent text-muted-foreground cursor-default' : 'btn-primary'}`}>
                                    {pkg.isCurrent ? 'Aktivno' : 'Nadogradi'}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="glass-card p-8">
                    <h2 className="text-xl font-semibold mb-6">Podaci o Tvrtki</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Naziv Tvrtke</label>
                            <input type="text" defaultValue="Primjer d.o.o." className="w-full px-4 py-2 bg-accent/40 border border-border rounded-lg outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">OIB</label>
                            <input type="text" defaultValue="12345678901" className="w-full px-4 py-2 bg-accent/40 border border-border rounded-lg outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email za Račune</label>
                            <input type="email" defaultValue="racuni@primjer.hr" className="w-full px-4 py-2 bg-accent/40 border border-border rounded-lg outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Adresa</label>
                            <input type="text" defaultValue="Ulica primjera 123, Zagreb" className="w-full px-4 py-2 bg-accent/40 border border-border rounded-lg outline-none" />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
