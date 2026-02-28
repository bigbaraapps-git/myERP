"use client";

import { Sidebar } from "@/components/sidebar";
import { Plus, User, Trash2, Shield, MoreVertical, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";

const statusStyles: any = {
    ACTIVE: "bg-emerald-500/10 text-emerald-600",
    VACATION: "bg-amber-500/10 text-amber-500",
    SICK_LEAVE: "bg-rose-500/10 text-rose-500",
    INACTIVE: "bg-slate-500/10 text-slate-500",
};

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", title: "", status: "ACTIVE" });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await fetch("/api/employees");
            const data = await res.json();
            setEmployees(data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Obrisati zaposlenika?")) return;
        try {
            const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
            if (res.ok) {
                setEmployees(prev => prev.filter(e => e.id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/employees", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                const newEmp = await res.json();
                setEmployees([newEmp, ...employees]);
                setIsModalOpen(false);
                setFormData({ name: "", email: "", title: "", status: "ACTIVE" });
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8 relative">

                {isModalOpen && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                        <div className="glass-card w-full max-w-md p-6 relative">
                            <h2 className="text-xl font-bold mb-4">Novi Zaposlenik</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Ime i Prezime</label>
                                    <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 mt-1 bg-accent/40 border border-border rounded-lg outline-none" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Email</label>
                                    <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 mt-1 bg-accent/40 border border-border rounded-lg outline-none" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Radno Mjesto</label>
                                    <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 mt-1 bg-accent/40 border border-border rounded-lg outline-none" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Status</label>
                                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 mt-1 bg-accent/40 border border-border rounded-lg outline-none">
                                        <option value="ACTIVE">Aktivan</option>
                                        <option value="VACATION">Godišnji</option>
                                        <option value="SICK_LEAVE">Bolovanje</option>
                                    </select>
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
                        <h1 className="text-3xl font-bold tracking-tight">Zaposlenici</h1>
                        <p className="text-muted-foreground">Upravljajte timom i njihovim radnim statusima.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Novi Zaposlenik
                    </button>
                </header>

                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto min-h-[300px]">
                        <table className="w-full text-left">
                            <thead className="bg-accent/30 text-xs font-semibold uppercase text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-4">Zaposlenik</th>
                                    <th className="px-6 py-4">Titula</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Akcije</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {loading ? (
                                    <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">Učitavanje...</td></tr>
                                ) : employees.length === 0 ? (
                                    <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">Nema zaposlenika.</td></tr>
                                ) : (
                                    employees.map(emp => (
                                        <tr key={emp.id} className="hover:bg-accent/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-foreground">
                                                        <User className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{emp.name}</div>
                                                        <div className="text-xs text-muted-foreground">{emp.email || '-'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="w-3 h-3 text-muted-foreground" />
                                                    {emp.jobTitle || '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${statusStyles[emp.status] || statusStyles.INACTIVE}`}>
                                                    {emp.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                <button onClick={() => handleDelete(emp.id)} className="p-2 hover:bg-rose-500/10 text-rose-500 transition-colors rounded-md group">
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
