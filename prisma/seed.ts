import pkg from '@prisma/client';
const { PrismaClient } = pkg;

import Database from 'better-sqlite3';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const connectionString = process.env.DATABASE_URL || "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: connectionString });

const prisma = new PrismaClient({ adapter })
async function main() {
    console.log('Započinjem seed baze...');

    // 1. Create or get default company
    let company = await prisma.company.findFirst({ where: { oib: "12345678901" } });
    if (!company) {
        company = await prisma.company.create({
            data: {
                name: "Moja ERP Tvrtka d.o.o.",
                oib: "12345678901",
                legalType: "doo",
                package: "BUSINESS_PREMIUM",
            }
        });
    }

    // 2. Demo Clients Data
    const demoClientsData = [
        { name: "Tech Solutions d.o.o.", oib: "77788899901", city: "Zagreb" },
        { name: "Graditelj doo", oib: "11122233301", city: "Split" },
        { name: "Obrt za dizajn 'Kist'", oib: "33344455501", city: "Rijeka" },
        { name: "Vodeći Marketing jdoo", oib: "88899900011", city: "Osijek" },
        { name: "Logistika Brzi", oib: "55566677701", city: "Zadar" },
        { name: "AgroFarma", oib: "22233344401", city: "Varaždin" },
        { name: "Web Studio X", oib: "99988877701", city: "Dubrovnik" },
        { name: "Konzalting Plus", oib: "44455566601", city: "Pula" },
        { name: "Eko Hrana d.d.", oib: "66677788801", city: "Šibenik" },
        { name: "Servis Računala", oib: "12312312301", city: "Karlovac" },
    ];

    // 3. Create 10 demo clients
    for (const clientData of demoClientsData) {
        const existing = await prisma.client.findFirst({
            where: { email: `info@${clientData.name.toLowerCase().replace(/[\s.']/g, '')}.hr` }
        });
        if (!existing) {
            await prisma.client.create({
                data: {
                    ...clientData,
                    companyId: company.id,
                    email: `info@${clientData.name.toLowerCase().replace(/[\s.']/g, '')}.hr`,
                }
            });
        }
    }

    const clients = await prisma.client.findMany({ where: { companyId: company.id } });
    console.log(`Pronađeno ${clients.length} demo klijenata.`);

    // 4. Create offers for clients
    const statuses = ["DRAFT", "SENT", "ACCEPTED", "REJECTED", "INVOICED"];
    let offerCount = 0;

    for (let i = 0; i < clients.length; i++) {
        // 1-3 offers per client (only if none exist)
        const existingOffers = await prisma.offer.count({ where: { clientId: clients[i].id } });
        if (existingOffers === 0) {
            const numOffers = Math.floor(Math.random() * 3) + 1;
            for (let j = 0; j < numOffers; j++) {
                const amount = Math.floor(Math.random() * 5000) + 500;
                await prisma.offer.create({
                    data: {
                        number: `OFF-2024-${(100 + offerCount).toString()}`,
                        companyId: company.id,
                        clientId: clients[i].id,
                        status: statuses[Math.floor(Math.random() * statuses.length)] as any,
                        totalGross: amount,
                        totalNet: amount * 0.8,
                        totalTax: amount * 0.2,
                        validUntil: new Date(new Date().setDate(new Date().getDate() + 15)),
                    }
                });
                offerCount++;
            }
        }
    }
    console.log(`Dodano ${offerCount} novih demo ponuda.`);

    // 5. Create invoices for clients
    const invStatuses = ["DRAFT", "ISSUED", "PAID"];
    let invCount = 0;

    for (let i = 0; i < clients.length; i++) {
        // 1-3 invoices per client
        const existingInvoices = await prisma.invoice.count({ where: { clientId: clients[i].id } });
        if (existingInvoices === 0) {
            const numInvoices = Math.floor(Math.random() * 3) + 1;
            for (let j = 0; j < numInvoices; j++) {
                const isFiscalized = Math.random() > 0.4;
                const amount = Math.floor(Math.random() * 3000) + 300;

                await prisma.invoice.create({
                    data: {
                        number: `${i + 1}/1/${invCount + 1}`,
                        companyId: company.id,
                        clientId: clients[i].id,
                        status: invStatuses[Math.floor(Math.random() * invStatuses.length)] as any,
                        totalGross: amount,
                        totalNet: amount * 0.8,
                        totalTax: amount * 0.2,
                        dueDate: new Date(new Date().setDate(new Date().getDate() + 15)),
                        fiskalizationId: isFiscalized ? `JIR-${Math.random().toString(36).substr(2, 9).toUpperCase()}` : null,
                        zki: isFiscalized ? `ZKI-${Math.random().toString(16).substr(2, 8)}` : null,
                    }
                });
                invCount++;
            }
        }
    }
    console.log(`Dodano ${invCount} novih demo računa.`);

    console.log('Seed uspješno završen!');
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
