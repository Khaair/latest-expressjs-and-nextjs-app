import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { ConflictError, NotFoundError } from '../../errors/AppError';
import { CreateCategoryInput, UpdateCategoryInput, ListCategoriesQuery } from './category.schema';

export interface SafeCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedCategories {
  categories: SafeCategory[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function toSafeCategory(category: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}): SafeCategory {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

async function ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let candidate = baseSlug || 'category';
  let suffix = 0;

  while (true) {
    const slug = suffix === 0 ? candidate : `${candidate.slice(0, 110)}-${suffix}`;
    const existing = await prisma.category.findFirst({
      where: {
        slug,
        deletedAt: null,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });

    if (!existing) {
      return slug;
    }

    suffix += 1;
  }
}

export async function listCategories(query: ListCategoriesQuery): Promise<PaginatedCategories> {
  const { page, limit, search, sortBy, sortOrder } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.CategoryWhereInput = {
    deletedAt: null,
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.category.count({ where }),
  ]);

  return {
    categories: categories.map(toSafeCategory),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getCategoryById(id: string): Promise<SafeCategory> {
  const category = await prisma.category.findFirst({
    where: { id, deletedAt: null },
  });

  if (!category) {
    throw new NotFoundError('Category not found');
  }

  return toSafeCategory(category);
}

export async function createCategory(input: CreateCategoryInput): Promise<SafeCategory> {
  const baseSlug = slugify(input.slug?.trim() || input.name);
  const slug = await ensureUniqueSlug(baseSlug);

  try {
    const category = await prisma.category.create({
      data: {
        name: input.name,
        slug,
        description: input.description,
      },
    });

    return toSafeCategory(category);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ConflictError('Slug already in use', {
        slug: ['Slug is already in use'],
      });
    }
    throw error;
  }
}

export async function updateCategory(
  id: string,
  input: UpdateCategoryInput,
): Promise<SafeCategory> {
  const existing = await prisma.category.findFirst({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    throw new NotFoundError('Category not found');
  }

  let slug = existing.slug;
  if (input.slug !== undefined) {
    slug = await ensureUniqueSlug(slugify(input.slug), id);
  } else if (input.name !== undefined && input.name !== existing.name) {
    slug = await ensureUniqueSlug(slugify(input.name), id);
  }

  try {
    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.description !== undefined && { description: input.description }),
        slug,
      },
    });

    return toSafeCategory(category);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ConflictError('Slug already in use', {
        slug: ['Slug is already in use'],
      });
    }
    throw error;
  }
}

export async function deleteCategory(id: string): Promise<void> {
  const existing = await prisma.category.findFirst({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    throw new NotFoundError('Category not found');
  }

  await prisma.category.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}
