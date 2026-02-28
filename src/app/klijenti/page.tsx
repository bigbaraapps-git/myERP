"use client";

import { Sidebar } from "@/components/sidebar";
import { Plus, Search, MoreVertical, Building2, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function ClientsPage() {
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", oib: "", email: "", city: "" });

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const res = await fetch("/api/clients");
            const data = await res.json();
            setClients(data);
        } catch (error) {
            console.error("Error fetching clients:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Jeste li sigurni da želite obrisati ovog klijenta?")) return;
        try {
            const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
            if (res.ok) {
                setClients(prev => prev.filter(c => c.id !== id));
            }
        } catch (error) {
            console.error("Error deleting client:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/clients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                const newClient = await res.json();
                setClients([newClient, ...clients]);
                setIsModalOpen(false);
                setFormData({ name: "", oib: "", email: "", city: "" });
            }
        } catch (error) {
            console.error("Error creating client", error);
        }
    };

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.oib && c.oib.includes(search)) ||
        (c.city && c.city.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8 relative">
                {/* Modal */}
                {isModalOpen && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                        <div className="glass-card w-full max-w-md p-6 relative">
                            <h2 className="text-xl font-bold mb-4">Novi Klijent</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Naziv Tvrtke / Ime</label>
                                    <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 mt-1 bg-accent/40 border border-border rounded-lg outline-none" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">OIB</label>
                                    <input value={formData.oib} onChange={e => setFormData({ ...formData, oib: e.target.value })} className="w-full px-4 py-2 mt-1 bg-accent/40 border border-border rounded-lg outline-none" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Email</label>
                                    <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 mt-1 bg-accent/40 border border-border rounded-lg outline-none" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Grad</label>
                                    <input value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="w-full px-4 py-2 mt-1 bg-accent/40 border border-border rounded-lg outline-none" />
                                </div>
                                <div className="flex justify-end gap-2 mt-6">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-muted-foreground hover:bg-accent rounded-lg">Odustani</button>
                                    <button type="submit" className="btn-primary">Spremi</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <header className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Klijenti</h1>
                        <p className="text-muted-foreground">Upravljajte bazom vaših kupaca i dobavljača.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Novi Klijent
                    </button>
                </header>

                <div className="glass-card overflow-hidden">
                    <div className="p-4 border-b border-border flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Pretraži klijente po imenu, OIB-u ili gradu..."
                                className="w-full pl-10 pr-4 py-2 bg-accent/40 border border-border rounded-lg outline-none focus:ring-2 focus:ring-brand-500/20"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto min-h-[300px]">
                        <table className="w-full text-left">
                            <thead className="bg-accent/30 text-xs font-semibold uppercase text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-4">Klijent</th>
                                    <th className="px-6 py-4">OIB</th>
                                    <th className="px-6 py-4">Lokacija</th>
                                    <th className="px-6 py-4 text-right">Akcije</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {loading ? (
                                    <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">Učitavanje...</td></tr>
                                ) : filteredClients.length === 0 ? (
                                    <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">Nema pronađenih klijenata.</td></tr>
                                ) : (
                                    filteredClients.map(client => (
                                        <tr key={client.id} className="hover:bg-accent/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                                                        <Building2 className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{client.name}</div>
                                                        <div className="text-xs text-muted-foreground">{client.email || '-'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-mono">{client.oib || '-'}</td>
                                            <td className="px-6 py-4 text-sm">{client.city || '-'}</td>
                                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                <button onClick={() => handleDelete(client.id)} className="p-2 hover:bg-rose-500/10 text-rose-500 transition-colors rounded-md group">
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
