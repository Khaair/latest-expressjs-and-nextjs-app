import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/features/auth/login-form";
import { FormAlert } from "@/components/features/auth/auth-layout-parts";
import { ROUTES } from "@/constants/routes";
import { siteConfig } from "@/config/site";
import { getCurrentUser } from "@/lib/api/auth";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sign in",
  description: `Sign in to your ${siteConfig.name} account to access the admin dashboard.`,
  alternates: { canonical: "/login" },
  ...noIndexMetadata,
};

interface LoginPageProps {
  searchParams: Promise<{ reset?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser();
  if (user) {
    redirect(ROUTES.dashboard);
  }

  const params = await searchParams;

  return (
    <>
      {params.reset === "success" && (
        <div className="mb-6">
          <FormAlert variant="success">
            Password reset successful. You can now sign in with your new password.
          </FormAlert>
        </div>
      )}
      <LoginForm />
    </>
  );
}
