import "server-only";

import { cookies } from "next/headers";

import { AUTH_TOKEN_COOKIE } from "@/constants/cookies";
import { setAuthToken } from "@/lib/auth/token";
import type { BackendErrorResponse, BackendSuccessResponse } from "@/types/api-contract";

import { apiConfig } from "./config";
import { ApiError } from "./errors";

interface ApiClientOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  token?: string | null;
  captureAuthToken?: boolean;
}

function extractAccessToken(response: Response): string | null {
  const setCookies =
    typeof response.headers.getSetCookie === "function"
      ? response.headers.getSetCookie()
      : [];

  for (const cookie of setCookies) {
    const match = cookie.match(/^access_token=([^;]+)/);
    if (match?.[1]) {
      return decodeURIComponent(match[1]);
    }
  }

  const single = response.headers.get("set-cookie");
  if (single) {
    const match = single.match(/access_token=([^;]+)/);
    if (match?.[1]) {
      return decodeURIComponent(match[1]);
    }
  }

  return null;
}

export async function apiClient<T>(
  path: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const { body, token, captureAuthToken, headers: customHeaders, ...rest } = options;

  const cookieStore = await cookies();
  const authToken = token ?? cookieStore.get(AUTH_TOKEN_COOKIE)?.value ?? null;

  const headers = new Headers(customHeaders);
  headers.set("Accept", "application/json");

  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  const response = await fetch(`${apiConfig.baseUrl}${path}`, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const json = (await response.json().catch(() => ({}))) as
    | BackendSuccessResponse<T>
    | BackendErrorResponse
    | Record<string, unknown>;

  if (!response.ok || json.success === false) {
    const errorBody = json as BackendErrorResponse;
    throw new ApiError(
      response.status,
      errorBody.message ?? response.statusText,
      errorBody,
    );
  }

  if (captureAuthToken) {
    const accessToken = extractAccessToken(response);
    if (accessToken) {
      await setAuthToken(accessToken);
    }
  }

  if ("data" in json && json.success === true) {
    return json.data as T;
  }

  return json as T;
}
