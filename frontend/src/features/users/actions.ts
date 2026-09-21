"use server";

import { ValidationError } from "yup";
import { z } from "zod";

import { getApiErrorMessage, ApiError } from "@/lib/api/errors";
import {
  createUserWithApi,
  deleteUserWithApi,
  updateUserWithApi,
} from "@/lib/api/users";
import type { ActionResult } from "@/types/api";
import type { BackendErrorResponse } from "@/types/api-contract";
import type { UserListItem } from "@/types/user";
import {
  createUserSchema,
  deleteUserSchema,
  updateUserSchema,
  type CreateUserInput,
} from "@/validators/user";

function mapZodFieldErrors(error: z.ZodError) {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "root");
    fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
  }
  return fieldErrors;
}

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

function emptyToNull(value: FormDataEntryValue | null): string | null {
  const text = typeof value === "string" ? value.trim() : "";
  return text.length > 0 ? text : null;
}

export async function createUserAction(
  input: CreateUserInput,
): Promise<ActionResult<UserListItem>> {
  try {
    const data = await createUserSchema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });

    const user = await createUserWithApi({
      email: data.email,
      password: data.password,
      firstName: data.firstName || undefined,
      lastName: data.lastName || undefined,
      status: data.status,
    });

    return {
      success: true,
      data: user,
      message: "User created successfully.",
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

export async function updateUserAction(
  _prevState: ActionResult<UserListItem> | null,
  formData: FormData,
): Promise<ActionResult<UserListItem>> {
  const parsed = updateUserSchema.safeParse({
    id: formData.get("id"),
    firstName: formData.get("firstName") || undefined,
    lastName: formData.get("lastName") || undefined,
    email: formData.get("email"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { success: false, fieldErrors: mapZodFieldErrors(parsed.error) };
  }

  try {
    const user = await updateUserWithApi(parsed.data.id, {
      email: parsed.data.email,
      firstName: emptyToNull(formData.get("firstName")),
      lastName: emptyToNull(formData.get("lastName")),
      status: parsed.data.status,
    });

    return {
      success: true,
      data: user,
      message: "User updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      error: getApiErrorMessage(error) || "Something went wrong. Please try again.",
      fieldErrors: getApiFieldErrors(error),
    };
  }
}

export async function deleteUserAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = deleteUserSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    return { success: false, fieldErrors: mapZodFieldErrors(parsed.error) };
  }

  try {
    await deleteUserWithApi(parsed.data.id);

    return {
      success: true,
      message: "User deleted successfully.",
    };
  } catch (error) {
    return {
      success: false,
      error: getApiErrorMessage(error) || "Something went wrong. Please try again.",
    };
  }
}
