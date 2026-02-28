import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Ensure a default company exists for prototyping
async function getCompanyId() {
    let company = await prisma.company.findFirst();
    if (!company) {
        company = await prisma.company.create({
            data: {
                name: "Primjer d.o.o.",
                oib: "12345678901",
                legalType: "doo",
            }
        });
    }
    return company.id;
}

export async function GET() {
    try {
        const companyId = await getCompanyId();
        const clients = await prisma.client.findMany({
            where: { companyId },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(clients);
    } catch (error) {
        console.error("GET Clients Error:", error);
        return NextResponse.json({ error: "Pogreška prilikom dohvaćanja klijenata." }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const companyId = await getCompanyId();
        const data = await request.json();

        const newClient = await prisma.client.create({
            data: {
                name: data.name,
                oib: data.oib,
                email: data.email,
                phone: data.phone,
                address: data.address,
                city: data.city,
                country: data.country || "HR",
                companyId: companyId
            }
        });

        return NextResponse.json(newClient);
    } catch (error) {
        console.error("POST Clients Error:", error);
        return NextResponse.json({ error: "Pogreška prilikom kreiranja klijenta." }, { status: 500 });
    }
}
