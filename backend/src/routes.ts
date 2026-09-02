import { Router, Request, Response } from 'express';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import { checkDatabaseConnection } from './config/database';
import { sendSuccess } from './utils/response';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  sendSuccess(res, { status: 'ok' }, 'Service is healthy');
});

router.get('/health/ready', async (_req: Request, res: Response) => {
  const dbReady = await checkDatabaseConnection();

  if (!dbReady) {
    res.status(503).json({
      success: false,
      message: 'Service not ready',
      errors: { database: ['Database connection failed'] },
    });
    return;
  }

  sendSuccess(res, { status: 'ready', database: 'connected' }, 'Service is ready');
});

router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/users', userRoutes);

export default router;
