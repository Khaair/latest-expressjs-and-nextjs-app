import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { ConflictError, NotFoundError } from '../../errors/AppError';
import { CreateBlogInput, UpdateBlogInput, ListBlogsQuery } from './blog.schema';

export interface SafeBlog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  authorId: string;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedBlogs {
  blogs: SafeBlog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function toSafeBlog(blog: {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  authorId: string;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
}): SafeBlog {
  return {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    content: blog.content,
    excerpt: blog.excerpt,
    published: blog.published,
    authorId: blog.authorId,
    categoryId: blog.categoryId,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
  };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 220);
}

async function ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let candidate = baseSlug || 'blog';
  let suffix = 0;

  while (true) {
    const slug = suffix === 0 ? candidate : `${candidate.slice(0, 210)}-${suffix}`;
    const existing = await prisma.blog.findFirst({
      where: {
        slug,
        deletedAt: null,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });

    if (!existing) return slug;
    suffix += 1;
  }
}

export async function listBlogs(query: ListBlogsQuery): Promise<PaginatedBlogs> {
  const { page, limit, search, published, categoryId, sortBy, sortOrder } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.BlogWhereInput = {
    deletedAt: null,
    ...(published !== undefined && { published }),
    ...(categoryId && { categoryId }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const [blogs, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.blog.count({ where }),
  ]);

  return {
    blogs: blogs.map(toSafeBlog),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getBlogById(id: string): Promise<SafeBlog> {
  const blog = await prisma.blog.findFirst({
    where: { id, deletedAt: null },
  });

  if (!blog) throw new NotFoundError('Blog not found');
  return toSafeBlog(blog);
}

export async function createBlog(authorId: string, input: CreateBlogInput): Promise<SafeBlog> {
  if (input.categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: input.categoryId, deletedAt: null },
    });
    if (!category) throw new NotFoundError('Category not found');
  }

  const slug = await ensureUniqueSlug(slugify(input.slug?.trim() || input.title));

  try {
    const blog = await prisma.blog.create({
      data: {
        title: input.title,
        slug,
        content: input.content,
        excerpt: input.excerpt,
        published: input.published ?? false,
        authorId,
        categoryId: input.categoryId ?? null,
      },
    });
    return toSafeBlog(blog);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ConflictError('Slug already in use', {
        slug: ['Slug is already in use'],
      });
    }
    throw error;
  }
}

export async function updateBlog(id: string, input: UpdateBlogInput): Promise<SafeBlog> {
  const existing = await prisma.blog.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) throw new NotFoundError('Blog not found');

  if (input.categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: input.categoryId, deletedAt: null },
    });
    if (!category) throw new NotFoundError('Category not found');
  }

  let slug = existing.slug;
  if (input.slug !== undefined) {
    slug = await ensureUniqueSlug(slugify(input.slug), id);
  } else if (input.title !== undefined && input.title !== existing.title) {
    slug = await ensureUniqueSlug(slugify(input.title), id);
  }

  try {
    const blog = await prisma.blog.update({
      where: { id },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.content !== undefined && { content: input.content }),
        ...(input.excerpt !== undefined && { excerpt: input.excerpt }),
        ...(input.published !== undefined && { published: input.published }),
        ...(input.categoryId !== undefined && { categoryId: input.categoryId }),
        slug,
      },
    });
    return toSafeBlog(blog);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ConflictError('Slug already in use', {
        slug: ['Slug is already in use'],
      });
    }
    throw error;
  }
}

export async function deleteBlog(id: string): Promise<void> {
  const existing = await prisma.blog.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) throw new NotFoundError('Blog not found');

  await prisma.blog.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}