import { PrismaClient } from "@prisma/client";
import Database from "better-sqlite3";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const connectionString = process.env.DATABASE_URL || "file:./dev.db";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prisma: PrismaClient;

if (globalForPrisma.prisma) {
    prisma = globalForPrisma.prisma;
} else {
    const adapter = new PrismaBetterSqlite3({ url: connectionString });
    prisma = new PrismaClient({ adapter, log: ["query"] });
}
export { prisma };

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
