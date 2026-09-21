import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/features/dashboard/admin-shell";
import { AdminTopbar } from "@/components/features/dashboard/admin-sidebar";
import { ROUTES } from "@/constants/routes";
import { getCurrentUser } from "@/lib/api/auth";
import { noIndexMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = noIndexMetadata;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.login);
  }

  return (
    <AdminShell user={{ name: user.name, email: user.email }}>
      <AdminTopbar user={{ name: user.name }} />
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
    </AdminShell>
  );
}
