import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: Request, context: unknown) {
    const { id } = await (context as { params: Promise<{ id: string }> }).params;

    try {
        await prisma.employee.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Pogreška prilikom brisanja zaposlenika." }, { status: 500 });
    }
}
