import { Response } from 'express';
import { env, isProduction } from '../config/env';

export const ACCESS_TOKEN_COOKIE = 'access_token';
export const REFRESH_TOKEN_COOKIE = 'refresh_token';

const baseCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax' as const,
  path: '/',
};

export function setAccessTokenCookie(res: Response, token: string, maxAgeMs: number): void {
  res.cookie(ACCESS_TOKEN_COOKIE, token, {
    ...baseCookieOptions,
    maxAge: maxAgeMs,
  });
}

export function setRefreshTokenCookie(res: Response, token: string, maxAgeMs: number): void {
  res.cookie(REFRESH_TOKEN_COOKIE, token, {
    ...baseCookieOptions,
    maxAge: maxAgeMs,
    path: '/api/v1/auth',
  });
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie(ACCESS_TOKEN_COOKIE, baseCookieOptions);
  res.clearCookie(REFRESH_TOKEN_COOKIE, { ...baseCookieOptions, path: '/api/v1/auth' });
}

export function parseDurationToMs(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error(`Invalid duration format: ${duration}`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      throw new Error(`Unsupported duration unit: ${unit}`);
  }
}

export const accessTokenMaxAgeMs = parseDurationToMs(env.JWT_ACCESS_EXPIRES_IN);
export const refreshTokenMaxAgeMs = parseDurationToMs(env.JWT_REFRESH_EXPIRES_IN);
