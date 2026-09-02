import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';
import { isProduction } from '../config/env';
import { logger } from '../lib/logger';

export function errorHandler(err: Error, req: Request, res: Response, _next: unknown): void {
  const requestId = req.requestId;

  if (err instanceof AppError) {
    logger.warn(
      { requestId, statusCode: err.statusCode, message: err.message },
      'Operational error',
    );
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
    });
    return;
  }

  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    for (const issue of err.errors) {
      const path = issue.path.join('.') || 'root';
      if (!errors[path]) errors[path] = [];
      errors[path].push(issue.message);
    }
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
    return;
  }

  logger.error(
    {
      requestId,
      err: isProduction ? { message: err.message } : err,
    },
    'Unexpected error',
  );

  res.status(500).json({
    success: false,
    message: isProduction ? 'Something went wrong' : err.message,
  });
}
