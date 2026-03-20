import { PrismaClient } from '@prisma/client';

type GlobalPrisma = typeof globalThis & { prisma?: PrismaClient };

const globalForPrisma = globalThis as GlobalPrisma;

const createMockModel = () =>
  new Proxy(
    {},
    {
      get: (_target, prop) => {
        if (prop === 'findMany') return async () => [];
        if (prop === 'findUnique' || prop === 'findFirst') return async () => null;
        if (prop === 'create' || prop === 'update') {
          return async (args: { data?: unknown }) => args?.data ?? null;
        }
        if (prop === 'delete') return async () => null;
        return async () => null;
      }
    }
  );

const createMockPrisma = () =>
  new Proxy(
    {},
    {
      get: () => createMockModel()
    }
  ) as PrismaClient;

const prisma = process.env.DATABASE_URL
  ? globalForPrisma.prisma ?? new PrismaClient()
  : createMockPrisma();

if (process.env.NODE_ENV !== 'production' && process.env.DATABASE_URL) {
  globalForPrisma.prisma = prisma;
}

export const db = prisma;
export default prisma;
