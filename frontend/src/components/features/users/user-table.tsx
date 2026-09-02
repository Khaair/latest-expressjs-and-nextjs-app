import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { UserListItem } from "@/types/user";

interface UserTableProps {
  users: UserListItem[];
  page: number;
  totalPages: number;
  total: number;
  search?: string;
}

function statusVariant(status: UserListItem["status"]) {
  switch (status) {
    case "ACTIVE":
      return "success" as const;
    case "INACTIVE":
      return "warning" as const;
    case "PENDING":
      return "default" as const;
    default:
      return "default" as const;
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(value));
}

export function UserTable({ users, page, totalPages, total, search }: UserTableProps) {
  return (
    <div className="space-y-4">
      <form className="flex flex-col gap-3 sm:flex-row">
        <input
          name="q"
          type="search"
          defaultValue={search}
          placeholder="Search by name or email..."
          className="flex h-10 flex-1 rounded-lg border border-border bg-surface px-3 text-sm text-text-primary shadow-sm placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring/20"
        />
        <Button type="submit" className="sm:w-auto">
          Search
        </Button>
      </form>

      <div className="flex items-center justify-between text-sm">
        <p className="text-text-muted">
          <span className="font-medium text-text-primary">{total}</span> user
          {total === 1 ? "" : "s"} found
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface-raised shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Name
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Email
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-text-muted">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-surface-muted/60"
                  >
                    <td className="px-4 py-3.5 font-medium text-text-primary">{user.name}</td>
                    <td className="px-4 py-3.5 text-text-secondary">{user.email}</td>
                    <td className="px-4 py-3.5">
                      <Badge variant={statusVariant(user.status)}>{user.status}</Badge>
                    </td>
                    <td className="px-4 py-3.5 text-text-muted">{formatDate(user.createdAt)}</td>
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
              <Link
                href={`?page=${page - 1}${search ? `&q=${encodeURIComponent(search)}` : ""}`}
              >
                <Button variant="secondary" size="sm">
                  Previous
                </Button>
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`?page=${page + 1}${search ? `&q=${encodeURIComponent(search)}` : ""}`}
              >
                <Button variant="secondary" size="sm">
                  Next
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
