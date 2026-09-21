import { Prisma, UserStatus } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from '../../errors/AppError';
import { hashPassword } from '../../utils/password';
import { toSafeUser, SafeUser } from '../../utils/user';
import {
  CreateUserInput,
  UpdateUserInput,
  ListUsersQuery,
  UpdateUserStatusInput,
} from './user.schema';

export interface PaginatedUsers {
  users: SafeUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function assertOwnership(requesterId: string, targetId: string): void {
  if (requesterId !== targetId) {
    throw new ForbiddenError('You do not have permission to access this resource');
  }
}

export async function listUsers(query: ListUsersQuery): Promise<PaginatedUsers> {
  const { page, limit, search, status, sortBy, sortOrder } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {
    deletedAt: null,
    ...(status && { status }),
    ...(search && {
      OR: [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users: users.map(toSafeUser),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getUserById(requesterId: string, targetId: string): Promise<SafeUser> {
  assertOwnership(requesterId, targetId);

  const user = await prisma.user.findFirst({
    where: { id: targetId, deletedAt: null },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return toSafeUser(user);
}

export async function createUser(input: CreateUserInput): Promise<SafeUser> {
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
      status: input.status ?? UserStatus.ACTIVE,
    },
  });

  return toSafeUser(user);
}

export async function updateUser(
  requesterId: string,
  targetId: string,
  input: UpdateUserInput,
): Promise<SafeUser> {
  const existing = await prisma.user.findFirst({
    where: { id: targetId, deletedAt: null },
  });

  if (!existing) {
    throw new NotFoundError('User not found');
  }

  if (input.status === UserStatus.INACTIVE && requesterId === targetId) {
    throw new BadRequestError('You cannot deactivate your own account');
  }

  if (input.email && input.email !== existing.email) {
    const emailTaken = await prisma.user.findFirst({
      where: {
        email: input.email,
        deletedAt: null,
        NOT: { id: targetId },
      },
    });

    if (emailTaken) {
      throw new ConflictError('Email already in use', {
        email: ['Email is already in use'],
      });
    }
  }

  const user = await prisma.user.update({
    where: { id: targetId },
    data: {
      ...(input.email !== undefined && { email: input.email }),
      ...(input.firstName !== undefined && { firstName: input.firstName }),
      ...(input.lastName !== undefined && { lastName: input.lastName }),
      ...(input.status !== undefined && { status: input.status }),
    },
  });

  if (input.status === UserStatus.INACTIVE) {
    await prisma.refreshToken.updateMany({
      where: { userId: targetId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  return toSafeUser(user);
}

export async function deleteUser(_requesterId: string, targetId: string): Promise<void> {
  const existing = await prisma.user.findFirst({
    where: { id: targetId, deletedAt: null },
  });

  if (!existing) {
    throw new NotFoundError('User not found');
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: targetId },
      data: {
        deletedAt: new Date(),
        status: UserStatus.INACTIVE,
      },
    }),
    prisma.refreshToken.updateMany({
      where: { userId: targetId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);
}

export async function updateUserStatus(
  requesterId: string,
  targetId: string,
  input: UpdateUserStatusInput,
): Promise<SafeUser> {
  const existing = await prisma.user.findFirst({
    where: { id: targetId, deletedAt: null },
  });

  if (!existing) {
    throw new NotFoundError('User not found');
  }

  if (input.status === UserStatus.INACTIVE && requesterId === targetId) {
    throw new BadRequestError('You cannot deactivate your own account through this endpoint');
  }

  const user = await prisma.user.update({
    where: { id: targetId },
    data: { status: input.status },
  });

  if (input.status === UserStatus.INACTIVE) {
    await prisma.refreshToken.updateMany({
      where: { userId: targetId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  return toSafeUser(user);
}
