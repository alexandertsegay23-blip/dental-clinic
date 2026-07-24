import { PrismaClient } from '@/generated/prisma';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const connectionString = process.env.DATABASE_URL || 'file:./prisma/clinic.db';

const adapter = new PrismaLibSql({ url: connectionString });

const prisma = new PrismaClient({ adapter });

export default prisma;
