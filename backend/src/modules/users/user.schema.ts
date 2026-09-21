import { z } from 'zod';
import { UserStatus } from '@prisma/client';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters'),
  firstName: z.string().trim().min(1).max(100).optional(),
  lastName: z.string().trim().min(1).max(100).optional(),
  status: z.nativeEnum(UserStatus).optional(),
});

export const updateUserSchema = z
  .object({
    email: z.string().email('Invalid email address').toLowerCase().trim().optional(),
    firstName: z.string().trim().min(1).max(100).nullable().optional(),
    lastName: z.string().trim().min(1).max(100).nullable().optional(),
    status: z.nativeEnum(UserStatus).optional(),
  })
  .strict();

export const userIdParamSchema = z.object({
  id: z.string().uuid('Invalid user ID'),
});

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  status: z.nativeEnum(UserStatus).optional(),
  sortBy: z.enum(['createdAt', 'email', 'firstName', 'lastName', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const updateUserStatusSchema = z.object({
  status: z.nativeEnum(UserStatus),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
