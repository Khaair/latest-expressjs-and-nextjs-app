"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import {
  AuthBrand,
  AuthCard,
  AuthFooterLink,
  AuthHeader,
  FormAlert,
} from "@/components/features/auth/auth-layout-parts";
import { resetPasswordAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { PasswordInput, PasswordStrength } from "@/components/ui/password-input";
import { ROUTES } from "@/constants/routes";
import type { ActionResult } from "@/types/api";

export function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    resetPasswordAction,
    null,
  );

  if (!token) {
    return (
      <div className="space-y-8">
        <AuthBrand />
        <AuthHeader
          title="Invalid reset link"
          subtitle="This password reset link is invalid or has expired."
        />
        <AuthCard>
          <FormAlert>Please request a new password reset link.</FormAlert>
          <Link href={ROUTES.forgotPassword} className="mt-4 block">
            <Button className="w-full" size="lg">
              Request new link
            </Button>
          </Link>
        </AuthCard>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AuthBrand />
      <AuthHeader title="Reset password" subtitle="Enter your new password below." />

      <AuthCard>
        <form action={formAction} className="space-y-5">
          <input type="hidden" name="token" value={token} />

          {state?.error && <FormAlert>{state.error}</FormAlert>}

          <div className="space-y-3">
            <PasswordInput
              name="password"
              label="New password"
              placeholder="Enter new password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={state?.fieldErrors?.password?.[0]}
            />
            <PasswordStrength password={password} />
          </div>

          <PasswordInput
            name="confirmPassword"
            label="Confirm password"
            placeholder="Confirm new password"
            required
            autoComplete="new-password"
            error={state?.fieldErrors?.confirmPassword?.[0]}
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={isPending}
            loadingText="Resetting..."
          >
            Reset Password
          </Button>

          <Link href={ROUTES.login} className="block text-center text-sm text-text-accent hover:underline">
            Back to Sign In
          </Link>
        </form>
      </AuthCard>

      <AuthFooterLink
        text="Remember your password?"
        linkText="Sign in"
        href={ROUTES.login}
      />
    </div>
  );
}
