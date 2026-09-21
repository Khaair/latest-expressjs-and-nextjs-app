import { z } from 'zod';

export const createBlogSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  slug: z
    .string()
    .trim()
    .max(220)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers, and hyphens')
    .optional(),
  content: z.string().trim().min(1, 'Content is required'),
  excerpt: z.string().trim().max(500).optional(),
  published: z.boolean().optional(),
  categoryId: z.string().uuid('Invalid category ID').nullable().optional(),
});

export const updateBlogSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    slug: z
      .string()
      .trim()
      .max(220)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers, and hyphens')
      .optional(),
    content: z.string().trim().min(1).optional(),
    excerpt: z.string().trim().max(500).nullable().optional(),
    published: z.boolean().optional(),
    categoryId: z.string().uuid('Invalid category ID').nullable().optional(),
  })
  .strict();

export const blogIdParamSchema = z.object({
  id: z.string().uuid('Invalid blog ID'),
});

export const listBlogsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  published: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === 'true')),
  categoryId: z.string().uuid().optional(),
  sortBy: z.enum(['createdAt', 'title', 'published']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type ListBlogsQuery = z.infer<typeof listBlogsQuerySchema>;