import "server-only";

import type {
  BackendCategoriesData,
  BackendCategory,
  BackendCategoryData,
  BackendCreateCategoryBody,
  BackendUpdateCategoryBody,
} from "@/types/api-contract";
import type { CategoryListItem } from "@/types/category";

import { apiClient } from "./client";

function mapCategory(category: BackendCategory): CategoryListItem {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

export async function getCategoriesFromApi(options: {
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

  const result = await apiClient<BackendCategoriesData>(`/categories?${params.toString()}`);

  return {
    data: result.categories.map(mapCategory),
    total: result.pagination.total,
    page: result.pagination.page,
    pageSize: result.pagination.limit,
    totalPages: result.pagination.totalPages,
  };
}

export async function createCategoryWithApi(input: BackendCreateCategoryBody) {
  const { category } = await apiClient<BackendCategoryData>("/categories", {
    method: "POST",
    body: input,
  });

  return mapCategory(category);
}

export async function updateCategoryWithApi(id: string, input: BackendUpdateCategoryBody) {
  const { category } = await apiClient<BackendCategoryData>(`/categories/${id}`, {
    method: "PATCH",
    body: input,
  });

  return mapCategory(category);
}

export async function deleteCategoryWithApi(id: string) {
  await apiClient(`/categories/${id}`, {
    method: "DELETE",
  });
}
