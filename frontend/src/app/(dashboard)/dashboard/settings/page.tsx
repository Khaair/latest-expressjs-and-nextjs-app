import type { Metadata } from "next";

import { PageHeader } from "@/components/features/dashboard/page-header";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCurrentUser } from "@/lib/api/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your account and appearance preferences."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <dl className="space-y-4">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-text-muted">
                Name
              </dt>
              <dd className="mt-1 text-sm font-medium text-text-primary">{user.name}</dd>
            </div>
            <Separator />
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-text-muted">
                Email
              </dt>
              <dd className="mt-1 text-sm font-medium text-text-primary">{user.email}</dd>
            </div>
            <Separator />
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-text-muted">
                Role
              </dt>
              <dd className="mt-1 text-sm font-medium capitalize text-text-primary">
                {user.role}
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the admin panel looks</CardDescription>
          </CardHeader>
          <div className="flex items-center justify-between rounded-lg border border-border bg-surface-muted p-4">
            <div>
              <p className="text-sm font-medium text-text-primary">Theme</p>
              <p className="text-xs text-text-muted">Switch between light and dark mode</p>
            </div>
            <ThemeToggle />
          </div>
        </Card>
      </div>
    </div>
  );
}
