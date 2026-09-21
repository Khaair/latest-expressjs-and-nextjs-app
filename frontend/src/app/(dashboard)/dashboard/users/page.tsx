import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/features/dashboard/page-header";
import { CreateUserModal } from "@/components/features/users/create-user-modal";
import { UserTable } from "@/components/features/users/user-table";
import { ROUTES } from "@/constants/routes";
import { getApiErrorMessage } from "@/lib/api/errors";
import { getCurrentUser } from "@/lib/api/auth";
import { getUsersFromApi } from "@/lib/api/users";
import { userSearchSchema } from "@/validators/user";

export const metadata: Metadata = {
  title: "Users",
};

interface UsersPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function UsersContent({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(ROUTES.login);
  }

  const parsed = userSearchSchema.parse({
    q: searchParams.q,
    page: searchParams.page,
    pageSize: searchParams.pageSize,
  });

  let result: Awaited<ReturnType<typeof getUsersFromApi>> | null = null;
  let loadError: string | null = null;

  try {
    result = await getUsersFromApi({
      search: parsed.q,
      page: parsed.page,
      pageSize: parsed.pageSize,
    });
  } catch (error) {
    loadError = getApiErrorMessage(error);
  }

  if (loadError || !result) {
    return (
      <div className="rounded-xl border border-danger/30 bg-danger-muted p-4 text-sm text-danger">
        Failed to load users: {loadError ?? "Unknown error"}
      </div>
    );
  }

  return (
    <UserTable
      users={result.data}
      page={result.page}
      totalPages={result.totalPages}
      total={result.total}
      search={parsed.q}
    />
  );
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Users"
        description="Browse and search all registered users from the backend API."
      >
        <CreateUserModal />
      </PageHeader>

      <Suspense
        fallback={
          <div className="h-48 animate-pulse rounded-xl bg-surface-muted" />
        }
      >
        <UsersContent searchParams={params} />
      </Suspense>
    </div>
  );
}
