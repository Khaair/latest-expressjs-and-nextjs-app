import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { CreateBlogModal } from "@/components/features/blogs/create-blog-modal";
import { BlogTable } from "@/components/features/blogs/blog-table";
import { PageHeader } from "@/components/features/dashboard/page-header";
import { ROUTES } from "@/constants/routes";
import { getApiErrorMessage } from "@/lib/api/errors";
import { getCurrentUser } from "@/lib/api/auth";
import { getBlogsFromApi } from "@/lib/api/blogs";
import { blogSearchSchema } from "@/validators/blog";

export const metadata: Metadata = {
  title: "Blogs",
};

interface BlogsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function BlogsContent({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect(ROUTES.login);

  const parsed = blogSearchSchema.parse({
    q: searchParams.q,
    page: searchParams.page,
    pageSize: searchParams.pageSize,
  });

  let result: Awaited<ReturnType<typeof getBlogsFromApi>> | null = null;
  let loadError: string | null = null;

  try {
    result = await getBlogsFromApi({
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
        Failed to load blogs: {loadError ?? "Unknown error"}
      </div>
    );
  }

  return (
    <BlogTable
      blogs={result.data}
      page={result.page}
      totalPages={result.totalPages}
      total={result.total}
      search={parsed.q}
    />
  );
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const params = await searchParams;

  return (
    <div className="space-y-8">
      <PageHeader title="Blogs" description="Create and manage blog posts.">
        <CreateBlogModal />
      </PageHeader>

      <Suspense fallback={<div className="h-48 animate-pulse rounded-xl bg-surface-muted" />}>
        <BlogsContent searchParams={params} />
      </Suspense>
    </div>
  );
}