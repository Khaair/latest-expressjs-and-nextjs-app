"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  AuthBrand,
  AuthCard,
  AuthFooterLink,
  AuthHeader,
  FormAlert,
} from "@/components/features/auth/auth-layout-parts";
import { forgotPasswordAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import type { ActionResult } from "@/types/api";

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    forgotPasswordAction,
    null,
  );

  if (state?.success) {
    return (
      <div className="space-y-8">
        <AuthBrand />
        <AuthHeader
          title="Check your email"
          subtitle="If an account exists, we sent password reset instructions."
        />
        <AuthCard>
          <FormAlert variant="success">{state.message}</FormAlert>
          <Link href={ROUTES.login} className="mt-4 block">
            <Button variant="secondary" className="w-full" size="lg">
              Back to Sign In
            </Button>
          </Link>
        </AuthCard>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AuthBrand />
      <AuthHeader
        title="Forgot password?"
        subtitle="Enter your email and we'll send you a reset link."
      />

      <AuthCard>
        <form action={formAction} className="space-y-5">
          {state?.error && <FormAlert>{state.error}</FormAlert>}

          <Input
            name="email"
            type="email"
            label="Email address"
            placeholder="you@example.com"
            required
            autoComplete="email"
            error={state?.fieldErrors?.email?.[0]}
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={isPending}
            loadingText="Sending..."
          >
            Send reset link
          </Button>

          <Link href={ROUTES.login} className="block text-center text-sm text-text-accent hover:underline">
            Back to Sign In
          </Link>
        </form>
      </AuthCard>

      <AuthFooterLink
        text="Don't have an account?"
        linkText="Create account"
        href={ROUTES.register}
      />
    </div>
  );
}
