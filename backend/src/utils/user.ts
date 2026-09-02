import { User, UserStatus } from '@prisma/client';

export interface SafeUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export function toSafeUser(user: User): SafeUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export const PROTECTED_USER_FIELDS = [
  'passwordHash',
  'password',
  'id',
  'status',
  'deletedAt',
] as const;
