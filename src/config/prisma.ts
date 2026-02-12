import { PrismaClient } from '@prisma/client';

let prisma:PrismaClient|null = null;
if (prisma == null) {
    prisma = new PrismaClient();
}

export default prisma as PrismaClient;
