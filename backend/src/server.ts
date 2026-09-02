import { createApp } from './app';
import { env } from './config/env';
import { disconnectDatabase } from './config/database';
import { logger } from './lib/logger';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT, env: env.NODE_ENV }, 'Server started');
});

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    logger.error(
      { port: env.PORT },
      `Port ${env.PORT} is already in use. Stop the other process or change PORT in .env`,
    );
    process.exit(1);
  }

  throw error;
});

async function shutdown(signal: string): Promise<void> {
  logger.info({ signal }, 'Shutting down gracefully');
  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));

export default app;
