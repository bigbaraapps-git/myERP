import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: Request, context: unknown) {
    // Next.js 15 requires context.params to be awaited or typed as Promise
    const { id } = await (context as { params: Promise<{ id: string }> }).params;

    try {
        await prisma.client.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE Client Error:", error);
        return NextResponse.json({ error: "Pogreška prilikom brisanja klijenta." }, { status: 500 });
    }
}
