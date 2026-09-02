import "server-only";

import { UnauthorizedError } from "@/lib/errors";
import { ROLES } from "@/constants/roles";
import { clearAuthToken } from "@/lib/auth/token";
import type { AuthUser } from "@/types/auth";
import type {
  BackendAuthData,
  BackendLoginBody,
  BackendRegisterBody,
  BackendUser,
} from "@/types/api-contract";
import type { LoginInput } from "@/validators/auth";

import { apiClient } from "./client";

function mapBackendUser(user: BackendUser): AuthUser {
  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
    (user.email.split("@")[0] ?? user.email);

  return {
    id: user.id,
    email: user.email,
    name,
    role: ROLES.USER,
  };
}

export async function loginWithApi(input: LoginInput): Promise<AuthUser> {
  const { user } = await apiClient<BackendAuthData>("/auth/login", {
    method: "POST",
    body: input satisfies BackendLoginBody,
    token: null,
    captureAuthToken: true,
  });

  return mapBackendUser(user);
}

export async function registerWithApi(input: BackendRegisterBody): Promise<AuthUser> {
  const { user } = await apiClient<BackendAuthData>("/auth/register", {
    method: "POST",
    body: input,
    token: null,
    captureAuthToken: true,
  });

  return mapBackendUser(user);
}

export async function forgotPasswordWithApi(email: string): Promise<void> {
  await apiClient("/auth/forgot-password", {
    method: "POST",
    body: { email },
    token: null,
  });
}

export async function resetPasswordWithApi(input: {
  token: string;
  password: string;
}): Promise<void> {
  await apiClient("/auth/reset-password", {
    method: "POST",
    body: input,
    token: null,
  });
}

export async function logoutWithApi(): Promise<void> {
  try {
    await apiClient("/auth/logout", { method: "POST" });
  } catch {
    // Clear local session even if the API is unreachable.
  }

  await clearAuthToken();
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { user } = await apiClient<BackendAuthData>("/auth/me");
    return mapBackendUser(user);
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new UnauthorizedError();
  }
  return user;
}
