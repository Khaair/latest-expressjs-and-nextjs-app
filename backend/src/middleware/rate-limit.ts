import { RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';
import { TooManyRequestsError } from '../errors/AppError';
import { isTest } from '../config/env';

const noopLimiter: RequestHandler = (_req, _res, next) => next();

const rateLimitHandler: RequestHandler = (_req, _res, next) => {
  next(new TooManyRequestsError('Too many requests, please try again later'));
};

const ONE_MINUTE_MS = 60 * 1000;

export const generalRateLimiter = isTest
  ? noopLimiter
  : rateLimit({
      windowMs: ONE_MINUTE_MS,
      max: 60,
      standardHeaders: true,
      legacyHeaders: false,
      handler: rateLimitHandler,
    });

export const authRateLimiter = isTest
  ? noopLimiter
  : rateLimit({
      windowMs: ONE_MINUTE_MS,
      max: 60,
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: false,
      handler: rateLimitHandler,
    });

export const passwordResetRateLimiter = isTest
  ? noopLimiter
  : rateLimit({
      windowMs: ONE_MINUTE_MS,
      max: 10,
      standardHeaders: true,
      legacyHeaders: false,
      handler: rateLimitHandler,
    });
