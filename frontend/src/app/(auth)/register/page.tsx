import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { RegisterForm } from "@/components/features/auth/register-form";
import { ROUTES } from "@/constants/routes";
import { siteConfig } from "@/config/site";
import { getCurrentUser } from "@/lib/api/auth";

export const metadata: Metadata = {
  title: "Create account",
  description: `Create your ${siteConfig.name} account and get started with the admin platform.`,
  alternates: { canonical: "/register" },
};

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect(ROUTES.dashboard);
  }

  return <RegisterForm />;
}
