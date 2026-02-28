import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fiskalService } from '@/lib/fiskal-service';

export async function POST(request: Request, context: unknown) {
    const { id } = await (context as { params: Promise<{ id: string }> }).params;

    try {
        const invoice = await prisma.invoice.findUnique({
            where: { id },
            include: { company: true }
        });

        if (!invoice) return NextResponse.json({ error: "Račun nije pronađen" }, { status: 404 });

        // Call the Fiskalizacija 2.0 service Mock
        const fiskalRes = await fiskalService.submitInvoice({
            companyOib: invoice.company.oib,
            invoiceNumber: invoice.number,
            totalAmount: invoice.totalGross,
            items: [] // In a real app we'd map invoice items
        });

        if (fiskalRes.success) {
            const updated = await prisma.invoice.update({
                where: { id },
                data: {
                    fiskalizationId: fiskalRes.jir,
                    zki: fiskalRes.zki,
                    status: "ISSUED"
                },
                include: { client: true }
            });
            return NextResponse.json(updated);
        } else {
            return NextResponse.json({ error: "Fiskalizacija nije uspjela" }, { status: 400 });
        }
    } catch (error) {
        console.error("Fiskalizacija Error:", error);
        return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
    }
}
