import type { Metadata } from "next";

import { PageHeader } from "@/components/features/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/api/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const stats = [
    { label: "Email", value: user.email, mono: false },
    { label: "Role", value: user.role, badge: true },
    { label: "User ID", value: user.id, mono: true },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${user.name}`}
        description="Here's an overview of your account and platform activity."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="transition-shadow hover:shadow-md">
            <CardHeader className="mb-2">
              <CardDescription>{stat.label}</CardDescription>
            </CardHeader>
            {stat.badge ? (
              <Badge variant="accent">{stat.value}</Badge>
            ) : (
              <p
                className={
                  stat.mono
                    ? "truncate font-mono text-sm text-text-primary"
                    : "text-lg font-semibold text-text-primary"
                }
              >
                {stat.value}
              </p>
            )}
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
          <CardDescription>Common tasks for your admin workspace</CardDescription>
        </CardHeader>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { title: "Manage users", desc: "View and search all registered users" },
            { title: "Account settings", desc: "Update your profile preferences" },
            { title: "API health", desc: "Backend connected and running" },
          ].map((action) => (
            <div
              key={action.title}
              className="rounded-lg border border-border-subtle bg-surface-muted p-4 transition-colors hover:border-border hover:bg-surface"
            >
              <p className="text-sm font-medium text-text-primary">{action.title}</p>
              <p className="mt-1 text-xs text-text-muted">{action.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
