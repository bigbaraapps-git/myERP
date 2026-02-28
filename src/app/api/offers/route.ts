import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const companyId = (await prisma.company.findFirst())?.id;
        if (!companyId) return NextResponse.json([], { status: 404 });

        const offers = await prisma.offer.findMany({
            where: { companyId },
            include: { client: true },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(offers);
    } catch (error) {
        return NextResponse.json({ error: "Pogreška prilikom dohvaćanja ponuda." }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const companyId = (await prisma.company.findFirst())?.id;
        if (!companyId) return NextResponse.json({ error: "No company found" }, { status: 404 });

        const data = await request.json();

        // Generate a random offer number
        const currentYear = new Date().getFullYear();
        const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const offerNumber = `OFF-${currentYear}-${randomNum}`;

        const newOffer = await prisma.offer.create({
            data: {
                number: offerNumber,
                companyId: companyId,
                clientId: data.clientId,
                status: "DRAFT",
                totalGross: parseFloat(data.amount) || 0,
                totalNet: (parseFloat(data.amount) || 0) * 0.8, // Simplistic calculation
                totalTax: (parseFloat(data.amount) || 0) * 0.2, // Simplistic
                validUntil: new Date(new Date().setDate(new Date().getDate() + 15)), // Valid for 15 days
            },
            include: { client: true }
        });

        return NextResponse.json(newOffer);
    } catch (error) {
        console.error("POST Offers Error:", error);
        return NextResponse.json({ error: "Pogreška prilikom kreiranja ponude." }, { status: 500 });
    }
}
