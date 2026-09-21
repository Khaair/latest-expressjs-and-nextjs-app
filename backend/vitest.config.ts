import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // setup-env MUST come first so DATABASE_URL is forced to backend_test
    // before Prisma / env modules load.
    setupFiles: ['./tests/setup-env.ts', './tests/setup.ts'],
    testTimeout: 30000,
    hookTimeout: 30000,
    fileParallelism: false,
  },
});
