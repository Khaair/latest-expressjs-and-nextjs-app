import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ForgotPasswordForm } from "@/components/features/auth/forgot-password-form";
import { ROUTES } from "@/constants/routes";
import { siteConfig } from "@/config/site";
import { getCurrentUser } from "@/lib/api/auth";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Forgot password",
  description: `Request a password reset link for your ${siteConfig.name} account.`,
  alternates: { canonical: "/forgot-password" },
  ...noIndexMetadata,
};

export default async function ForgotPasswordPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect(ROUTES.dashboard);
  }

  return <ForgotPasswordForm />;
}
