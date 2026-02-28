import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const companyId = (await prisma.company.findFirst())?.id;
        if (!companyId) return NextResponse.json([], { status: 404 });

        const employees = await prisma.employee.findMany({
            where: { companyId },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(employees);
    } catch (error) {
        console.error("GET Employees Error:", error);
        return NextResponse.json({ error: "Pogreška prilikom dohvaćanja zaposlenika." }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const companyId = (await prisma.company.findFirst())?.id;
        if (!companyId) return NextResponse.json({ error: "No company found" }, { status: 404 });

        const data = await request.json();

        const newEmployee = await prisma.employee.create({
            data: {
                name: data.name,
                email: data.email,
                jobTitle: data.title,
                status: data.status || "ACTIVE",
                companyId: companyId
            }
        });

        return NextResponse.json(newEmployee);
    } catch (error) {
        console.error("POST Employees Error:", error);
        return NextResponse.json({ error: "Pogreška prilikom kreiranja zaposlenika." }, { status: 500 });
    }
}
