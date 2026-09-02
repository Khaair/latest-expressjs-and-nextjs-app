import pino from 'pino';
import { env, isProduction, isTest } from './env';

export const logger = pino({
  level: isTest ? 'silent' : isProduction ? 'info' : 'debug',
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'password',
      'passwordHash',
      'token',
      'refreshToken',
      'accessToken',
      'body.password',
      'body.currentPassword',
      'body.newPassword',
      'body.confirmPassword',
    ],
    remove: true,
  },
  transport:
    !isProduction && !isTest
      ? {
          target: 'pino/file',
          options: { destination: 1 },
        }
      : undefined,
  base: {
    env: env.NODE_ENV,
  },
});
