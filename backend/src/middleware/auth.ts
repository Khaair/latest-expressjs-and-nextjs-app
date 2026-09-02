import { RequestHandler } from 'express';
import { UnauthorizedError } from '../errors/AppError';
import { prisma } from '../lib/prisma';
import { verifyAccessToken } from '../utils/jwt';
import { toSafeUser } from '../utils/user';
import { ACCESS_TOKEN_COOKIE } from '../utils/cookies';

export const authenticate: RequestHandler = async (req, _res, next) => {
  try {
    const token =
      req.cookies?.[ACCESS_TOKEN_COOKIE] ??
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.slice(7)
        : undefined);

    if (!token) {
      throw new UnauthorizedError('Authentication required');
    }

    const payload = verifyAccessToken(token);

    const user = await prisma.user.findFirst({
      where: {
        id: payload.sub,
        deletedAt: null,
        status: 'ACTIVE',
      },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid or expired session');
    }

    req.user = toSafeUser(user);
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
      return;
    }
    next(new UnauthorizedError('Invalid or expired session'));
  }
};
