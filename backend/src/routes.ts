import { Router, Request, Response } from 'express';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import categoryRoutes from './modules/categories/category.routes';
import { checkDatabaseConnection } from './config/database';
import { sendSuccess } from './utils/response';
import blogRoutes from './modules/blogs/blog.routes';

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
router.use('/api/v1/categories', categoryRoutes);
router.use('/api/v1/blogs', blogRoutes);

export default router;
