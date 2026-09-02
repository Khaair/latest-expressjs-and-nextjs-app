import { Response } from 'express';
import { User } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { BadRequestError, ConflictError, UnauthorizedError } from '../../errors/AppError';
import { hashPassword, hashToken, verifyPassword, verifyTokenHash } from '../../utils/password';
import { signAccessToken } from '../../utils/jwt';
import { generateSecureToken, getRefreshTokenExpiry } from '../../utils/tokens';
import { toSafeUser, SafeUser } from '../../utils/user';
import { env } from '../../config/env';
import {
  accessTokenMaxAgeMs,
  refreshTokenMaxAgeMs,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  clearAuthCookies,
  REFRESH_TOKEN_COOKIE,
} from '../../utils/cookies';
import {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
} from './auth.schema';
import { logger } from '../../lib/logger';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

async function createRefreshToken(userId: string): Promise<string> {
  const rawToken = generateSecureToken();
  const tokenHash = await hashToken(rawToken);
  const expiresAt = getRefreshTokenExpiry(env.JWT_REFRESH_EXPIRES_IN);

  await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId,
      expiresAt,
    },
  });

  return rawToken;
}

async function issueAuthTokens(user: User): Promise<AuthTokens> {
  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  const refreshToken = await createRefreshToken(user.id);
  return { accessToken, refreshToken };
}

export function setAuthCookies(res: Response, tokens: AuthTokens): void {
  setAccessTokenCookie(res, tokens.accessToken, accessTokenMaxAgeMs);
  setRefreshTokenCookie(res, tokens.refreshToken, refreshTokenMaxAgeMs);
}

async function findValidRefreshToken(rawToken: string) {
  const tokens = await prisma.refreshToken.findMany({
    where: {
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  for (const stored of tokens) {
    const isValid = await verifyTokenHash(stored.tokenHash, rawToken);
    if (isValid) {
      return stored;
    }
  }

  return null;
}

export async function register(input: RegisterInput, res: Response): Promise<SafeUser> {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existing && !existing.deletedAt) {
    throw new ConflictError('Email already registered', {
      email: ['Email is already in use'],
    });
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      status: 'ACTIVE',
    },
  });

  const tokens = await issueAuthTokens(user);
  setAuthCookies(res, tokens);

  return toSafeUser(user);
}

export async function login(input: LoginInput, res: Response): Promise<SafeUser> {
  const user = await prisma.user.findFirst({
    where: {
      email: input.email,
      deletedAt: null,
    },
  });

  if (!user || user.status !== 'ACTIVE') {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isValid = await verifyPassword(user.passwordHash, input.password);
  if (!isValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const tokens = await issueAuthTokens(user);
  setAuthCookies(res, tokens);

  return toSafeUser(user);
}

export async function logout(rawRefreshToken: string | undefined, res: Response): Promise<void> {
  if (rawRefreshToken) {
    const stored = await findValidRefreshToken(rawRefreshToken);
    if (stored) {
      await prisma.refreshToken.update({
        where: { id: stored.id },
        data: { revokedAt: new Date() },
      });
    }
  }

  clearAuthCookies(res);
}

export async function getMe(userId: string): Promise<SafeUser> {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
  });

  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  return toSafeUser(user);
}

export async function refreshTokens(
  rawRefreshToken: string | undefined,
  res: Response,
): Promise<SafeUser> {
  if (!rawRefreshToken) {
    throw new UnauthorizedError('Refresh token required');
  }

  const stored = await findValidRefreshToken(rawRefreshToken);
  if (!stored || stored.user.deletedAt || stored.user.status !== 'ACTIVE') {
    clearAuthCookies(res);
    throw new UnauthorizedError('Invalid or expired refresh token');
  }

  const newRawToken = generateSecureToken();
  const newTokenHash = await hashToken(newRawToken);
  const expiresAt = getRefreshTokenExpiry(env.JWT_REFRESH_EXPIRES_IN);

  await prisma.$transaction([
    prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    }),
    prisma.refreshToken.create({
      data: {
        tokenHash: newTokenHash,
        userId: stored.userId,
        expiresAt,
      },
    }),
  ]);

  const accessToken = signAccessToken({
    sub: stored.user.id,
    email: stored.user.email,
  });

  setAccessTokenCookie(res, accessToken, accessTokenMaxAgeMs);
  setRefreshTokenCookie(res, newRawToken, refreshTokenMaxAgeMs);

  return toSafeUser(stored.user);
}

export async function forgotPassword(input: ForgotPasswordInput): Promise<void> {
  const user = await prisma.user.findFirst({
    where: {
      email: input.email,
      deletedAt: null,
      status: 'ACTIVE',
    },
  });

  if (!user) {
    return;
  }

  const rawToken = generateSecureToken();
  const tokenHash = await hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.$transaction([
    prisma.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    }),
    prisma.passwordResetToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt,
      },
    }),
  ]);

  if (env.NODE_ENV !== 'production') {
    logger.info({ userId: user.id, resetToken: rawToken }, 'Password reset token (dev only)');
  }
}

export async function resetPassword(input: ResetPasswordInput): Promise<void> {
  const resetTokens = await prisma.passwordResetToken.findMany({
    where: {
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  let matchedToken: (typeof resetTokens)[0] | null = null;
  for (const token of resetTokens) {
    const isValid = await verifyTokenHash(token.tokenHash, input.token);
    if (isValid) {
      matchedToken = token;
      break;
    }
  }

  if (!matchedToken || matchedToken.user.deletedAt || matchedToken.user.status !== 'ACTIVE') {
    throw new BadRequestError('Invalid or expired reset token');
  }

  const passwordHash = await hashPassword(input.password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: matchedToken.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: matchedToken.id },
      data: { usedAt: new Date() },
    }),
    prisma.refreshToken.updateMany({
      where: { userId: matchedToken.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);
}

export async function changePassword(
  userId: string,
  input: ChangePasswordInput,
  res: Response,
): Promise<void> {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null, status: 'ACTIVE' },
  });

  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  const isValid = await verifyPassword(user.passwordHash, input.currentPassword);
  if (!isValid) {
    throw new BadRequestError('Current password is incorrect');
  }

  const passwordHash = await hashPassword(input.newPassword);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    }),
    prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);

  const tokens = await issueAuthTokens({ ...user, passwordHash });
  setAuthCookies(res, tokens);
}

export function getRefreshTokenFromCookies(cookies: Record<string, string>): string | undefined {
  return cookies[REFRESH_TOKEN_COOKIE];
}
