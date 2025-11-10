import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env is located at the project root (two levels up from src/lib)
const envPath = path.join(__dirname, '..', '..', '.env');
console.log('lib/prisma: Loading .env from', envPath);
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error('lib/prisma: Error loading .env:', result.error);
} else {
  console.log('lib/prisma: Loaded environment variables:', Object.keys(result.parsed || {}));
}

// Dynamic import so that @prisma/client is loaded after env is configured
const { PrismaClient } = await import('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: ['info', 'warn', 'error']
});

try {
  await prisma.$connect();
  console.log('lib/prisma: Prisma connected');
} catch (err) {
  console.error('lib/prisma: Prisma connection error', err);
}

export default prisma;
