import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { CreateCategoryModal } from "@/components/features/categories/create-category-modal";
import { CategoryTable } from "@/components/features/categories/category-table";
import { PageHeader } from "@/components/features/dashboard/page-header";
import { ROUTES } from "@/constants/routes";
import { getApiErrorMessage } from "@/lib/api/errors";
import { getCurrentUser } from "@/lib/api/auth";
import { getCategoriesFromApi } from "@/lib/api/categories";
import { categorySearchSchema } from "@/validators/category";

export const metadata: Metadata = {
  title: "Categories",
};

interface CategoriesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function CategoriesContent({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(ROUTES.login);
  }

  const parsed = categorySearchSchema.parse({
    q: searchParams.q,
    page: searchParams.page,
    pageSize: searchParams.pageSize,
  });

  let result: Awaited<ReturnType<typeof getCategoriesFromApi>> | null = null;
  let loadError: string | null = null;

  try {
    result = await getCategoriesFromApi({
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
        Failed to load categories: {loadError ?? "Unknown error"}
      </div>
    );
  }

  return (
    <CategoryTable
      categories={result.data}
      page={result.page}
      totalPages={result.totalPages}
      total={result.total}
      search={parsed.q}
    />
  );
}

export default async function CategoriesPage({ searchParams }: CategoriesPageProps) {
  const params = await searchParams;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Categories"
        description="Create and manage content categories."
      >
        <CreateCategoryModal />
      </PageHeader>

      <Suspense
        fallback={
          <div className="h-48 animate-pulse rounded-xl bg-surface-muted" />
        }
      >
        <CategoriesContent searchParams={params} />
      </Suspense>
    </div>
  );
}
