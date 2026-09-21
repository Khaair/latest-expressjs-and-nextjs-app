"use server";

import { ValidationError } from "yup";

import { getApiErrorMessage, ApiError } from "@/lib/api/errors";
import {
  createCategoryWithApi,
  deleteCategoryWithApi,
  updateCategoryWithApi,
} from "@/lib/api/categories";
import type { ActionResult } from "@/types/api";
import type { BackendErrorResponse } from "@/types/api-contract";
import type { CategoryListItem } from "@/types/category";
import {
  createCategorySchema,
  deleteCategorySchema,
  updateCategorySchema,
  type CreateCategoryInput,
  type UpdateCategoryInput,
} from "@/validators/category";

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
    const body = error.data as BackendErrorResponse;
    return body.errors;
  }
  return undefined;
}

export async function createCategoryAction(
  input: CreateCategoryInput,
): Promise<ActionResult<CategoryListItem>> {
  try {
    const data = await createCategorySchema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });

    const category = await createCategoryWithApi({
      name: data.name,
      slug: data.slug ?? undefined,
      description: data.description ?? undefined,
    });

    return {
      success: true,
      data: category,
      message: "Category created successfully.",
    };
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

export async function updateCategoryAction(
  input: UpdateCategoryInput,
): Promise<ActionResult<CategoryListItem>> {
  try {
    const data = await updateCategorySchema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });

    const category = await updateCategoryWithApi(data.id, {
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
    });

    return {
      success: true,
      data: category,
      message: "Category updated successfully.",
    };
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

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  try {
    const data = await deleteCategorySchema.validate(
      { id },
      { abortEarly: false, stripUnknown: true },
    );

    await deleteCategoryWithApi(data.id);

    return {
      success: true,
      message: "Category deleted successfully.",
    };
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
