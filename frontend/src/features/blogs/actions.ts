"use server";

import { ValidationError } from "yup";

import { getApiErrorMessage, ApiError } from "@/lib/api/errors";
import {
  createBlogWithApi,
  deleteBlogWithApi,
  updateBlogWithApi,
} from "@/lib/api/blogs";
import type { ActionResult } from "@/types/api";
import type { BackendErrorResponse } from "@/types/api-contract";
import type { BlogListItem } from "@/types/blog";
import {
  createBlogSchema,
  deleteBlogSchema,
  updateBlogSchema,
  type CreateBlogInput,
  type UpdateBlogInput,
} from "@/validators/blog";

function mapYupFieldErrors(error: ValidationError) {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.inner.length > 0 ? error.inner : [error]) {
    const field = String(issue.path ?? "root");
    if (!issue.message) continue;
    fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
  }
  return fieldErrors;
}

function getApiFieldErrors(error: unknown): Record<string, string[]> | undefined {
  if (error instanceof ApiError && error.data && typeof error.data === "object") {
    return (error.data as BackendErrorResponse).errors;
  }
  return undefined;
}

export async function createBlogAction(
  input: CreateBlogInput,
): Promise<ActionResult<BlogListItem>> {
  try {
    const data = await createBlogSchema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });

    const blog = await createBlogWithApi({
      title: data.title,
      slug: data.slug ?? undefined,
      content: data.content,
      excerpt: data.excerpt ?? undefined,
      published: data.published ?? false,
      categoryId: data.categoryId ?? null,
    });

    return { success: true, data: blog, message: "Blog created successfully." };
  } catch (error) {
    if (error instanceof ValidationError) {
      return { success: false, fieldErrors: mapYupFieldErrors(error) };
    }
    return {
      success: false,
      error: getApiErrorMessage(error) || "Something went wrong. Please try again.",
      fieldErrors: getApiFieldErrors(error),
    };
  }
}

export async function updateBlogAction(
  input: UpdateBlogInput,
): Promise<ActionResult<BlogListItem>> {
  try {
    const data = await updateBlogSchema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });

    const blog = await updateBlogWithApi(data.id, {
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt ?? null,
      published: data.published,
      categoryId: data.categoryId ?? null,
    });

    return { success: true, data: blog, message: "Blog updated successfully." };
  } catch (error) {
    if (error instanceof ValidationError) {
      return { success: false, fieldErrors: mapYupFieldErrors(error) };
    }
    return {
      success: false,
      error: getApiErrorMessage(error) || "Something went wrong. Please try again.",
      fieldErrors: getApiFieldErrors(error),
    };
  }
}

export async function deleteBlogAction(id: string): Promise<ActionResult> {
  try {
    const data = await deleteBlogSchema.validate(
      { id },
      { abortEarly: false, stripUnknown: true },
    );
    await deleteBlogWithApi(data.id);
    return { success: true, message: "Blog deleted successfully." };
  } catch (error) {
    if (error instanceof ValidationError) {
      return { success: false, fieldErrors: mapYupFieldErrors(error) };
    }
    return {
      success: false,
      error: getApiErrorMessage(error) || "Something went wrong. Please try again.",
    };
  }
}