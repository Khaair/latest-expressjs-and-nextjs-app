process.env.NODE_ENV = 'test';
process.env.PORT = '3099';
process.env.DATABASE_URL =
  process.env.DATABASE_URL ??
  'postgresql://postgres:password@localhost:5432/backend_test?schema=public';
process.env.FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:3000';
process.env.SESSION_SECRET =
  process.env.SESSION_SECRET ?? 'test-session-secret-minimum-32-characters-long';
process.env.JWT_SECRET =
  process.env.JWT_SECRET ?? 'test-jwt-secret-minimum-32-characters-long-value';
process.env.JWT_ACCESS_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';

import { beforeAll, afterAll, beforeEach } from 'vitest';
import { prisma } from '../src/lib/prisma';

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  await prisma.passwordResetToken.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
});
