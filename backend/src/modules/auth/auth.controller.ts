import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { sendSuccess, sendMessage } from '../../utils/response';
import { AuthenticatedRequest } from '../../types/express.d';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await authService.register(req.body, res);
    sendSuccess(res, { user }, 'Registration successful', 201);
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await authService.login(req.body, res);
    sendSuccess(res, { user }, 'Login successful');
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const refreshToken = authService.getRefreshTokenFromCookies(req.cookies ?? {});
    await authService.logout(refreshToken, res);
    sendMessage(res, 'Logout successful');
  } catch (error) {
    next(error);
  }
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { user } = req as AuthenticatedRequest;
    const profile = await authService.getMe(user.id);
    sendSuccess(res, { user: profile });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const refreshToken = authService.getRefreshTokenFromCookies(req.cookies ?? {});
    const user = await authService.refreshTokens(refreshToken, res);
    sendSuccess(res, { user }, 'Token refreshed');
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await authService.forgotPassword(req.body);
    sendMessage(res, 'If an account with that email exists, a password reset link has been sent');
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await authService.resetPassword(req.body);
    sendMessage(res, 'Password reset successful');
  } catch (error) {
    next(error);
  }
}

export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { user } = req as AuthenticatedRequest;
    await authService.changePassword(user.id, req.body, res);
    sendMessage(res, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
}
