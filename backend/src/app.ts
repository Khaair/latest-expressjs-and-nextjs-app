import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import { randomUUID } from 'crypto';
import { env } from './config/env';
import { logger } from './lib/logger';
import routes from './routes';
import { errorHandler } from './middleware/error';
import { generalRateLimiter } from './middleware/rate-limit';
import { swaggerSpec } from './docs/swagger';
import { NotFoundError } from './errors/AppError';

export function createApp(): Application {
  const app = express();

  app.set('trust proxy', 1);

  app.use(
    pinoHttp({
      logger,
      genReqId: (req) => {
        const existing = req.headers['x-request-id'];
        if (typeof existing === 'string') return existing;
        return randomUUID();
      },
      customProps: (req, res) => ({
        requestId: req.id,
        method: req.method,
        path: req.url,
        statusCode: res.statusCode,
      }),
      customLogLevel: (_req, res, err) => {
        if (err || res.statusCode >= 500) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
      },
      serializers: {
        req: (req) => ({
          id: req.id,
          method: req.method,
          url: req.url,
        }),
        res: (res) => ({
          statusCode: res.statusCode,
        }),
      },
    }),
  );

  app.use((req: Request, _res: Response, next: NextFunction) => {
    req.requestId = (req as Request & { id?: string }).id ?? randomUUID();
    next();
  });

  app.use(
    helmet({
      contentSecurityPolicy: env.NODE_ENV === 'production',
    }),
  );

  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    }),
  );

  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(cookieParser(env.SESSION_SECRET));
  app.use(generalRateLimiter);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api-docs.json', (_req, res) => {
    res.json(swaggerSpec);
  });

  app.use(routes);

  app.use((_req, _res, next) => {
    next(new NotFoundError('Route not found'));
  });

  app.use(errorHandler);

  return app;
}

export default createApp;
