"use client";

import { Sidebar } from "@/components/sidebar";
import { Plus, CheckCircle2, ShieldCheck, ExternalLink, Trash2, Zap, Clock } from "lucide-react";
import { useState, useEffect } from "react";

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ clientId: "", amount: "" });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [invoicesRes, clientsRes] = await Promise.all([
                fetch("/api/invoices"),
                fetch("/api/clients")
            ]);
            const invoicesData = await invoicesRes.json();
            const clientsData = await clientsRes.json();
            setInvoices(invoicesData);
            setClients(clientsData);
            if (clientsData.length > 0) setFormData({ ...formData, clientId: clientsData[0].id });
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, jir: string | null) => {
        if (jir) {
            alert("Ne možete obrisati fiskalizirani račun.");
            return;
        }
        if (!confirm("Obrisati račun?")) return;
        try {
            const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
            if (res.ok) {
                setInvoices(prev => prev.filter(i => i.id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleFiscalize = async (id: string) => {
        try {
            const res = await fetch(`/api/invoices/${id}/fiscalize`, { method: "POST" });
            if (res.ok) {
                const updatedInvoice = await res.json();
                setInvoices(prev => prev.map(inv => inv.id === id ? updatedInvoice : inv));
                alert(`Uspješno fiskalizirano! JIR: ${updatedInvoice.fiskalizationId}`);
            } else {
                alert("Greška pri fiskalizaciji.");
            }
        } catch (error) {
            console.error(error);
            alert("Sustav je nedostupan.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/invoices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                const newInvoice = await res.json();
                setInvoices([newInvoice, ...invoices]);
                setIsModalOpen(false);
                setFormData({ ...formData, amount: "" });
            }
        } catch (error) {
            console.error(error);
        }
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
                            <h2 className="text-xl font-bold mb-4">Novi Račun</h2>
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
                                    <label className="text-sm font-medium">Ukupan Iznos Računa (EUR)</label>
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
                        <h1 className="text-3xl font-bold tracking-tight">Računi</h1>
                        <p className="text-muted-foreground">Pregled svih izlaznih računa i Fiskalizacija 2.0 statusa.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Novi Račun
                    </button>
                </header>

                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto min-h-[300px]">
                        <table className="w-full text-left">
                            <thead className="bg-accent/30 text-xs font-semibold uppercase text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-4">Broj Računa</th>
                                    <th className="px-6 py-4">Klijent</th>
                                    <th className="px-6 py-4">Iznos</th>
                                    <th className="px-6 py-4">Fiskalizacija 2.0</th>
                                    <th className="px-6 py-4 text-right">Akcije</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {loading ? (
                                    <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">Učitavanje...</td></tr>
                                ) : invoices.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">Nema računa.</td></tr>
                                ) : (
                                    invoices.map(inv => (
                                        <tr key={inv.id} className="hover:bg-accent/20 transition-colors">
                                            <td className="px-6 py-4 font-medium">{inv.number}</td>
                                            <td className="px-6 py-4">{inv.client?.name || 'Nepoznat Klijent'}</td>
                                            <td className="px-6 py-4 font-semibold">{formatCurrency(inv.totalGross)}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {inv.fiskalizationId ? (
                                                        <span className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600">
                                                            <ShieldCheck className="w-3 h-3" /> JIR DODIJELJEN
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-500">
                                                            <Clock className="w-3 h-3" /> NEFISKALIZIRANO
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                {!inv.fiskalizationId && (
                                                    <button onClick={() => handleFiscalize(inv.id)} title="Fiskaliziraj sada" className="p-2 hover:bg-blue-500/10 text-blue-500 transition-colors rounded-md group">
                                                        <Zap className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button onClick={() => handleDelete(inv.id, inv.fiskalizationId)} className="p-2 hover:bg-rose-500/10 text-rose-500 transition-colors rounded-md group" disabled={!!inv.fiskalizationId}>
                                                    <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
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
