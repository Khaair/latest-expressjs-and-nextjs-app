import { UserStatus } from '@prisma/client';
import { SafeUser } from '../utils/user';

declare global {
  namespace Express {
    interface Request {
      requestId: string;
      user?: SafeUser;
    }
  }
}

export {};

export type AuthenticatedRequest = Express.Request & {
  user: SafeUser;
};

export { UserStatus };
