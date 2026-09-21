import { config } from 'dotenv';
import { resolve } from 'path';
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

config({ path: resolve(process.cwd(), '.env') });

function resolveTestDatabaseUrl(): string {
  if (process.env.TEST_DATABASE_URL) {
    return process.env.TEST_DATABASE_URL;
  }

  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    url.pathname = '/backend_test';
    return url.toString();
  }

  return 'postgresql://postgres:password@localhost:5432/backend_test?schema=public';
}

async function ensureDatabaseExists(testUrl: string): Promise<void> {
  const url = new URL(testUrl);
  const dbName = url.pathname.replace(/^\//, '') || 'backend_test';

  const adminUrl = new URL(testUrl);
  adminUrl.pathname = '/postgres';

  const admin = new PrismaClient({
    datasources: { db: { url: adminUrl.toString() } },
  });

  try {
    const rows = await admin.$queryRaw<{ exists: boolean }[]>`
      SELECT EXISTS(
        SELECT 1 FROM pg_database WHERE datname = ${dbName}
      ) AS "exists"
    `;

    if (!rows[0]?.exists) {
      await admin.$executeRawUnsafe(`CREATE DATABASE "${dbName}"`);
      console.log(`Created database: ${dbName}`);
    } else {
      console.log(`Database already exists: ${dbName}`);
    }
  } finally {
    await admin.$disconnect();
  }
}

async function main() {
  const testUrl = resolveTestDatabaseUrl();
  await ensureDatabaseExists(testUrl);

  console.log('Running migrations on backend_test...');
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: testUrl,
    },
  });

  console.log('backend_test is ready.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
