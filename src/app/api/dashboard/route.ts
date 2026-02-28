import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const companyId = (await prisma.company.findFirst())?.id;
        if (!companyId) return NextResponse.json({ clients: 0, offers: 0, invoices: 0 }, { status: 200 });

        const [clients, offers, invoices, pendingInvoices] = await Promise.all([
            prisma.client.count({ where: { companyId } }),
            prisma.offer.count({ where: { companyId } }),
            prisma.invoice.count({ where: { companyId } }),
            prisma.invoice.count({ where: { companyId, fiskalizationId: null } })
        ]);

        return NextResponse.json({
            clients,
            offers,
            invoices,
            pendingInvoices
        });
    } catch (error) {
        return NextResponse.json({ error: "Pogreška prilikom dohvaćanja statistike." }, { status: 500 });
    }
}
