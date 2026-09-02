"use server";

import { redirect } from "next/navigation";

import { getApiErrorMessage } from "@/lib/api/errors";
import {
  forgotPasswordWithApi,
  loginWithApi,
  logoutWithApi,
  registerWithApi,
  resetPasswordWithApi,
} from "@/lib/api/auth";
import { clearAuthToken } from "@/lib/auth/token";
import { ROUTES } from "@/constants/routes";
import type { ActionResult } from "@/types/api";
import type { AuthUser } from "@/types/auth";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/validators/auth";

import { z } from "zod";

function mapFieldErrors(error: z.ZodError) {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "root");
    fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
  }
  return fieldErrors;
}

export async function loginAction(
  _prevState: ActionResult<AuthUser> | null,
  formData: FormData,
): Promise<ActionResult<AuthUser>> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, fieldErrors: mapFieldErrors(parsed.error) };
  }

  try {
    await clearAuthToken();
    await loginWithApi(parsed.data);
  } catch (error) {
    return {
      success: false,
      error: getApiErrorMessage(error) || "Invalid email or password.",
    };
  }

  redirect(ROUTES.dashboard);
}

export async function registerAction(
  _prevState: ActionResult<AuthUser> | null,
  formData: FormData,
): Promise<ActionResult<AuthUser>> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { success: false, fieldErrors: mapFieldErrors(parsed.error) };
  }

  try {
    await clearAuthToken();
    const nameParts = parsed.data.name.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || undefined;

    await registerWithApi({
      email: parsed.data.email,
      password: parsed.data.password,
      firstName,
      lastName,
    });
  } catch (error) {
    return {
      success: false,
      error: getApiErrorMessage(error) || "Something went wrong. Please try again.",
    };
  }

  redirect(ROUTES.dashboard);
}

export async function forgotPasswordAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { success: false, fieldErrors: mapFieldErrors(parsed.error) };
  }

  try {
    await forgotPasswordWithApi(parsed.data.email);
  } catch {
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }

  return {
    success: true,
    message:
      "If an account with that email exists, a password reset link has been sent.",
  };
}

export async function resetPasswordAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { success: false, fieldErrors: mapFieldErrors(parsed.error) };
  }

  try {
    await resetPasswordWithApi({
      token: parsed.data.token,
      password: parsed.data.password,
    });
  } catch {
    return {
      success: false,
      error: "Invalid or expired reset token. Please request a new link.",
    };
  }

  redirect(`${ROUTES.login}?reset=success`);
}

export async function logoutAction(): Promise<void> {
  await logoutWithApi();
  redirect(ROUTES.login);
}
