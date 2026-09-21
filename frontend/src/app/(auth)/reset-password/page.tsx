import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ResetPasswordForm } from "@/components/features/auth/reset-password-form";
import { ROUTES } from "@/constants/routes";
import { siteConfig } from "@/config/site";
import { getCurrentUser } from "@/lib/api/auth";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Reset password",
  description: `Choose a new password for your ${siteConfig.name} account.`,
  ...noIndexMetadata,
};

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const user = await getCurrentUser();
  if (user) {
    redirect(ROUTES.dashboard);
  }

  const params = await searchParams;

  return <ResetPasswordForm token={params.token ?? ""} />;
}
