import { PrismaClient } from '@prisma/client';
import { PHASE_PRODUCTION_BUILD } from 'next/constants';

const isBuildPhase = process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const prismaClient = !isBuildPhase
  ? globalForPrisma.prisma ?? new PrismaClient()
  : null;

if (!isBuildPhase && process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prismaClient ?? undefined;
}

const mockModel = new Proxy(
  {},
  {
    get: () => async () => []
  }
);

const mockDb = new Proxy(
  {},
  {
    get: () => mockModel
  }
) as unknown as PrismaClient;

export const db = (isBuildPhase ? mockDb : prismaClient) as PrismaClient;

export default db;
