import "server-only";

import type {
  BackendAuthData,
  BackendCreateUserBody,
  BackendUpdateUserBody,
  BackendUsersData,
} from "@/types/api-contract";
import type { UserListItem } from "@/types/user";

import { apiClient } from "./client";

function mapUserListItem(user: BackendUsersData["users"][number]): UserListItem {
  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
    (user.email.split("@")[0] ?? user.email);

  return {
    id: user.id,
    email: user.email,
    name,
    firstName: user.firstName,
    lastName: user.lastName,
    status: user.status,
    createdAt: user.createdAt,
  };
}

export async function getUsersFromApi(options: {
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

  const result = await apiClient<BackendUsersData>(`/users?${params.toString()}`);

  return {
    data: result.users.map(mapUserListItem),
    total: result.pagination.total,
    page: result.pagination.page,
    pageSize: result.pagination.limit,
    totalPages: result.pagination.totalPages,
  };
}

export async function createUserWithApi(input: BackendCreateUserBody) {
  const { user } = await apiClient<BackendAuthData>("/users", {
    method: "POST",
    body: input,
  });

  return mapUserListItem(user);
}

export async function updateUserWithApi(id: string, input: BackendUpdateUserBody) {
  const { user } = await apiClient<BackendAuthData>(`/users/${id}`, {
    method: "PATCH",
    body: input,
  });

  return mapUserListItem(user);
}

export async function deleteUserWithApi(id: string) {
  await apiClient(`/users/${id}`, {
    method: "DELETE",
  });
}
