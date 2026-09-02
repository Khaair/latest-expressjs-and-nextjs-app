import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { RegisterForm } from "@/components/features/auth/register-form";
import { ROUTES } from "@/constants/routes";
import { getCurrentUser } from "@/lib/api/auth";

export const metadata: Metadata = {
  title: "Create account",
};

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect(ROUTES.dashboard);
  }

  return <RegisterForm />;
}
