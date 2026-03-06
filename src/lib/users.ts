import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export type User = {
  id: string;
  email: string;
  name?: string | null;
  password?: string | null;
  createdAt: Date;
};

export async function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email: email.toLowerCase() } });
}

export async function createUser(
  email: string,
  name: string,
  hashedPassword: string
): Promise<User> {
  return prisma.user.create({
    data: {
      email: email.toLowerCase(),
      name,
      password: hashedPassword,
    },
  });
}