import Link from "next/link";

import { BlogRowActions } from "@/components/features/blogs/blog-row-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BlogListItem } from "@/types/blog";

interface BlogTableProps {
  blogs: BlogListItem[];
  page: number;
  totalPages: number;
  total: number;
  search?: string;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(value));
}

export function BlogTable({ blogs, page, totalPages, total, search }: BlogTableProps) {
  return (
    <div className="space-y-4">
      <form className="flex flex-col gap-3 sm:flex-row">
        <input
          name="q"
          type="search"
          defaultValue={search}
          placeholder="Search by title, slug, or excerpt..."
          className="flex h-10 flex-1 rounded-lg border border-border bg-surface px-3 text-sm text-text-primary shadow-sm placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring/20"
        />
        <Button type="submit" className="sm:w-auto">
          Search
        </Button>
      </form>

      <p className="text-sm text-text-muted">
        <span className="font-medium text-text-primary">{total}</span> blog
        {total === 1 ? "" : "s"} found
      </p>

      <div className="overflow-hidden rounded-xl border border-border bg-surface-raised shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Title</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Slug</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Status</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Created</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-text-muted">
                    No blogs found
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog.id} className="transition-colors hover:bg-surface-muted/60">
                    <td className="px-4 py-3.5 font-medium text-text-primary">{blog.title}</td>
                    <td className="px-4 py-3.5 text-text-secondary">{blog.slug}</td>
                    <td className="px-4 py-3.5">
                      <Badge variant={blog.published ? "success" : "default"}>
                        {blog.published ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-text-muted">{formatDate(blog.createdAt)}</td>
                    <td className="px-4 py-3.5">
                      <BlogRowActions blog={blog} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-text-muted">
            Page <span className="font-medium text-text-primary">{page}</span> of{" "}
            <span className="font-medium text-text-primary">{totalPages}</span>
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={`?page=${page - 1}${search ? `&q=${encodeURIComponent(search)}` : ""}`}>
                <Button variant="secondary" size="sm">Previous</Button>
              </Link>
            )}
            {page < totalPages && (
              <Link href={`?page=${page + 1}${search ? `&q=${encodeURIComponent(search)}` : ""}`}>
                <Button variant="secondary" size="sm">Next</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}