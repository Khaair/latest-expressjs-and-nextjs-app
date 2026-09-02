import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ForgotPasswordForm } from "@/components/features/auth/forgot-password-form";
import { ROUTES } from "@/constants/routes";
import { getCurrentUser } from "@/lib/api/auth";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default async function ForgotPasswordPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect(ROUTES.dashboard);
  }

  return <ForgotPasswordForm />;
}
