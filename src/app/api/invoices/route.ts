import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const companyId = (await prisma.company.findFirst())?.id;
        if (!companyId) return NextResponse.json([], { status: 404 });

        const invoices = await prisma.invoice.findMany({
            where: { companyId },
            include: { client: true },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(invoices);
    } catch (error) {
        return NextResponse.json({ error: "Pogreška prilikom dohvaćanja računa." }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const companyId = (await prisma.company.findFirst())?.id;
        if (!companyId) return NextResponse.json({ error: "No company found" }, { status: 404 });

        const data = await request.json();

        // Generate a simple sequence number
        const count = await prisma.invoice.count({ where: { companyId } });
        const invoiceNumber = `1/1/${count + 1}`;

        const newInvoice = await prisma.invoice.create({
            data: {
                number: invoiceNumber,
                companyId: companyId,
                clientId: data.clientId,
                status: "ISSUED",
                totalGross: parseFloat(data.amount) || 0,
                totalNet: (parseFloat(data.amount) || 0) * 0.8,
                totalTax: (parseFloat(data.amount) || 0) * 0.2,
                dueDate: new Date(new Date().setDate(new Date().getDate() + 15)),
            },
            include: { client: true }
        });

        return NextResponse.json(newInvoice);
    } catch (error) {
        console.error("POST Invoice Error:", error);
        return NextResponse.json({ error: "Pogreška prilikom kreiranja računa." }, { status: 500 });
    }
}
