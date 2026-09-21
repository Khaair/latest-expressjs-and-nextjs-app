import { config } from 'dotenv';
import { resolve } from 'path';

/**
 * Must run before any app imports (prisma/env).
 * Forces tests onto backend_test so development data is never wiped.
 */
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

process.env.NODE_ENV = 'test';
process.env.PORT = process.env.PORT ?? '3099';
process.env.DATABASE_URL = resolveTestDatabaseUrl();
process.env.FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:3000';
process.env.SESSION_SECRET =
  process.env.SESSION_SECRET ?? 'test-session-secret-minimum-32-characters-long';
process.env.JWT_SECRET =
  process.env.JWT_SECRET ?? 'test-jwt-secret-minimum-32-characters-long-value';
process.env.JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN ?? '15m';
process.env.JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN ?? '7d';
