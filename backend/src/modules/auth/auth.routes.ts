import { Router } from 'express';
import * as authController from './auth.controller';
import { validate } from '../../middleware/validate';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from './auth.schema';
import { authenticate } from '../../middleware/auth';
import { authRateLimiter, passwordResetRateLimiter } from '../../middleware/rate-limit';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

router.post('/register', authRateLimiter, validate(registerSchema), authController.register);
router.post('/login', authRateLimiter, validate(loginSchema), authController.login);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.me);
router.post('/refresh', authRateLimiter, authController.refresh);
router.post(
  '/forgot-password',
  passwordResetRateLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);
router.post(
  '/reset-password',
  authRateLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword,
);
router.post(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  authController.changePassword,
);

export default router;
