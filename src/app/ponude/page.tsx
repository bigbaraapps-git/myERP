"use client";

import { Sidebar } from "@/components/sidebar";
import { Plus, FileText, CheckCircle2, Clock, Trash2, MoreVertical } from "lucide-react";
import { useState, useEffect } from "react";

const statusStyles: any = {
    DRAFT: "bg-slate-500/10 text-slate-500",
    SENT: "bg-amber-500/10 text-amber-500",
    ACCEPTED: "bg-emerald-500/10 text-emerald-600",
    REJECTED: "bg-rose-500/10 text-rose-500",
    INVOICED: "bg-brand-500/10 text-brand-600",
};

export default function OffersPage() {
    const [offers, setOffers] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ clientId: "", amount: "" });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [offersRes, clientsRes] = await Promise.all([
                fetch("/api/offers"),
                fetch("/api/clients")
            ]);
            const offersData = await offersRes.json();
            const clientsData = await clientsRes.json();
            setOffers(offersData);
            setClients(clientsData);
            if (clientsData.length > 0) setFormData({ ...formData, clientId: clientsData[0].id });
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Obrisati ponudu?")) return;
        try {
            const res = await fetch(`/api/offers/${id}`, { method: "DELETE" });
            if (res.ok) {
                setOffers(prev => prev.filter(o => o.id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/offers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                const newOffer = await res.json();
                setOffers([newOffer, ...offers]);
                setIsModalOpen(false);
                setFormData({ ...formData, amount: "" }); // retain clientId for convenience
            }
        } catch (error) {
            console.error(error);
        }
    };

    const summary = {
        total: offers.reduce((sum, o) => sum + (o.totalGross || 0), 0),
        pending: offers.filter(o => o.status === 'SENT' || o.status === 'DRAFT').reduce((sum, o) => sum + (o.totalGross || 0), 0),
        accepted: offers.filter(o => o.status === 'ACCEPTED' || o.status === 'INVOICED').reduce((sum, o) => sum + (o.totalGross || 0), 0),
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('hr-HR', { style: 'currency', currency: 'EUR' }).format(val);
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8 relative">

                {isModalOpen && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                        <div className="glass-card w-full max-w-md p-6 relative">
                            <h2 className="text-xl font-bold mb-4">Nova Ponuda</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Klijent</label>
                                    <select required value={formData.clientId} onChange={e => setFormData({ ...formData, clientId: e.target.value })} className="w-full px-4 py-2 mt-1 bg-accent/40 border border-border rounded-lg outline-none">
                                        <option value="" disabled>Odaberite klijenta</option>
                                        {clients.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Ukupan Iznos Ponude (EUR)</label>
                                    <input required type="number" step="0.01" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} className="w-full px-4 py-2 mt-1 bg-accent/40 border border-border rounded-lg outline-none" />
                                </div>
                                <div className="flex justify-end gap-2 mt-6">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-muted-foreground hover:bg-accent rounded-lg">Odustani</button>
                                    <button type="submit" className="btn-primary" disabled={clients.length === 0}>
                                        Spremi
                                    </button>
                                </div>
                            </form>
                            {clients.length === 0 && (
                                <p className="text-xs text-rose-500 mt-2">Nema klijenata, prvo dodajte klijenta.</p>
                            )}
                        </div>
                    </div>
                )}

                <header className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Ponude</h1>
                        <p className="text-muted-foreground">Kreirajte i upravljajte ponudama za vaše klijente.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Nova Ponuda
                    </button>
                </header>

                <div className="grid gap-6 md:grid-cols-3 mb-8">
                    <SummaryCard title="Ukupno Ponuđeno" value={formatCurrency(summary.total)} icon={<FileText className="text-brand-600" />} />
                    <SummaryCard title="U Obradi (Draft/Sent)" value={formatCurrency(summary.pending)} icon={<Clock className="text-amber-500" />} />
                    <SummaryCard title="Prihvaćeno/Reallizirano" value={formatCurrency(summary.accepted)} icon={<CheckCircle2 className="text-emerald-500" />} />
                </div>

                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto min-h-[300px]">
                        <table className="w-full text-left">
                            <thead className="bg-accent/30 text-xs font-semibold uppercase text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-4">Broj Ponude</th>
                                    <th className="px-6 py-4">Klijent</th>
                                    <th className="px-6 py-4">Iznos</th>
                                    <th className="px-6 py-4">Kreirano</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Akcije</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {loading ? (
                                    <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">Učitavanje...</td></tr>
                                ) : offers.length === 0 ? (
                                    <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">Nema ponuda.</td></tr>
                                ) : (
                                    offers.map(offer => (
                                        <tr key={offer.id} className="hover:bg-accent/20 transition-colors">
                                            <td className="px-6 py-4 font-medium">{offer.number}</td>
                                            <td className="px-6 py-4">{offer.client?.name || 'Nepoznat Klijent'}</td>
                                            <td className="px-6 py-4 font-semibold">{formatCurrency(offer.totalGross)}</td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(offer.createdAt).toLocaleDateString('hr-HR')}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${statusStyles[offer.status] || statusStyles.DRAFT}`}>
                                                    {offer.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                <button onClick={() => handleDelete(offer.id)} className="p-2 hover:bg-rose-500/10 text-rose-500 transition-colors rounded-md group">
                                                    <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                </button>
                                                <button className="p-2 hover:bg-accent rounded-md">
                                                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

function SummaryCard({ title, value, icon }: any) {
    return (
        <div className="glass-card p-6 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <p className="text-2xl font-bold mt-1">{value}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                {icon}
            </div>
        </div>
    );
}
