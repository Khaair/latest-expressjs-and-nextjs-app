import "server-only";

import type {
  BackendBlog,
  BackendBlogData,
  BackendBlogsData,
  BackendCreateBlogBody,
  BackendUpdateBlogBody,
} from "@/types/api-contract";
import type { BlogListItem } from "@/types/blog";

import { apiClient } from "./client";

function mapBlog(blog: BackendBlog): BlogListItem {
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

export async function getBlogsFromApi(options: {
  search?: string;
  page: number;
  pageSize: number;
}) {
  const params = new URLSearchParams({
    page: String(options.page),
    limit: String(options.pageSize),
  });

  if (options.search) {
    params.set("search", options.search);
  }

  const result = await apiClient<BackendBlogsData>(`/blogs?${params.toString()}`);

  return {
    data: result.blogs.map(mapBlog),
    total: result.pagination.total,
    page: result.pagination.page,
    pageSize: result.pagination.limit,
    totalPages: result.pagination.totalPages,
  };
}

export async function createBlogWithApi(input: BackendCreateBlogBody) {
  const { blog } = await apiClient<BackendBlogData>("/blogs", {
    method: "POST",
    body: input,
  });

  return mapBlog(blog);
}

export async function updateBlogWithApi(id: string, input: BackendUpdateBlogBody) {
  const { blog } = await apiClient<BackendBlogData>(`/blogs/${id}`, {
    method: "PATCH",
    body: input,
  });

  return mapBlog(blog);
}

export async function deleteBlogWithApi(id: string) {
  await apiClient(`/blogs/${id}`, {
    method: "DELETE",
  });
}